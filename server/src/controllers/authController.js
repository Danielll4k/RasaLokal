import jwt from 'jsonwebtoken';
import { memoryStore } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_kmm2026_rasalokal_key';

// Mock credentials for demo
export const DEMO_ACCOUNTS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Alya Rahman',
    email: 'alya@gmail.com',
    role: 'customer',
    bio: 'Food explorer · Yogyakarta',
    badge: 'Reviewer Terverifikasi',
    avatar: 'AR'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Budi Santoso (Kasir POS-01)',
    email: 'kasir@soredining.id',
    role: 'cashier',
    restaurant_id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    restaurant_name: 'Sore Dining Mantrijeron',
    badge: 'Kasir Resmi Merchant',
    avatar: 'SD'
  }
];

export function login(req, res) {
  const { email, role } = req.body;

  let targetUser = null;
  if (email) {
    targetUser = DEMO_ACCOUNTS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  } else if (role) {
    targetUser = DEMO_ACCOUNTS.find(u => u.role === role);
  }

  if (!targetUser) {
    // Fallback to customer or cashier based on role
    targetUser = role === 'cashier' ? DEMO_ACCOUNTS[1] : DEMO_ACCOUNTS[0];
  }

  const token = jwt.sign(
    {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      restaurant_id: targetUser.restaurant_id
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: `Login berhasil sebagai ${targetUser.role === 'cashier' ? 'Kasir Merchant' : 'Reviewer Pelanggan'}`,
    data: {
      user: targetUser,
      token
    }
  });
}

export function getProfile(req, res) {
  const userId = req.user?.id || '11111111-1111-1111-1111-111111111111';
  const matchedUser = DEMO_ACCOUNTS.find(u => u.id === userId) || DEMO_ACCOUNTS[0];

  const user = {
    ...matchedUser,
    stats: {
      total_reviews: memoryStore.reviews.length + 11,
      total_photos: 8,
      total_vouchers: memoryStore.discount_vouchers.filter(v => v.status === 'active').length
    }
  };

  res.json({
    success: true,
    data: user
  });
}

export function getMerchantStats(req, res) {
  const totalIssued = memoryStore.review_vouchers.length;
  const totalRedeemed = memoryStore.review_vouchers.filter(v => v.status === 'redeemed').length;
  const conversionRate = totalIssued > 0 ? Math.round((totalRedeemed / totalIssued) * 100) : 0;

  res.json({
    success: true,
    data: {
      restaurant: memoryStore.restaurants[0],
      vouchers_issued: totalIssued,
      vouchers_redeemed: totalRedeemed,
      conversion_rate_percentage: conversionRate,
      average_rating: memoryStore.restaurants[0].average_rating,
      total_reviews: memoryStore.restaurants[0].total_reviews
    }
  });
}
