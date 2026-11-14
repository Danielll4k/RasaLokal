import { Router } from 'express';
import { getRestaurants, getRestaurantById } from '../controllers/restoController.js';
import { 
  issueReviewVoucher, 
  verifyReviewVoucher, 
  getCustomerDiscountVouchers,
  validateDiscountVoucher 
} from '../controllers/voucherController.js';
import { createReview, getReviewsByRestaurant } from '../controllers/reviewController.js';
import { getProfile, getMerchantStats } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Restaurants
router.get('/restaurants', getRestaurants);
router.get('/restaurants/:id', getRestaurantById);

// Vouchers & Verification
router.post('/vouchers/issue', issueReviewVoucher);
router.post('/vouchers/verify', verifyReviewVoucher);
router.get('/vouchers/my-discounts', authenticate, getCustomerDiscountVouchers);
router.post('/vouchers/redeem-discount', validateDiscountVoucher);

// Reviews (Verified)
router.post('/reviews', authenticate, createReview);
router.get('/reviews/:restaurant_id', getReviewsByRestaurant);

// Profile & Merchant Analytics
router.get('/profile', authenticate, getProfile);
router.get('/merchant/stats', getMerchantStats);

export default router;
