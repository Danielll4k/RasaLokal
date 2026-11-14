import { memoryStore } from '../config/db.js';

export function getProfile(req, res) {
  const user = {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Alya Rahman',
    bio: 'Food explorer · Jakarta',
    email: 'alya@rasalokal.id',
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
