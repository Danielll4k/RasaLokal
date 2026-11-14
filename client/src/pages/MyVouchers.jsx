import React, { useState, useEffect } from 'react';
import { Ticket, ChevronLeft, QrCode, Clock, CheckCircle } from 'lucide-react';
import { fetchMyDiscountVouchers } from '../services/api';
import PrintVoucherModal from '../components/PrintVoucherModal';

export default function MyVouchers({ onBack }) {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    fetchMyDiscountVouchers().then(setVouchers);
  }, []);

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
        <h1 className="font-heading font-bold text-xl text-slate-800">Voucher Saya</h1>
      </div>

      {/* Reward Summary Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-brand-primary to-brand-ocean p-6 text-white shadow-md shadow-brand-primary/15 mb-8 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block">REWARD TERSEDIA</span>
          <h2 className="font-heading font-bold text-2xl">{vouchers.length} Voucher</h2>
          <p className="text-xs text-white/90 mt-1">Gunakan untuk potongan harga 5% di restoran favoritmu.</p>
        </div>
        <Ticket className="w-12 h-12 text-white/30" />
      </div>

      {/* Voucher List */}
      <div>
        <h3 className="font-heading font-semibold text-sm text-slate-800 mb-4">Siap digunakan</h3>

        {vouchers.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 text-slate-400">
            <Ticket className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Belum ada voucher tersedia</p>
            <p className="text-xs text-slate-400 mt-1">Selesaikan ulasan dengan verifikasi nota belanja untuk mendapatkan diskon 5%.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vouchers.map((v) => (
              <div 
                key={v.id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-brand-primary/40 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* Discount Badge */}
                  <div className="w-16 h-16 rounded-2xl bg-brand-ice border border-brand-primary/20 flex flex-col items-center justify-center text-brand-ocean font-heading font-bold shrink-0">
                    <span className="text-lg leading-none">5%</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">OFF</span>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-base text-slate-800">{v.restaurant_name}</h4>
                    <p className="text-xs text-brand-muted flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Berlaku selama 30 hari</span>
                    </p>
                    <span className="inline-block mt-2 font-mono text-[11px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 font-semibold">
                      {v.discount_code}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVoucher(v)}
                  className="px-5 py-2.5 rounded-xl bg-brand-ice hover:bg-brand-primary hover:text-white text-brand-ocean font-semibold text-xs transition-colors"
                >
                  Pakai
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voucher Detail / Print Modal */}
      <PrintVoucherModal
        isOpen={!!selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        voucherData={selectedVoucher}
        type="discount"
      />
    </div>
  );
}
