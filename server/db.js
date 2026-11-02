import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initialData } from './data/initialData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Local fallback database memory
let localDb = { ...initialData };

function loadLocalDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      localDb = JSON.parse(data);
    } else {
      saveLocalDb();
    }
  } catch (err) {
    console.error('Error reading local db:', err);
    localDb = { ...initialData };
  }
}

function saveLocalDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local db:', err);
  }
}

loadLocalDb();

// MySQL Pool Configuration
let pool = null;
let isMySqlConnected = false;

export function getDatabaseStatus() {
  return {
    isMySqlConnected,
    host: process.env.DB_HOST || 'aivencloud.com',
    database: process.env.DB_NAME || 'defaultdb'
  };
}

export async function initDatabase() {
  const dbHost = process.env.DB_HOST;
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME || 'defaultdb';
  const dbPort = Number(process.env.DB_PORT) || 23617;

  if (!dbHost || !dbUser) {
    console.log('ℹ️ No MySQL credentials configured, using local JSON database.');
    return;
  }

  console.log(`🔌 Attempting connection to Aiven MySQL (${dbHost}:${dbPort})...`);

  try {
    pool = mysql.createPool({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      ssl: {
        rejectUnauthorized: false
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 8000
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Connected to Aiven MySQL Cloud Database successfully!');
    isMySqlConnected = true;

    // Create Tables if they don't exist
    await createTables(connection);
    await seedDatabaseIfEmpty(connection);
    connection.release();
  } catch (err) {
    console.warn('⚠️ Aiven MySQL connection not currently reachable (cluster may be provisioning or starting up).');
    console.warn(`Details: ${err.message}`);
    console.log('🛡️ Fallback active: Serving seamlessly with persistent local database.');
    isMySqlConnected = false;

    // Periodic retry in background every 20 seconds
    setTimeout(() => {
      if (!isMySqlConnected) {
        initDatabase();
      }
    }, 20000);
  }
}

async function createTables(connection) {
  // Settings Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS settings (
      setting_key VARCHAR(64) PRIMARY KEY,
      setting_value TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Spaces Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS spaces (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      tagline TEXT,
      category VARCHAR(64),
      host_id VARCHAR(64),
      host_name VARCHAR(255),
      host_avatar TEXT,
      is_superhost BOOLEAN DEFAULT FALSE,
      city VARCHAR(100),
      area VARCHAR(100),
      full_address TEXT,
      capacity INT DEFAULT 25,
      price DECIMAL(10,2) NOT NULL,
      duration_hours INT DEFAULT 4,
      rating DECIMAL(3,2) DEFAULT 4.8,
      review_count INT DEFAULT 0,
      verified BOOLEAN DEFAULT FALSE,
      is_featured BOOLEAN DEFAULT FALSE,
      status VARCHAR(32) DEFAULT 'active',
      images JSON,
      description TEXT,
      amenities JSON,
      rules JSON,
      noise_restriction TEXT,
      security_deposit DECIMAL(10,2) DEFAULT 2000,
      permitted_events JSON,
      available_slots JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Bookings Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(64) PRIMARY KEY,
      space_id VARCHAR(64),
      space_name VARCHAR(255),
      space_image TEXT,
      category VARCHAR(64),
      location VARCHAR(255),
      user_id VARCHAR(64),
      user_name VARCHAR(255),
      user_phone VARCHAR(64),
      host_id VARCHAR(64),
      host_name VARCHAR(255),
      event_date VARCHAR(64),
      formatted_date VARCHAR(64),
      slot VARCHAR(128),
      guests INT DEFAULT 20,
      occasion VARCHAR(255),
      base_price DECIMAL(10,2),
      platform_fee DECIMAL(10,2),
      security_deposit DECIMAL(10,2),
      total_amount DECIMAL(10,2),
      host_earning DECIMAL(10,2),
      payment_method VARCHAR(64),
      payment_status VARCHAR(32) DEFAULT 'paid',
      transaction_id VARCHAR(64),
      status VARCHAR(32) DEFAULT 'confirmed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Reviews Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id VARCHAR(64) PRIMARY KEY,
      space_id VARCHAR(64),
      user_id VARCHAR(64),
      user_name VARCHAR(255),
      user_avatar TEXT,
      rating DECIMAL(3,2),
      review_date VARCHAR(64),
      comment TEXT,
      scores JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Notifications Table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      title VARCHAR(255),
      message TEXT,
      timestamp VARCHAR(64),
      is_read BOOLEAN DEFAULT FALSE,
      type VARCHAR(64),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log('✅ MySQL schema verified / created.');
}

async function seedDatabaseIfEmpty(connection) {
  const [rows] = await connection.query('SELECT COUNT(*) as count FROM spaces');
  if (rows[0].count === 0) {
    console.log('🌱 Seeding MySQL with initial PartyPlace venues and records...');

    // Seed Settings
    await connection.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
      ['platform_settings', JSON.stringify(initialData.settings)]
    );

    // Seed Spaces
    for (const s of initialData.spaces) {
      await connection.query(`
        INSERT INTO spaces (
          id, name, tagline, category, host_id, host_name, host_avatar, is_superhost,
          city, area, full_address, capacity, price, duration_hours, rating, review_count,
          verified, is_featured, status, images, description, amenities, rules,
          noise_restriction, security_deposit, permitted_events, available_slots
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        s.id, s.name, s.tagline, s.category, s.hostId, s.hostName, s.hostAvatar, s.isSuperhost,
        s.city, s.area, s.fullAddress, s.capacity, s.price, s.durationHours, s.rating, s.reviewCount,
        s.verified, s.isFeatured, s.status, JSON.stringify(s.images), s.description,
        JSON.stringify(s.amenities), JSON.stringify(s.rules), s.noiseRestriction, s.securityDeposit,
        JSON.stringify(s.permittedEvents), JSON.stringify(s.availableSlots)
      ]);
    }

    // Seed Bookings
    for (const b of initialData.bookings) {
      await connection.query(`
        INSERT INTO bookings (
          id, space_id, space_name, space_image, category, location, user_id, user_name, user_phone,
          host_id, host_name, event_date, formatted_date, slot, guests, occasion, base_price,
          platform_fee, security_deposit, total_amount, host_earning, payment_method,
          payment_status, transaction_id, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        b.id, b.spaceId, b.spaceName, b.spaceImage, b.category, b.location, b.userId, b.userName, b.userPhone,
        b.hostId, b.hostName, b.date, b.formattedDate, b.slot, b.guests, b.occasion, b.basePrice,
        b.platformFee, b.securityDeposit, b.totalAmount, b.hostEarning, b.paymentMethod,
        b.paymentStatus, b.transactionId, b.status
      ]);
    }

    // Seed Reviews
    for (const r of initialData.reviews) {
      await connection.query(`
        INSERT INTO reviews (id, space_id, user_id, user_name, user_avatar, rating, review_date, comment, scores)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        r.id, r.spaceId, r.userId, r.userName, r.userAvatar, r.rating, r.date, r.comment, JSON.stringify(r.scores)
      ]);
    }

    // Seed Notifications
    for (const n of initialData.notifications) {
      await connection.query(`
        INSERT INTO notifications (id, user_id, title, message, timestamp, is_read, type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        n.id, n.userId, n.title, n.message, n.timestamp, n.read, n.type
      ]);
    }

    console.log('✅ Seed data successfully written to Aiven MySQL!');
  }
}

// ----------------- DATA ACCESS HELPERS -----------------

function formatSpaceFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    category: row.category,
    hostId: row.host_id,
    hostName: row.host_name,
    hostAvatar: row.host_avatar,
    isSuperhost: Boolean(row.is_superhost),
    city: row.city,
    area: row.area,
    fullAddress: row.full_address,
    capacity: Number(row.capacity),
    price: Number(row.price),
    durationHours: Number(row.duration_hours),
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    verified: Boolean(row.verified),
    isFeatured: Boolean(row.is_featured),
    status: row.status,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images || [],
    description: row.description,
    amenities: typeof row.amenities === 'string' ? JSON.parse(row.amenities) : row.amenities || [],
    rules: typeof row.rules === 'string' ? JSON.parse(row.rules) : row.rules || [],
    noiseRestriction: row.noise_restriction,
    securityDeposit: Number(row.security_deposit),
    permittedEvents: typeof row.permitted_events === 'string' ? JSON.parse(row.permitted_events) : row.permitted_events || [],
    availableSlots: typeof row.available_slots === 'string' ? JSON.parse(row.available_slots) : row.available_slots || []
  };
}

export const dbService = {
  // SPACES
  async getSpaces(filters = {}) {
    if (isMySqlConnected && pool) {
      try {
        let query = 'SELECT * FROM spaces WHERE 1=1';
        const params = [];

        if (filters.search) {
          query += ' AND (LOWER(name) LIKE ? OR LOWER(city) LIKE ? OR LOWER(area) LIKE ? OR LOWER(category) LIKE ?)';
          const term = `%${filters.search.toLowerCase()}%`;
          params.push(term, term, term, term);
        }
        if (filters.location && filters.location !== 'all') {
          query += ' AND (LOWER(city) LIKE ? OR LOWER(area) LIKE ?)';
          const loc = `%${filters.location.toLowerCase()}%`;
          params.push(loc, loc);
        }
        if (filters.category && filters.category !== 'all') {
          query += ' AND LOWER(category) = ?';
          params.push(filters.category.toLowerCase());
        }
        if (filters.minPrice) {
          query += ' AND price >= ?';
          params.push(Number(filters.minPrice));
        }
        if (filters.maxPrice) {
          query += ' AND price <= ?';
          params.push(Number(filters.maxPrice));
        }
        if (filters.minGuests) {
          query += ' AND capacity >= ?';
          params.push(Number(filters.minGuests));
        }
        if (filters.verifiedOnly === 'true' || filters.verifiedOnly === true) {
          query += ' AND verified = 1';
        }

        if (filters.sort === 'price_asc') {
          query += ' ORDER BY price ASC';
        } else if (filters.sort === 'price_desc') {
          query += ' ORDER BY price DESC';
        } else if (filters.sort === 'rating') {
          query += ' ORDER BY rating DESC';
        } else if (filters.sort === 'capacity') {
          query += ' ORDER BY capacity DESC';
        } else {
          query += ' ORDER BY is_featured DESC, rating DESC';
        }

        const [rows] = await pool.query(query, params);
        return rows.map(formatSpaceFromRow);
      } catch (err) {
        console.error('MySQL query error, using local fallback:', err);
      }
    }

    // Local Fallback
    let results = [...localDb.spaces];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(s => s.name.toLowerCase().includes(q) || s.area.toLowerCase().includes(q));
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
    if (filters.verifiedOnly === 'true') {
      results = results.filter(s => s.verified);
    }
    return results;
  },

  async getSpaceById(id) {
    if (isMySqlConnected && pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM spaces WHERE id = ?', [id]);
        if (rows.length > 0) {
          const space = formatSpaceFromRow(rows[0]);
          const [revRows] = await pool.query('SELECT * FROM reviews WHERE space_id = ?', [id]);
          space.reviews = revRows.map(r => ({
            id: r.id,
            spaceId: r.space_id,
            userId: r.user_id,
            userName: r.user_name,
            userAvatar: r.user_avatar,
            rating: Number(r.rating),
            date: r.review_date,
            comment: r.comment,
            scores: typeof r.scores === 'string' ? JSON.parse(r.scores) : r.scores
          }));
          return space;
        }
      } catch (err) {
        console.error('MySQL getSpaceById error:', err);
      }
    }

    // Local Fallback
    const space = localDb.spaces.find(s => s.id === id);
    if (!space) return null;
    const reviews = localDb.reviews.filter(r => r.spaceId === id);
    return { ...space, reviews };
  },

  async createSpace(spaceData) {
    const newSpace = {
      id: `space-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      verified: false,
      status: 'under_review',
      isFeatured: false,
      durationHours: 4,
      ...spaceData
    };

    if (isMySqlConnected && pool) {
      try {
        await pool.query(`
          INSERT INTO spaces (
            id, name, tagline, category, host_id, host_name, host_avatar, is_superhost,
            city, area, full_address, capacity, price, duration_hours, rating, review_count,
            verified, is_featured, status, images, description, amenities, rules,
            noise_restriction, security_deposit, permitted_events, available_slots
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          newSpace.id, newSpace.name, newSpace.tagline, newSpace.category, newSpace.hostId, newSpace.hostName,
          newSpace.hostAvatar, newSpace.isSuperhost || false, newSpace.city, newSpace.area, newSpace.fullAddress,
          newSpace.capacity, newSpace.price, newSpace.durationHours, newSpace.rating, newSpace.reviewCount,
          newSpace.verified, newSpace.isFeatured, newSpace.status, JSON.stringify(newSpace.images || []),
          newSpace.description, JSON.stringify(newSpace.amenities || []), JSON.stringify(newSpace.rules || []),
          newSpace.noiseRestriction, newSpace.securityDeposit || 2000, JSON.stringify(newSpace.permittedEvents || []),
          JSON.stringify(newSpace.availableSlots || [])
        ]);
      } catch (err) {
        console.error('MySQL createSpace error:', err);
      }
    }

    localDb.spaces.unshift(newSpace);
    saveLocalDb();
    return newSpace;
  },

  async updateSpace(id, updateData) {
    if (isMySqlConnected && pool) {
      try {
        const fields = [];
        const values = [];
        if (updateData.status) { fields.push('status = ?'); values.push(updateData.status); }
        if (updateData.verified !== undefined) { fields.push('verified = ?'); values.push(updateData.verified ? 1 : 0); }
        if (updateData.isFeatured !== undefined) { fields.push('is_featured = ?'); values.push(updateData.isFeatured ? 1 : 0); }
        if (fields.length > 0) {
          values.push(id);
          await pool.query(`UPDATE spaces SET ${fields.join(', ')} WHERE id = ?`, values);
        }
      } catch (err) {
        console.error('MySQL updateSpace error:', err);
      }
    }

    const idx = localDb.spaces.findIndex(s => s.id === id);
    if (idx !== -1) {
      localDb.spaces[idx] = { ...localDb.spaces[idx], ...updateData };
      saveLocalDb();
      return localDb.spaces[idx];
    }
    return null;
  },

  async deleteSpace(id) {
    if (isMySqlConnected && pool) {
      try {
        await pool.query('DELETE FROM spaces WHERE id = ?', [id]);
      } catch (err) {
        console.error('MySQL deleteSpace error:', err);
      }
    }
    localDb.spaces = localDb.spaces.filter(s => s.id !== id);
    saveLocalDb();
    return { success: true };
  },

  // BOOKINGS
  async getBookings(query = {}) {
    if (isMySqlConnected && pool) {
      try {
        let sql = 'SELECT * FROM bookings WHERE 1=1';
        const params = [];
        if (query.userId) { sql += ' AND user_id = ?'; params.push(query.userId); }
        if (query.hostId) { sql += ' AND host_id = ?'; params.push(query.hostId); }
        sql += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(sql, params);
        return rows.map(b => ({
          id: b.id,
          spaceId: b.space_id,
          spaceName: b.space_name,
          spaceImage: b.space_image,
          category: b.category,
          location: b.location,
          userId: b.user_id,
          userName: b.user_name,
          userPhone: b.user_phone,
          hostId: b.host_id,
          hostName: b.host_name,
          date: b.event_date,
          formattedDate: b.formatted_date,
          slot: b.slot,
          guests: Number(b.guests),
          occasion: b.occasion,
          basePrice: Number(b.base_price),
          platformFee: Number(b.platform_fee),
          securityDeposit: Number(b.security_deposit),
          totalAmount: Number(b.total_amount),
          hostEarning: Number(b.host_earning),
          paymentMethod: b.payment_method,
          paymentStatus: b.payment_status,
          transactionId: b.transaction_id,
          status: b.status
        }));
      } catch (err) {
        console.error('MySQL getBookings error:', err);
      }
    }

    let results = [...localDb.bookings];
    if (query.userId) results = results.filter(b => b.userId === query.userId);
    if (query.hostId) results = results.filter(b => b.hostId === query.hostId);
    return results;
  },

  async createBooking(bookingData) {
    const newBooking = {
      id: `PP-BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentStatus: 'paid',
      transactionId: `TXN-${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      ...bookingData
    };

    if (isMySqlConnected && pool) {
      try {
        await pool.query(`
          INSERT INTO bookings (
            id, space_id, space_name, space_image, category, location, user_id, user_name, user_phone,
            host_id, host_name, event_date, formatted_date, slot, guests, occasion, base_price,
            platform_fee, security_deposit, total_amount, host_earning, payment_method,
            payment_status, transaction_id, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          newBooking.id, newBooking.spaceId, newBooking.spaceName, newBooking.spaceImage, newBooking.category,
          newBooking.location, newBooking.userId, newBooking.userName, newBooking.userPhone,
          newBooking.hostId, newBooking.hostName, newBooking.date, newBooking.formattedDate,
          newBooking.slot, newBooking.guests, newBooking.occasion, newBooking.basePrice,
          newBooking.platformFee, newBooking.securityDeposit, newBooking.totalAmount,
          newBooking.hostEarning, newBooking.paymentMethod, newBooking.paymentStatus,
          newBooking.transactionId, newBooking.status
        ]);
      } catch (err) {
        console.error('MySQL createBooking error:', err);
      }
    }

    localDb.bookings.unshift(newBooking);
    saveLocalDb();
    return newBooking;
  },

  async updateBookingStatus(id, status) {
    if (isMySqlConnected && pool) {
      try {
        await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
      } catch (err) {
        console.error('MySQL updateBookingStatus error:', err);
      }
    }

    const booking = localDb.bookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      saveLocalDb();
      return booking;
    }
    return null;
  },

  // SETTINGS
  async getSettings() {
    if (isMySqlConnected && pool) {
      try {
        const [rows] = await pool.query('SELECT setting_value FROM settings WHERE setting_key = ?', ['platform_settings']);
        if (rows.length > 0) {
          return JSON.parse(rows[0].setting_value);
        }
      } catch (err) {
        console.error('MySQL getSettings error:', err);
      }
    }
    return localDb.settings;
  },

  async updateSettings(settings) {
    const updated = { ...localDb.settings, ...settings };
    if (isMySqlConnected && pool) {
      try {
        await pool.query(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          ['platform_settings', JSON.stringify(updated), JSON.stringify(updated)]
        );
      } catch (err) {
        console.error('MySQL updateSettings error:', err);
      }
    }
    localDb.settings = updated;
    saveLocalDb();
    return updated;
  },

  // NOTIFICATIONS
  async getNotifications(userId) {
    if (isMySqlConnected && pool) {
      try {
        let sql = 'SELECT * FROM notifications WHERE 1=1';
        const params = [];
        if (userId) { sql += ' AND (user_id = ? OR user_id = "all")'; params.push(userId); }
        sql += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(sql, params);
        return rows.map(n => ({
          id: n.id,
          userId: n.user_id,
          title: n.title,
          message: n.message,
          timestamp: n.timestamp,
          read: Boolean(n.is_read),
          type: n.type
        }));
      } catch (err) {
        console.error('MySQL getNotifications error:', err);
      }
    }

    if (!userId) return localDb.notifications;
    return localDb.notifications.filter(n => n.userId === userId || n.userId === 'all');
  },

  async markNotificationsRead(userId) {
    if (isMySqlConnected && pool) {
      try {
        if (userId) {
          await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
        } else {
          await pool.query('UPDATE notifications SET is_read = 1');
        }
      } catch (err) {
        console.error('MySQL markNotificationsRead error:', err);
      }
    }

    localDb.notifications.forEach(n => {
      if (!userId || n.userId === userId) {
        n.read = true;
      }
    });
    saveLocalDb();
    return { success: true };
  }
};
