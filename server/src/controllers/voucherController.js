import { pool, memoryStore } from '../config/db.js';
import { generateVoucherCode } from '../utils/voucherCode.js';
import QRCode from 'qrcode';

// 1. Merchant: Issue new Review Voucher from Cashier Receipt
export async function issueReviewVoucher(req, res, next) {
  try {
    const { restaurant_id, receipt_number, total_amount, table_number, cashier_name, items } = req.body;

    if (!receipt_number || !total_amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nomor struk dan total nominal belanja wajib diisi' 
      });
    }

    const resto = memoryStore.restaurants.find(r => r.id === restaurant_id) || memoryStore.restaurants[0];
    const code = generateVoucherCode(resto.name);
    // Expired exactly 24 hours after print (1 nota 1 barcode 1 review)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const verifyUrl = `${process.env.CLIENT_URL || 'https://rasalokal.id'}/verify?code=${code}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 220, margin: 1 });

    const newVoucher = {
      id: `vouch-${Date.now()}`,
      restaurant_id: resto.id,
      restaurant_name: resto.name,
      receipt_number,
      table_number: table_number || 'Meja 04 (Dine In)',
      cashier_name: cashier_name || 'Budi - Kasir 01',
      total_amount: Number(total_amount),
      items: items || [
        { name: 'Nasi Campur Sore Istimewa', qty: 2, price: 48000, subtotal: 96000 },
        { name: 'Iga Bakar Madu Mantrijeron', qty: 1, price: 65000, subtotal: 65000 },
        { name: 'Es Kopi Susu Tirtodipuran', qty: 2, price: 26000, subtotal: 52000 }
      ],
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

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ 
        success: false, 
        error_type: 'EMPTY_CODE',
        message: 'Kode barcode nota tidak boleh kosong.' 
      });
    }

    const normalized = code.trim().toUpperCase();

    // Check basic structural format (e.g. SORE-XXXXX or 3-6 letters dash 4-8 chars)
    const validFormatRegex = /^[A-Z0-9]{3,6}-[A-Z0-9]{4,8}$/;
    if (!validFormatRegex.test(normalized)) {
      return res.status(422).json({
        success: false,
        error_type: 'INVALID_FORMAT',
        title: 'Format Kode Belum Sesuai',
        message: 'Format kode nota yang dimasukkan belum sesuai. Kode resmi dari kasir restoran berbentuk [KODE_RESTO]-[KODE_UNIK] (contoh: SORE-8X29K).',
        submitted_code: normalized
      });
    }

    const voucher = memoryStore.review_vouchers.find(v => v.voucher_code.toUpperCase() === normalized);

    if (!voucher) {
      return res.status(404).json({
        success: false,
        error_type: 'NOT_FOUND_OR_FAKE',
        title: 'Kode Nota Tidak Ditemukan',
        message: 'Kode nota tidak terdaftar di sistem kasir resto kami. Mohon pastikan Anda memasukkan kode yang tertera pada kertas nota fisik Anda.',
        submitted_code: normalized
      });
    }

    if (voucher.status === 'redeemed') {
      const redeemedTime = voucher.redeemed_at 
        ? new Date(voucher.redeemed_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : 'beberapa saat yang lalu';
      return res.status(409).json({
        success: false,
        error_type: 'ALREADY_REDEEMED',
        title: 'Nota Sudah Pernah Digunakan',
        message: `Nota ini sudah pernah digunakan untuk memberikan ulasan pada pukul ${redeemedTime}. Demi keadilan ulasan, satu nota belanja berlaku untuk satu ulasan.`,
        submitted_code: normalized
      });
    }

    if (new Date() > new Date(voucher.expires_at)) {
      return res.status(410).json({
        success: false,
        error_type: 'EXPIRED_24H',
        title: 'Masa Berlaku Nota Telah Habis',
        message: 'Batas waktu pengisian ulasan untuk nota ini telah melewati 24 jam sejak dicetak oleh kasir agar ulasan tetap relevan dengan kunjungan terkini.',
        submitted_code: normalized
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
