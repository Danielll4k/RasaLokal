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

pool.connect()
  .then((client) => {
    isPostgresAvailable = true;
    client.release();
    console.log('[Database] Connected to PostgreSQL successfully.');
  })
  .catch(() => {
    isPostgresAvailable = false;
    console.warn('[Database] PostgreSQL not reachable. Running with embedded in-memory data store for standalone testing.');
  });

// In-Memory Fallback State (Yogyakarta Pilot Restaurants)
export const memoryStore = {
  restaurants: [
    {
      id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name: 'Sore Dining',
      tagline: 'Modern Indonesian Dining & Artisan Coffee',
      address: 'Jl. Tirtodipuran No. 18, Mantrijeron, Yogyakarta',
      city: 'Yogyakarta',
      category: 'Indonesian Modern',
      price_range: 'Rp 35k - 85k',
      price_level: '$$',
      open_hour: '10:00',
      close_hour: '22:00',
      is_open: true,
      tags: ['Cozy Ambiance', 'Halal Certified', 'Family-Friendly', 'Free Wi-Fi'],
      is_verified: true,
      average_rating: 4.90,
      total_reviews: 246,
      distance: '0.8 km',
      banner_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80'
      ],
      signature_dishes: [
        { name: 'Nasi Campur Sore Istimewa', price: 'Rp 48.000', desc: 'Ayam bakar rempah, sambal matah, urap sayur, dan kerupuk gendar' },
        { name: 'Iga Bakar Madu Mantrijeron', price: 'Rp 65.000', desc: 'Iga sapi empuk berbalut madu hutan dengan sambal terasi bakar' },
        { name: 'Es Kopi Susu Tirtodipuran', price: 'Rp 26.000', desc: 'Espresso robusta lokal dengan gula aren organik dan susu segar' }
      ]
    },
    {
      id: 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name: 'Nusa Kitchen & Grill',
      tagline: 'Woodfire Nusantara Grill & Traditional Heritage',
      address: 'Jl. Kaliurang KM 14, Besi, Sleman, Yogyakarta',
      city: 'Yogyakarta',
      category: 'Asian Grill',
      price_range: 'Rp 40k - 110k',
      price_level: '$$$',
      open_hour: '11:00',
      close_hour: '23:00',
      is_open: true,
      tags: ['Outdoor Garden', 'Spacious', 'Live Music', 'Private Room'],
      is_verified: true,
      average_rating: 4.80,
      total_reviews: 189,
      distance: '2.4 km',
      banner_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80'
      ],
      signature_dishes: [
        { name: 'Sate Maranggi Wagyu', price: 'Rp 75.000', desc: 'Daging sapi maranggi lembut dibakar arang kelapa dengan acar tomat segar' },
        { name: 'Bebek Goreng Crispy Kaliurang', price: 'Rp 58.000', desc: 'Bebek ungkep bumbu kuning disajikan kremes renyah dan sambal korek' }
      ]
    },
    {
      id: 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      name: 'Kopi Kalyan Kotabaru',
      tagline: 'Artisan Specialty Coffee & Fresh Bakery',
      address: 'Jl. Sajiono No. 13, Kotabaru, Gondokusuman, Yogyakarta',
      city: 'Yogyakarta',
      category: 'Cafe & Pastries',
      price_range: 'Rp 28k - 55k',
      price_level: '$$',
      open_hour: '07:00',
      close_hour: '22:00',
      is_open: true,
      tags: ['Work-Friendly', 'Fast Wi-Fi', 'Outdoor Smoking', 'Fresh Pastry'],
      is_verified: true,
      average_rating: 4.70,
      total_reviews: 328,
      distance: '1.4 km',
      banner_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'
      ],
      signature_dishes: [
        { name: 'Manual Brew Gayo Natural', price: 'Rp 34.000', desc: 'Single origin dengan notes fruity floral yang seimbang' },
        { name: 'Almond Butter Croissant', price: 'Rp 32.000', desc: 'Fresh baked daily dengan filling almond cream renyah' }
      ]
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
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: 'ccccccc2-cccc-cccc-cccc-cccccccccccc',
      transaction_id: 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      restaurant_id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      voucher_code: 'SORE-EXPD1',
      qr_payload: 'https://rasalokal.id/verify?code=SORE-EXPD1',
      status: 'issued',
      // Expired 2 hours ago
      expires_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'ccccccc3-cccc-cccc-cccc-cccccccccccc',
      transaction_id: 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      restaurant_id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      voucher_code: 'SORE-USED2',
      qr_payload: 'https://rasalokal.id/verify?code=SORE-USED2',
      // Already redeemed
      status: 'redeemed',
      redeemed_at: new Date(Date.now() - 30 * 60 * 1000),
      expires_at: new Date(Date.now() + 20 * 60 * 60 * 1000)
    }
  ],
  reviews: [
    {
      id: 'ddddddd1-dddd-dddd-dddd-dddddddddddd',
      restaurant_id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      user_id: '11111111-1111-1111-1111-111111111111',
      voucher_id: 'mock-used-voucher',
      rating: 5,
      review_text: 'Rasa iga bakarnya sangat meresap dan dagingnya empuk sekali. Suasana di Tirtodipuran tenang dan pelayanannya sigap. Nota fisiknya rapi dan proses verifikasi ulasannya praktis!',
      photos_url: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=600'],
      is_verified_buyer: true,
      receipt_code: 'SORE-3M19A',
      author_name: 'Alya Rahman',
      created_at: new Date(Date.now() - 3600000 * 4)
    },
    {
      id: 'ddddddd2-dddd-dddd-dddd-dddddddddddd',
      restaurant_id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      user_id: '22222222-2222-2222-2222-222222222222',
      voucher_id: 'mock-used-voucher-2',
      rating: 5,
      review_text: 'Suka banget sama konsep ulasan berbasis nota seperti ini, ulasannya jadi terpercaya dan asli dari pembeli langsung. Makanannya beneran enak dan dapat diskon 5% untuk kunjungan berikutnya!',
      photos_url: [],
      is_verified_buyer: true,
      receipt_code: 'SORE-7Y42B',
      author_name: 'Bima Satria',
      created_at: new Date(Date.now() - 86400000)
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
      expires_at: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000)
    }
  ]
};

export const query = async (text, params) => {
  if (isPostgresAvailable) {
    return pool.query(text, params);
  }
  return null;
};
