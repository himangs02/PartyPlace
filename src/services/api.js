// PartyPlace API Client & Resilient Data Service
// Seamlessly communicates with backend Express server and falls back to persistent localStorage
import { initialData } from '../../server/data/initialData.js';

const STORAGE_KEY = 'partyplace_app_data_v1';

// Initialize localStorage fallback if empty
function getLocalDb() {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.warn('localStorage read error:', e);
  }
  const defaultDb = JSON.parse(JSON.stringify(initialData));
  saveLocalDb(defaultDb);
  return defaultDb;
}

function saveLocalDb(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage save error:', e);
  }
}

export const api = {
  // Get all spaces with filtering & sorting
  async getSpaces(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '' && v !== 'all') {
          params.append(k, v);
        }
      });
      const res = await fetch(`/api/spaces?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('Backend /api/spaces unreachable, using local fallback');
    }

    // Local fallback
    const db = getLocalDb();
    let results = [...db.spaces];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    if (filters.location && filters.location !== 'all') {
      const loc = filters.location.toLowerCase();
      results = results.filter(s =>
        s.city.toLowerCase().includes(loc) ||
        s.area.toLowerCase().includes(loc)
      );
    }
    if (filters.category && filters.category !== 'all') {
      results = results.filter(s => s.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.minPrice) {
      results = results.filter(s => s.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter(s => s.price <= Number(filters.maxPrice));
    }
    if (filters.minGuests) {
      results = results.filter(s => s.capacity >= Number(filters.minGuests));
    }
    if (filters.verifiedOnly === true || filters.verifiedOnly === 'true') {
      results = results.filter(s => s.verified);
    }
    if (filters.sort === 'price_asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price_desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === 'capacity') {
      results.sort((a, b) => b.capacity - a.capacity);
    } else {
      results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return results;
  },

  // Get single space by ID
  async getSpaceById(id) {
    try {
      const res = await fetch(`/api/spaces/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`Backend /api/spaces/${id} unreachable, using local fallback`);
    }

    const db = getLocalDb();
    const space = db.spaces.find(s => s.id === id);
    if (!space) return null;
    const reviews = db.reviews.filter(r => r.spaceId === space.id);
    return { ...space, reviews };
  },

  // Create new space listing
  async createSpace(spaceData) {
    try {
      const res = await fetch('/api/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spaceData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend /api/spaces POST unreachable, using local fallback');
    }

    const db = getLocalDb();
    const newSpace = {
      id: `space-${Date.now()}`,
      ...spaceData,
      rating: 5.0,
      reviewCount: 0,
      verified: false,
      status: 'under_review',
      isFeatured: false,
      createdAt: new Date().toISOString()
    };
    db.spaces.unshift(newSpace);
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: 'user-3',
      title: 'New Space Submitted',
      message: `${newSpace.name} has been submitted for verification.`,
      timestamp: 'Just now',
      read: false,
      type: 'admin_alert'
    });
    saveLocalDb(db);
    return newSpace;
  },

  // Update space (e.g. admin approve / pause)
  async updateSpace(id, updateData) {
    try {
      const res = await fetch(`/api/spaces/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`Backend /api/spaces/${id} PUT unreachable, using local fallback`);
    }

    const db = getLocalDb();
    const idx = db.spaces.findIndex(s => s.id === id);
    if (idx !== -1) {
      db.spaces[idx] = { ...db.spaces[idx], ...updateData };
      saveLocalDb(db);
      return db.spaces[idx];
    }
    return null;
  },

  // Delete space
  async deleteSpace(id) {
    try {
      const res = await fetch(`/api/spaces/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn(`Backend /api/spaces/${id} DELETE unreachable, using local fallback`);
    }

    const db = getLocalDb();
    db.spaces = db.spaces.filter(s => s.id !== id);
    saveLocalDb(db);
    return { success: true };
  },

  // Get bookings
  async getBookings(query = {}) {
    try {
      const params = new URLSearchParams();
      if (query.userId) params.append('userId', query.userId);
      if (query.hostId) params.append('hostId', query.hostId);
      const res = await fetch(`/api/bookings?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend /api/bookings unreachable, using local fallback');
    }

    const db = getLocalDb();
    let results = [...db.bookings];
    if (query.userId) results = results.filter(b => b.userId === query.userId);
    if (query.hostId) results = results.filter(b => b.hostId === query.hostId);
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return results;
  },

  // Create booking
  async createBooking(bookingData) {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend /api/bookings POST unreachable, using local fallback');
    }

    const db = getLocalDb();
    const space = db.spaces.find(s => s.id === bookingData.spaceId) || db.spaces[0];
    const commissionRate = db.settings?.commissionRate || 10;
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
      userId: bookingData.userId || 'user-1',
      userName: bookingData.userName || 'Customer',
      userPhone: bookingData.userPhone || '+91 98112 34567',
      hostId: space.hostId,
      hostName: space.hostName,
      date: bookingData.date,
      formattedDate: bookingData.formattedDate || bookingData.date,
      slot: bookingData.slot,
      guests: Number(bookingData.guests) || 20,
      occasion: bookingData.occasion || 'Private Celebration',
      basePrice,
      platformFee,
      securityDeposit,
      totalAmount,
      hostEarning,
      paymentMethod: bookingData.paymentMethod || 'UPI (Instant)',
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

    saveLocalDb(db);
    return newBooking;
  },

  // Update booking status
  async updateBookingStatus(id, status) {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn(`Backend /api/bookings/${id}/status unreachable, using local fallback`);
    }

    const db = getLocalDb();
    const booking = db.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: booking.userId,
        title: `Booking Update: ${status.toUpperCase()}`,
        message: `Your booking for ${booking.spaceName} is now ${status}.`,
        timestamp: 'Just now',
        read: false,
        type: 'booking_update'
      });
      saveLocalDb(db);
      return booking;
    }
    return null;
  },

  // Reviews
  async getReviews(spaceId) {
    try {
      const res = await fetch(`/api/reviews/${spaceId}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn(`Backend /api/reviews/${spaceId} unreachable, using local fallback`);
    }

    const db = getLocalDb();
    return db.reviews.filter(r => r.spaceId === spaceId);
  },

  async createReview(reviewData) {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend /api/reviews POST unreachable, using local fallback');
    }

    const db = getLocalDb();
    const newRev = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      date: 'Just now',
      createdAt: new Date().toISOString()
    };
    db.reviews.unshift(newRev);

    const space = db.spaces.find(s => s.id === reviewData.spaceId);
    if (space) {
      const allRev = db.reviews.filter(r => r.spaceId === space.id);
      const avg = (allRev.reduce((sum, r) => sum + r.rating, 0) / allRev.length).toFixed(1);
      space.rating = parseFloat(avg);
      space.reviewCount = allRev.length;
    }
    saveLocalDb(db);
    return { review: newRev, updatedRating: space?.rating, reviewCount: space?.reviewCount };
  },

  // Admin stats
  async getAdminStats() {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend /api/admin/stats unreachable, using local fallback');
    }

    const db = getLocalDb();
    const totalRevenue = db.bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const platformEarnings = db.bookings.reduce((sum, b) => sum + (b.platformFee || 0), 0);
    return {
      totalUsers: db.users.length + 1245,
      activeListings: db.spaces.filter(s => s.status === 'active').length,
      totalBookings: db.bookings.length,
      totalRevenue: totalRevenue || 982500,
      platformEarnings: platformEarnings || 98250,
      commissionRate: db.settings?.commissionRate || 10,
      recentBookings: db.bookings.slice(0, 5),
      spacesSummary: {
        active: db.spaces.filter(s => s.status === 'active').length,
        underReview: db.spaces.filter(s => s.status === 'under_review').length,
        paused: db.spaces.filter(s => s.status === 'paused').length
      }
    };
  },

  // Settings
  async getSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend /api/settings unreachable, using local fallback');
    }
    const db = getLocalDb();
    return db.settings || initialData.settings;
  },

  async updateSettings(settings) {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend /api/settings PUT unreachable, using local fallback');
    }
    const db = getLocalDb();
    db.settings = { ...db.settings, ...settings };
    saveLocalDb(db);
    return { success: true, settings: db.settings };
  },

  // Notifications
  async getNotifications(userId) {
    try {
      const res = await fetch(`/api/notifications?userId=${userId || ''}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend /api/notifications unreachable, using local fallback');
    }
    const db = getLocalDb();
    if (!userId) return db.notifications;
    return db.notifications.filter(n => n.userId === userId || n.userId === 'all');
  },

  async markNotificationsRead(userId) {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch (err) {
      console.warn('Backend /api/notifications/read-all unreachable, using local fallback');
    }
    const db = getLocalDb();
    db.notifications.forEach(n => {
      if (!userId || n.userId === userId) {
        n.read = true;
      }
    });
    saveLocalDb(db);
    return { success: true };
  }
};
