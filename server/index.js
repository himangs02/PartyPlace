import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialData } from './data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize / Load JSON Database
let db = { ...initialData };

function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data);
      console.log('✅ Loaded database from server/data/db.json');
    } else {
      saveDb();
      console.log('ℹ️ Created server/data/db.json with initial seed data');
    }
  } catch (err) {
    console.error('Error loading db file, using initial data:', err);
    db = { ...initialData };
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db file:', err);
  }
}

loadDb();

// ----------------- API ENDPOINTS -----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PartyPlace API', timestamp: new Date().toISOString() });
});

// Settings & Config
app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDb();
  res.json({ success: true, settings: db.settings });
});

// Spaces List with filtering & sorting
app.get('/api/spaces', (req, res) => {
  let { search, location, category, minPrice, maxPrice, minGuests, verifiedOnly, sort } = req.query;
  let results = [...db.spaces];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.area.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  }

  if (location && location !== 'all') {
    const loc = location.toLowerCase();
    results = results.filter(s => 
      s.city.toLowerCase().includes(loc) || 
      s.area.toLowerCase().includes(loc)
    );
  }

  if (category && category !== 'all') {
    results = results.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }

  if (minPrice) {
    results = results.filter(s => s.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter(s => s.price <= Number(maxPrice));
  }

  if (minGuests) {
    results = results.filter(s => s.capacity >= Number(minGuests));
  }

  if (verifiedOnly === 'true') {
    results = results.filter(s => s.verified);
  }

  // Sorting
  if (sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'capacity') {
    results.sort((a, b) => b.capacity - a.capacity);
  } else {
    // Default: recommended / featured first
    results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  res.json(results);
});

// Space Details by ID
app.get('/api/spaces/:id', (req, res) => {
  const space = db.spaces.find(s => s.id === req.params.id);
  if (!space) {
    return res.status(404).json({ error: 'Space not found' });
  }
  const reviews = db.reviews.filter(r => r.spaceId === space.id);
  res.json({ ...space, reviews });
});

// Create Space (Host Listing)
app.post('/api/spaces', (req, res) => {
  const newSpace = {
    id: `space-${Date.now()}`,
    ...req.body,
    rating: 5.0,
    reviewCount: 0,
    verified: false, // Default false until admin approves
    status: 'under_review',
    isFeatured: false,
    createdAt: new Date().toISOString()
  };

  db.spaces.unshift(newSpace);

  // Add notification to admin
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: 'user-3', // Admin
    title: 'New Space Submitted',
    message: `${newSpace.name} has been submitted for verification.`,
    timestamp: 'Just now',
    read: false,
    type: 'admin_alert'
  });

  saveDb();
  res.status(201).json(newSpace);
});

// Update Space (Admin verify / Host update)
app.put('/api/spaces/:id', (req, res) => {
  const index = db.spaces.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Space not found' });
  }

  db.spaces[index] = { ...db.spaces[index], ...req.body };
  saveDb();
  res.json(db.spaces[index]);
});

// Delete Space
app.delete('/api/spaces/:id', (req, res) => {
  const beforeLength = db.spaces.length;
  db.spaces = db.spaces.filter(s => s.id !== req.params.id);
  if (db.spaces.length === beforeLength) {
    return res.status(404).json({ error: 'Space not found' });
  }
  saveDb();
  res.json({ success: true, message: 'Space deleted' });
});

// Bookings List (Filter by user or host)
app.get('/api/bookings', (req, res) => {
  const { userId, hostId } = req.query;
  let results = [...db.bookings];

  if (userId) {
    results = results.filter(b => b.userId === userId);
  }
  if (hostId) {
    results = results.filter(b => b.hostId === hostId);
  }

  // Sort latest first
  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(results);
});

