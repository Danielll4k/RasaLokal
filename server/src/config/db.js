import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase') 
    ? { rejectUnauthorized: false } 
    : false,
});

let isPostgresAvailable = false;

// Initial connection test
pool.connect()
  .then((client) => {
    isPostgresAvailable = true;
    client.release();
    console.log('[Database] Connected to PostgreSQL successfully.');
  })
  .catch((err) => {
    isPostgresAvailable = false;
    console.warn('[Database] PostgreSQL not reachable. Running with embedded in-memory data store for standalone testing.');
  });

// In-Memory Fallback State (Matches Demo Seed Data)
export const memoryStore = {
  restaurants: [
    {
      id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name: 'Sore Dining',
      address: 'Jl. Kemang Raya No. 18, Jakarta Selatan',
      city: 'Jakarta Selatan',
      category: 'Indonesian Modern',
      price_range: '$$',
      open_hour: '10:00',
      close_hour: '22:00',
      tags: ['Cozy', 'Halal', 'Family-friendly'],
      is_verified: true,
      average_rating: 4.90,
      total_reviews: 246,
      distance: '0.8 km',
      banner_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'
    },
    {
      id: 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name: 'Nusa Kitchen',
      address: 'Jl. Kemang Selatan No. 45, Jakarta Selatan',
      city: 'Jakarta Selatan',
      category: 'Asian Grill',
      price_range: '$$$',
      open_hour: '11:00',
      close_hour: '23:00',
      tags: ['Authentic', 'Spacious', 'Outdoor'],
      is_verified: true,
      average_rating: 4.80,
      total_reviews: 189,
      distance: '1.2 km',
      banner_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'
    },
    {
      id: 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name: 'Kopi Kalyan',
      address: 'Jl. Barito II No. 19, Kebayoran Baru',
      city: 'Jakarta Selatan',
      category: 'Cafe & Pastries',
      price_range: '$$',
      open_hour: '07:00',
      close_hour: '21:00',
      tags: ['Work-friendly', 'Coffee', 'Chill'],
      is_verified: true,
      average_rating: 4.70,
      total_reviews: 328,
      distance: '1.4 km',
      banner_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200'
    }
  ],
  transactions: [
    {
      id: 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      restaurant_id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      receipt_number: 'INV-SORE-20261109-001',
      total_amount: 175000.00,
      transaction_time: new Date()
    }
  ],
  review_vouchers: [
    {
      id: 'ccccccc1-cccc-cccc-cccc-cccccccccccc',
      transaction_id: 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      restaurant_id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      voucher_code: 'SORE-8X29K',
      qr_payload: 'https://rasalokal.id/verify?code=SORE-8X29K',
      status: 'issued',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  ],
  reviews: [
    {
      id: 'ddddddd1-dddd-dddd-dddd-dddddddddddd',
      restaurant_id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      user_id: '11111111-1111-1111-1111-111111111111',
      voucher_id: 'mock-used-voucher',
      rating: 5,
      review_text: 'Makanannya otentik dan suasana sangat nyaman untuk kumpul keluarga.',
      photos_url: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=600'],
      is_verified_buyer: true,
      author_name: 'Alya Rahman',
      created_at: new Date(Date.now() - 3600000)
    }
  ],
  discount_vouchers: [
    {
      id: 'eeeeeee1-eeee-eeee-eeee-eeeeeeeeeeee',
      review_id: 'ddddddd1-dddd-dddd-dddd-dddddddddddd',
      user_id: '11111111-1111-1111-1111-111111111111',
      restaurant_id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      restaurant_name: 'Sore Dining',
      discount_code: 'DISC5-SORE-99FA',
      discount_percentage: 5,
      minimum_spend: 100000.00,
      status: 'active',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  ]
};

export const query = async (text, params) => {
  if (isPostgresAvailable) {
    return pool.query(text, params);
  }
  return null;
};
