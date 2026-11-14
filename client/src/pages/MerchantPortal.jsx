import React, { useState, useEffect } from 'react';
import { Store, Printer, Tag, CheckCircle2, AlertCircle, BarChart3, ChevronLeft, ShieldCheck } from 'lucide-react';
import { issueCashierVoucher, redeemCashierDiscount, fetchMerchantAnalytics } from '../services/api';
import PrintVoucherModal from '../components/PrintVoucherModal';

export default function MerchantPortal({ onBack }) {
  const [activeTab, setActiveTab] = useState('issue'); // 'issue', 'redeem', 'analytics'
  const [stats, setStats] = useState(null);

  // Issue Voucher Form
  const [receiptNumber, setReceiptNumber] = useState('');
  const [totalAmount, setTotalAmount] = useState('175000');
  const [issuing, setIssuing] = useState(false);
  const [issuedModalData, setIssuedModalData] = useState(null);

  // Redeem Discount Form
  const [discountCode, setDiscountCode] = useState('');
  const [subtotal, setSubtotal] = useState('150000');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState(null);
  const [redeemError, setRedeemError] = useState('');

  useEffect(() => {
    fetchMerchantAnalytics().then(setStats);
  }, [issuedModalData, redeemResult]);

  const handleIssue = async (e) => {
    e.preventDefault();
    setIssuing(true);
    try {
      const res = await issueCashierVoucher({
        restaurant_id: 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        receipt_number: receiptNumber || `INV-SORE-${Date.now().toString().slice(-4)}`,
        total_amount: totalAmount
      });
      if (res.success) {
        setIssuedModalData(res.data);
        setReceiptNumber('');
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('Gagal menerbitkan voucher');
    } finally {
      setIssuing(false);
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    setRedeeming(true);
    setRedeemError('');
    setRedeemResult(null);
    try {
      const res = await redeemCashierDiscount({
        discount_code: discountCode,
        subtotal
      });
      if (res.success) {
        setRedeemResult(res.data);
        setDiscountCode('');
      } else {
        setRedeemError(res.message);
      }
    } catch (err) {
      setRedeemError('Gagal memvalidasi diskon');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="flex-1 px-4 md:px-10 py-8 max-w-3xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-heading font-bold text-xl text-slate-800">Portal Kasir & Merchant</h1>
          <p className="text-xs text-brand-muted">Sore Dining · Kemang, Jakarta</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 mb-8">
        <button
          onClick={() => setActiveTab('issue')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'issue' ? 'bg-white text-brand-ocean shadow-sm' : 'text-slate-600'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Voucher Nota</span>
        </button>
        <button
          onClick={() => setActiveTab('redeem')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'redeem' ? 'bg-white text-brand-ocean shadow-sm' : 'text-slate-600'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Validasi Diskon 5%</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'analytics' ? 'bg-white text-brand-ocean shadow-sm' : 'text-slate-600'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dasbor Analitik</span>
        </button>
      </div>

      {/* TAB 1: CETAK VOUCHER KASIR (FITUR UTAMA PROPOSAL M-03) */}
      {activeTab === 'issue' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-3 rounded-2xl bg-brand-ice text-brand-ocean">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-800">Tombol Cetak Voucher Ulasan</h2>
              <p className="text-xs text-brand-muted">Masukkan transaksi pelanggan untuk menerbitkan lembar voucher berkode QR unik</p>
            </div>
          </div>

          <form onSubmit={handleIssue} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor Struk / Order ID
              </label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                placeholder="Contoh: INV-SORE-20261109-001"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Belanja Pelanggan (Rp)
              </label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="175000"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={issuing}
              className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-ocean text-white font-heading font-semibold text-sm flex items-center justify-center space-x-2 shadow-md shadow-brand-primary/20 transition-all mt-6"
            >
              <Printer className="w-4 h-4" />
              <span>{issuing ? 'Memproses...' : 'Cetak Lembar Voucher Pelanggan'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: VALIDASI DISKON 5% */}
      {activeTab === 'redeem' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-800">Terapkan Diskon 5% Pelanggan</h2>
              <p className="text-xs text-brand-muted">Validasi voucher diskon dari ulasan sebelumnya (Min. transaksi Rp 100.000)</p>
            </div>
          </div>

          <form onSubmit={handleRedeem} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kode Voucher Diskon Pelanggan
              </label>
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="Contoh: DISC5-SORE-99FA"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm uppercase focus:outline-none focus:border-brand-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nilai Subtotal Belanja Saat Ini (Rp)
              </label>
              <input
                type="number"
                value={subtotal}
                onChange={(e) => setSubtotal(e.target.value)}
                placeholder="150000"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={redeeming}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-semibold text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 transition-all mt-6"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{redeeming ? 'Memeriksa...' : 'Validasi & Terapkan Diskon'}</span>
            </button>
          </form>

          {/* Result Alert */}
          {redeemResult && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1 text-sm">
              <p className="font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Diskon 5% Berhasil Diterapkan!</span>
              </p>
              <p className="text-xs">Subtotal: Rp {redeemResult.subtotal.toLocaleString('id-ID')}</p>
              <p className="text-xs font-semibold text-emerald-600">Potongan Diskon (5%): -Rp {redeemResult.discount_amount.toLocaleString('id-ID')}</p>
              <p className="text-sm font-bold pt-1 border-t border-emerald-200">
                Total Tagihan Akhir: Rp {redeemResult.final_amount.toLocaleString('id-ID')}
              </p>
            </div>
          )}

          {redeemError && (
            <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{redeemError}</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DASBOR ANALITIK */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-xs font-semibold text-brand-muted block uppercase">Voucher Terbit</span>
              <span className="font-heading font-bold text-2xl text-slate-900 mt-1 block">{stats.vouchers_issued}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Diberikan saat checkout kasir</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-xs font-semibold text-brand-muted block uppercase">Ditukar Menjadi Ulasan</span>
              <span className="font-heading font-bold text-2xl text-emerald-600 mt-1 block">{stats.vouchers_redeemed}</span>
              <span className="text-[11px] text-emerald-600 mt-1 block">Rasio Konversi: {stats.conversion_rate_percentage}%</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-xs font-semibold text-brand-muted block uppercase">Rating Rata-Rata</span>
              <span className="font-heading font-bold text-2xl text-brand-star mt-1 block">★ {stats.average_rating}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">{stats.total_reviews} ulasan terverifikasi</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-heading font-semibold text-sm text-slate-800 mb-2">Keunggulan Bagi Restoran</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dengan RasaLokal, ulasan yang masuk 100% berasal dari pembeli nyata di restoran Anda. 
              Voucher diskon 5% yang diterbitkan otomatis telah terbukti mendorong kunjungan ulang tanpa perlu membayar komisi pesan-antar 20-30%.
            </p>
          </div>
        </div>
      )}

      {/* Print Modal */}
      <PrintVoucherModal
        isOpen={!!issuedModalData}
        onClose={() => setIssuedModalData(null)}
        voucherData={issuedModalData}
        type="review"
      />
    </div>
  );
}
