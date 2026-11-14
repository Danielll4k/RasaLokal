import { pool, memoryStore } from '../config/db.js';
import { generateVoucherCode } from '../utils/voucherCode.js';
import QRCode from 'qrcode';

// 1. Merchant: Issue new Review Voucher from Cashier Receipt
export async function issueReviewVoucher(req, res, next) {
  try {
    const { restaurant_id, receipt_number, total_amount } = req.body;

    if (!receipt_number || !total_amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nomor struk dan total nominal belanja wajib diisi' 
      });
    }

    const resto = memoryStore.restaurants.find(r => r.id === restaurant_id) || memoryStore.restaurants[0];
    const code = generateVoucherCode(resto.name);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const verifyUrl = `${process.env.CLIENT_URL || 'https://rasalokal.id'}/verify?code=${code}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 220, margin: 1 });

    const newVoucher = {
      id: `vouch-${Date.now()}`,
      restaurant_id: resto.id,
      restaurant_name: resto.name,
      receipt_number,
      total_amount: Number(total_amount),
      voucher_code: code,
      qr_payload: verifyUrl,
      qr_image: qrDataUrl,
      status: 'issued',
      expires_at: expiresAt,
      created_at: new Date()
    };

    memoryStore.review_vouchers.push(newVoucher);

    res.status(201).json({
      success: true,
      message: 'Voucher nota berhasil diterbitkan',
      data: newVoucher
    });
  } catch (err) {
    next(err);
  }
}

// 2. Customer: Verify Voucher Code or Scanned QR
export async function verifyReviewVoucher(req, res, next) {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Kode nota wajib diisi' });
    }

    const normalized = code.trim().toUpperCase();
    const voucher = memoryStore.review_vouchers.find(v => v.voucher_code.toUpperCase() === normalized);

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: 'Kode voucher tidak valid atau tidak terdaftar pada sistem.'
      });
    }

    if (voucher.status === 'redeemed') {
      return res.status(400).json({
        success: false,
        message: 'Voucher nota ini sudah pernah digunakan untuk memberi ulasan.'
      });
    }

    if (new Date() > new Date(voucher.expires_at)) {
      return res.status(400).json({
        success: false,
        message: 'Voucher nota telah kedaluwarsa (masa berlaku 30 hari).'
      });
    }

    const resto = memoryStore.restaurants.find(r => r.id === voucher.restaurant_id);

    res.json({
      success: true,
      message: 'Nota berhasil diverifikasi. Formulir ulasan dibuka.',
      data: {
        voucher_id: voucher.id,
        voucher_code: voucher.voucher_code,
        restaurant: resto,
        is_verified_buyer: true
      }
    });
  } catch (err) {
    next(err);
  }
}

// 3. Customer: Get Active 5% Discount Vouchers
export async function getCustomerDiscountVouchers(req, res, next) {
  try {
    const vouchers = memoryStore.discount_vouchers.filter(v => v.status === 'active');
    res.json({
      success: true,
      data: vouchers
    });
  } catch (err) {
    next(err);
  }
}

// 4. Merchant: Validate 5% Discount Voucher
export async function validateDiscountVoucher(req, res, next) {
  try {
    const { discount_code, subtotal } = req.body;

    if (!discount_code || !subtotal) {
      return res.status(400).json({
        success: false,
        message: 'Kode diskon dan nilai subtotal belanja wajib diisi'
      });
    }

    const voucher = memoryStore.discount_vouchers.find(
      v => v.discount_code.toUpperCase() === discount_code.trim().toUpperCase()
    );

    if (!voucher || voucher.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Voucher diskon tidak valid atau telah digunakan.'
      });
    }

    if (Number(subtotal) < voucher.minimum_spend) {
      return res.status(400).json({
        success: false,
        message: `Syarat diskon 5% belum terpenuhi. Minimal pembelanjaan adalah Rp ${voucher.minimum_spend.toLocaleString('id-ID')}`
      });
    }

    const discountAmount = Math.round(Number(subtotal) * 0.05);
    const finalAmount = Number(subtotal) - discountAmount;

    // Mark as used
    voucher.status = 'used';
    voucher.used_at = new Date();

    res.json({
      success: true,
      message: 'Voucher diskon 5% berhasil diterapkan!',
      data: {
        discount_code: voucher.discount_code,
        subtotal: Number(subtotal),
        discount_amount: discountAmount,
        final_amount: finalAmount
      }
    });
  } catch (err) {
    next(err);
  }
}
