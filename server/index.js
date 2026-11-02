import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbService, initDatabase, getDatabaseStatus } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize Database (Aiven MySQL + Local Fallback)
initDatabase();

// ----------------- API ENDPOINTS -----------------

// Health check with Database status
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'PartyPlace API', 
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString() 
  });
});

// Settings & Config
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await dbService.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const updated = await dbService.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Spaces List with filtering & sorting
app.get('/api/spaces', async (req, res) => {
  try {
    const spaces = await dbService.getSpaces(req.query);
    res.json(spaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Space Details by ID
app.get('/api/spaces/:id', async (req, res) => {
  try {
    const space = await dbService.getSpaceById(req.params.id);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    res.json(space);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Space (Host Listing)
app.post('/api/spaces', async (req, res) => {
  try {
    const newSpace = await dbService.createSpace(req.body);
    res.status(201).json(newSpace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Space (Admin verify / Host update)
app.put('/api/spaces/:id', async (req, res) => {
  try {
    const updated = await dbService.updateSpace(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Space not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Space
app.delete('/api/spaces/:id', async (req, res) => {
  try {
    await dbService.deleteSpace(req.params.id);
    res.json({ success: true, message: 'Space deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bookings List (Filter by user or host)
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await dbService.getBookings(req.query);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { spaceId, userId, userName, userPhone, date, formattedDate, slot, guests, occasion, paymentMethod } = req.body;
    const space = await dbService.getSpaceById(spaceId);

    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    const settings = await dbService.getSettings();
    const commissionRate = settings.commissionRate || 10;
    const basePrice = space.price;
    const platformFee = Math.round((basePrice * commissionRate) / 100);
    const securityDeposit = space.securityDeposit || 2000;
    const totalAmount = basePrice + platformFee;
    const hostEarning = basePrice - platformFee;

    const newBooking = await dbService.createBooking({
      spaceId: space.id,
      spaceName: space.name,
      spaceImage: space.images?.[0] || '',
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
      paymentMethod: paymentMethod || 'UPI (Instant)'
    });

    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Booking Status (Host accept / cancel / complete)
app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await dbService.updateBookingStatus(req.params.id, status);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const spaces = await dbService.getSpaces();
    const bookings = await dbService.getBookings();
    const settings = await dbService.getSettings();

    const totalUsers = 1248;
    const activeListings = spaces.filter(s => s.status === 'active').length;
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const platformEarnings = bookings.reduce((sum, b) => sum + (b.platformFee || 0), 0);

    res.json({
      totalUsers,
      activeListings,
      totalBookings,
      totalRevenue: totalRevenue || 982500,
      platformEarnings: platformEarnings || 98250,
      commissionRate: settings.commissionRate,
      recentBookings: bookings.slice(0, 5),
      spacesSummary: {
        active: spaces.filter(s => s.status === 'active').length,
        underReview: spaces.filter(s => s.status === 'under_review').length,
        paused: spaces.filter(s => s.status === 'paused').length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const list = await dbService.getNotifications(req.query.userId);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/read-all', async (req, res) => {
  try {
    await dbService.markNotificationsRead(req.body.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 PartyPlace Express Backend running on http://localhost:${PORT}`);
});