// Create Booking
app.post('/api/bookings', (req, res) => {
  const { spaceId, userId, userName, userPhone, date, formattedDate, slot, guests, occasion, paymentMethod } = req.body;
  const space = db.spaces.find(s => s.id === spaceId);

  if (!space) {
    return res.status(404).json({ error: 'Space not found' });
  }

  const commissionRate = db.settings.commissionRate || 10;
  const basePrice = space.price;
  const platformFee = Math.round((basePrice * commissionRate) / 100);
  const securityDeposit = space.securityDeposit || 2000;
  const totalAmount = basePrice + platformFee;
  const hostEarning = basePrice - platformFee;

  const newBooking = {
    id: `PP-BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    spaceId: space.id,
    spaceName: space.name,
    spaceImage: space.images[0],
    category: space.category,
    location: `${space.area}, ${space.city}`,
    userId: userId || 'user-1',
    userName: userName || 'Customer',
    userPhone: userPhone || '+91 98112 34567',
    hostId: space.hostId,
    hostName: space.hostName,
    date,
    formattedDate: formattedDate || date,
    slot,
    guests: Number(guests) || 20,
    occasion: occasion || 'Private Celebration',
    basePrice,
    platformFee,
    securityDeposit,
    totalAmount,
    hostEarning,
    paymentMethod: paymentMethod || 'UPI (Instant)',
    paymentStatus: 'paid',
    transactionId: `TXN-${Date.now()}`,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);

  // Notify customer
  db.notifications.unshift({
    id: `notif-${Date.now()}-1`,
    userId: newBooking.userId,
    title: 'Booking Confirmed! 🎉',
    message: `Your booking for ${space.name} is confirmed for ${newBooking.formattedDate}.`,
    timestamp: 'Just now',
    read: false,
    type: 'booking_confirmed'
  });

  // Notify host
  db.notifications.unshift({
    id: `notif-${Date.now()}-2`,
    userId: space.hostId,
    title: 'New Booking Confirmed 📅',
    message: `${newBooking.userName} booked ${space.name} for ${newBooking.formattedDate}.`,
    timestamp: 'Just now',
    read: false,
    type: 'host_booking'
  });

  saveDb();
  res.status(201).json(newBooking);
});

// Update Booking Status (Host accept / cancel / complete)
app.put('/api/bookings/:id/status', (req, res) => {
  const { status } = req.body;
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  booking.status = status;

  // Add notification to user
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: booking.userId,
    title: `Booking Update: ${status.toUpperCase()}`,
    message: `Your booking for ${booking.spaceName} has been marked as ${status}.`,
    timestamp: 'Just now',
    read: false,
    type: 'booking_update'
  });

  saveDb();
  res.json(booking);
});

// Reviews Endpoints
app.get('/api/reviews/:spaceId', (req, res) => {
  const reviews = db.reviews.filter(r => r.spaceId === req.params.spaceId);
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const { spaceId, userId, userName, userAvatar, rating, comment, scores } = req.body;
  const space = db.spaces.find(s => s.id === spaceId);
  if (!space) {
    return res.status(404).json({ error: 'Space not found' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    spaceId,
    userId: userId || 'user-1',
    userName: userName || 'Verified Guest',
    userAvatar: userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: Number(rating) || 5,
    date: 'Just now',
    comment,
    scores: scores || { cleanliness: 5, accuracy: 5, communication: 5, value: 5 },
    createdAt: new Date().toISOString()
  };

  db.reviews.unshift(newReview);

  // Recalculate average rating for space
  const spaceReviews = db.reviews.filter(r => r.spaceId === spaceId);
  const avg = (spaceReviews.reduce((sum, r) => sum + r.rating, 0) / spaceReviews.length).toFixed(1);
  space.rating = parseFloat(avg);
  space.reviewCount = spaceReviews.length;

  saveDb();
  res.status(201).json({ review: newReview, updatedRating: space.rating, reviewCount: space.reviewCount });
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
  const totalUsers = db.users.length + 1245; // baseline scale
  const activeListings = db.spaces.filter(s => s.status === 'active').length;
  const totalBookings = db.bookings.length;
  const totalRevenue = db.bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const platformEarnings = db.bookings.reduce((sum, b) => sum + (b.platformFee || 0), 0);

  res.json({
    totalUsers,
    activeListings,
    totalBookings,
    totalRevenue,
    platformEarnings,
    commissionRate: db.settings.commissionRate,
    recentBookings: db.bookings.slice(0, 5),
    spacesSummary: {
      active: db.spaces.filter(s => s.status === 'active').length,
      underReview: db.spaces.filter(s => s.status === 'under_review').length,
      paused: db.spaces.filter(s => s.status === 'paused').length
    }
  });
});

// Notifications
app.get('/api/notifications', (req, res) => {
  const { userId } = req.query;
  let list = db.notifications;
  if (userId) {
    list = list.filter(n => n.userId === userId || n.userId === 'all');
  }
  res.json(list);
});

app.put('/api/notifications/read-all', (req, res) => {
  const { userId } = req.body;
  db.notifications.forEach(n => {
    if (!userId || n.userId === userId) {
      n.read = true;
    }
  });
  saveDb();
  res.json({ success: true });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 PartyPlace Express Backend running on http://localhost:${PORT}`);
});
