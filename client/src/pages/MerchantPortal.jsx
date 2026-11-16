import React, { useState, useEffect } from 'react';
import { Store, Printer, Tag, CheckCircle2, AlertCircle, BarChart3, ChevronLeft, ShieldCheck, Clock, FileText } from 'lucide-react';
import { issueCashierVoucher, redeemCashierDiscount, fetchMerchantAnalytics } from '../services/api';
import PrintVoucherModal from '../components/PrintVoucherModal';

export default function MerchantPortal({ onBack, onNavigateToScan, currentUser }) {
  const [activeTab, setActiveTab] = useState('issue'); // 'issue', 'redeem', 'analytics'
  const [stats, setStats] = useState(null);

  // Issue Voucher Form
  const [receiptNumber, setReceiptNumber] = useState('');
  const [tableNumber, setTableNumber] = useState('Meja 04 (Dine In)');
  const [totalAmount, setTotalAmount] = useState('213000');
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
        table_number: tableNumber,
        total_amount: totalAmount
      });
      if (res.success) {
        setIssuedModalData(res.data);
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
    <div className="flex-1 px-4 md:px-10 py-4 md:py-8 max-w-3xl mx-auto overflow-y-auto pb-28 md:pb-12">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2.5 rounded-2xl liquid-glass text-slate-700 hover:bg-slate-100 transition-colors shadow-sm btn-interactive"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-heading font-black text-2xl text-slate-900">Portal Kasir & Merchant</h1>
          <p className="text-xs text-slate-500">{currentUser?.name || 'Budi Santoso'} · Sore Dining Mantrijeron</p>
        </div>
      </div>

      {/* Navigation Tabs with Liquid Glass */}
      <div className="liquid-glass p-1.5 rounded-2xl flex gap-1 mb-8 shadow-sm">
        <button
          onClick={() => setActiveTab('issue')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all btn-interactive ${
            activeTab === 'issue' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Printer className="w-4 h-4 text-sky-400" />
          <span>Cetak Voucher Nota</span>
        </button>
        <button
          onClick={() => setActiveTab('redeem')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all btn-interactive ${
            activeTab === 'redeem' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4 text-sky-400" />
          <span>Validasi Diskon 5%</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all btn-interactive ${
            activeTab === 'analytics' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-sky-400" />
          <span>Dasbor Analitik</span>
        </button>
      </div>

      {/* TAB 1: CETAK VOUCHER KASIR (FITUR UTAMA PROPOSAL M-03) */}
      {activeTab === 'issue' && (
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-sm card-hover">
          <div className="flex items-center space-x-3.5 mb-6 pb-4 border-b border-slate-100">
            <div className="p-3.5 rounded-2xl bg-brand-ice text-brand-ocean shadow-sm">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-slate-900">Cetak Struk Kasir & Barcode Ulasan</h2>
              <p className="text-xs text-slate-500">Menerbitkan struk transaksi pelanggan dengan barcode unik sekali pakai (expired 24h)</p>
            </div>
          </div>

          <form onSubmit={handleIssue} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Struk / Order ID
                </label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="Contoh: INV-SORE-20261116-001"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-ocean font-mono bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Meja / Keterangan
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Contoh: Meja 04 (Dine In)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-ocean bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Total Tagihan Belanja Pelanggan (Rp)
              </label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="213000"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-ocean font-mono font-bold bg-white"
                required
              />
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Sistem akan meng-generate <strong>1 Barcode Acak</strong> yang <strong>expired dalam 24 jam</strong> dan otomatis hangus setelah ulasan dikirim.</span>
            </div>

            <button
              type="submit"
              disabled={issuing}
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-slate-900/20 btn-interactive mt-5"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>{issuing ? 'Memproses Barcode...' : 'Cetak Nota Kasir + Barcode Ulasan (Print Thermal)'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: VALIDASI DISKON 5% */}
      {activeTab === 'redeem' && (
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-sm card-hover">
          <div className="flex items-center space-x-3.5 mb-6 pb-4 border-b border-slate-100">
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-slate-900">Validasi Voucher Diskon 5% Pelanggan</h2>
              <p className="text-xs text-slate-500">Terapkan diskon repeat order bagi pelanggan yang telah menulis ulasan terverifikasi</p>
            </div>
          </div>

          <form onSubmit={handleRedeem} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kode Voucher Diskon Pelanggan
              </label>
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="CONTOH: DISC5-SORE-99FA"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm uppercase focus:outline-none focus:border-brand-ocean bg-white font-bold tracking-wider"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nilai Subtotal Tagihan Saat Ini (Rp)
              </label>
              <input
                type="number"
                value={subtotal}
                onChange={(e) => setSubtotal(e.target.value)}
                placeholder="150000"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-ocean font-mono bg-white font-bold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={redeeming}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 btn-interactive mt-6"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{redeeming ? 'Memeriksa Voucher...' : 'Validasi & Potong Diskon 5%'}</span>
            </button>
          </form>

          {/* Result Alert */}
          {redeemResult && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1 text-sm animate-in zoom-in-95">
              <p className="font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Diskon 5% Berhasil Diterapkan!</span>
              </p>
              <p className="text-xs">Subtotal: Rp {redeemResult.subtotal.toLocaleString('id-ID')}</p>
              <p className="text-xs font-bold text-emerald-700">Potongan Diskon (5%): -Rp {redeemResult.discount_amount.toLocaleString('id-ID')}</p>
              <p className="text-sm font-black pt-1 border-t border-emerald-200 text-slate-900">
                Total Tagihan Akhir: Rp {redeemResult.final_amount.toLocaleString('id-ID')}
              </p>
            </div>
          )}

          {redeemError && (
            <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-semibold">{redeemError}</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DASBOR ANALITIK */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="liquid-glass p-5 rounded-3xl shadow-sm card-hover">
              <span className="text-xs font-bold text-slate-500 block uppercase">Voucher Terbit</span>
              <span className="font-heading font-black text-2xl text-slate-900 mt-1 block">{stats.vouchers_issued}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Diberikan saat checkout kasir</span>
            </div>

            <div className="liquid-glass p-5 rounded-3xl shadow-sm card-hover">
              <span className="text-xs font-bold text-slate-500 block uppercase">Ditukar Menjadi Ulasan</span>
              <span className="font-heading font-black text-2xl text-emerald-600 mt-1 block">{stats.vouchers_redeemed}</span>
              <span className="text-[11px] text-emerald-600 mt-1 block font-bold">Rasio Konversi: {stats.conversion_rate_percentage}%</span>
            </div>

            <div className="liquid-glass p-5 rounded-3xl shadow-sm card-hover">
              <span className="text-xs font-bold text-slate-500 block uppercase">Rating Rata-Rata</span>
              <span className="font-heading font-black text-2xl text-amber-500 mt-1 block">★ {stats.average_rating}</span>
              <span className="text-[11px] text-slate-400 mt-1 block">{stats.total_reviews} ulasan terverifikasi</span>
            </div>
          </div>

          <div className="liquid-glass rounded-3xl p-6 shadow-sm">
            <h3 className="font-heading font-bold text-sm text-slate-900 mb-2">Keunggulan Bagi Restoran Mitra</h3>
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
        onSimulateScan={onNavigateToScan}
      />
    </div>
  );
}
