import { pool, memoryStore } from '../config/db.js';
import { generateDiscountCode } from '../utils/voucherCode.js';

export async function createReview(req, res, next) {
  try {
    const { voucher_id, rating, review_text, photos_url } = req.body;

    if (!voucher_id || !rating) {
      return res.status(400).json({ 
        success: false, 
        message: 'Voucher ID dan rating bintang wajib diisi' 
      });
    }

    // 1. Verify single-use voucher
    const voucher = memoryStore.review_vouchers.find(v => v.id === voucher_id);
    if (!voucher || voucher.status === 'redeemed') {
      return res.status(400).json({
        success: false,
        message: 'Voucher nota tidak sah atau telah pernah ditukar sebelumnya.'
      });
    }

    const resto = memoryStore.restaurants.find(r => r.id === voucher.restaurant_id) || memoryStore.restaurants[0];

    // 2. Create review
    const newReview = {
      id: `rev-${Date.now()}`,
      restaurant_id: resto.id,
      user_id: req.user?.id || '11111111-1111-1111-1111-111111111111',
      voucher_id: voucher.id,
      rating: Number(rating),
      review_text: review_text || '',
      photos_url: photos_url || [],
      is_verified_buyer: true,
      author_name: req.user?.name || 'Alya Rahman',
      created_at: new Date()
    };

    memoryStore.reviews.unshift(newReview);

    // 3. Mark review voucher as redeemed
    voucher.status = 'redeemed';
    voucher.redeemed_at = new Date();

    // 4. Automatically generate 5% Discount Voucher Reward
    const discountCode = generateDiscountCode(resto.name);
    const newDiscountVoucher = {
      id: `disc-${Date.now()}`,
      review_id: newReview.id,
      user_id: newReview.user_id,
      restaurant_id: resto.id,
      restaurant_name: resto.name,
      discount_code: discountCode,
      discount_percentage: 5,
      minimum_spend: 100000.00,
      status: 'active',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      created_at: new Date()
    };

    memoryStore.discount_vouchers.unshift(newDiscountVoucher);

    // 5. Update restaurant rating
    const restoReviews = memoryStore.reviews.filter(r => r.restaurant_id === resto.id);
    const avg = restoReviews.reduce((acc, curr) => acc + curr.rating, 0) / restoReviews.length;
    resto.average_rating = Number(avg.toFixed(2));
    resto.total_reviews = restoReviews.length;

    res.status(201).json({
      success: true,
      message: 'Ulasan terverifikasi berhasil dikirim! Anda memperoleh Voucher Diskon 5%.',
      data: {
        review: newReview,
        reward_voucher: newDiscountVoucher
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getReviewsByRestaurant(req, res, next) {
  try {
    const { restaurant_id } = req.params;
    const reviews = memoryStore.reviews.filter(r => r.restaurant_id === restaurant_id);
    res.json({
      success: true,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
}
