import React, { useState, useEffect } from 'react';
import { Ticket, ChevronLeft, QrCode, Clock, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { fetchMyDiscountVouchers } from '../services/api';
import PrintVoucherModal from '../components/PrintVoucherModal';

export default function MyVouchers({ onBack }) {
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    fetchMyDiscountVouchers().then(setVouchers);
  }, []);

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
          <h1 className="font-heading font-black text-2xl text-slate-900">Dompet Voucher Kuliner</h1>
          <p className="text-xs text-slate-500">Koleksi voucher reward diskon 5% dari ulasan terverifikasi</p>
        </div>
      </div>

      {/* Reward Summary Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-5 sm:p-7 md:p-8 text-white shadow-[0_18px_40px_-8px_rgba(15,23,42,0.38)] mb-6 sm:mb-8 flex items-center justify-between border border-slate-800/80 relative overflow-hidden card-hover">
        <div className="relative z-10 min-w-0 pr-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-800/60 inline-block mb-2">
            STATUS DOMPET AKTIF
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl">{vouchers.length} Kupon Tersedia</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
            Tunjukkan kode QR atau nomor voucher ke kasir sebelum pembayaran untuk menikmati potongan 5%.
          </p>
        </div>
        <div className="p-3 sm:p-4 rounded-3xl bg-white/5 border border-white/10 shrink-0 shadow-inner">
          <Ticket className="w-8 h-8 sm:w-12 sm:h-12 text-sky-400" />
        </div>
      </div>

      {/* Voucher List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-base text-slate-900">Voucher Siap Digunakan</h3>
          <span className="text-xs text-slate-500 font-semibold">{vouchers.length} Kupon Aktif</span>
        </div>

        {vouchers.length === 0 ? (
          <div className="liquid-glass rounded-3xl p-10 text-center text-slate-400 shadow-[0_14px_32px_-6px_rgba(15,23,42,0.10)]">
            <Ticket className="w-12 h-12 mx-auto mb-2 opacity-30 text-slate-500" />
            <p className="text-sm font-bold text-slate-700">Belum ada kupon diskon</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Scan nota belanja restoran fisik dan berikan rating untuk mendapatkan kupon diskon 5%.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {vouchers.map((v) => (
              <div 
                key={v.id}
                className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-[0_16px_36px_-6px_rgba(15,23,42,0.14),0_6px_14px_-2px_rgba(15,23,42,0.05)] border border-slate-200/90 flex flex-col gap-3.5 group hover:border-brand-ocean hover:shadow-[0_22px_44px_-8px_rgba(2,132,199,0.24)] transition-all card-hover relative overflow-hidden"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Perforated Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-heading font-black flex flex-col items-center justify-center shadow-lg shadow-amber-500/25 shrink-0">
                    <span className="text-xl leading-none">5%</span>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-slate-900/80">OFF</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-heading font-bold text-base text-slate-900 truncate">{v.restaurant_name}</h4>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        Aktif
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Masa berlaku 30 hari · Min. Rp 100k</span>
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="font-mono text-xs bg-slate-100 border border-slate-300/80 px-2.5 py-1 rounded-lg text-slate-800 font-bold tracking-wider shrink-0">
                        {v.discount_code}
                      </span>
                      <span className="text-[11px] text-slate-400">Single-use token</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100/90">
                  <button
                    onClick={() => setSelectedVoucher(v)}
                    className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-slate-900/25 btn-interactive"
                  >
                    <QrCode className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Tampilkan ke Kasir</span>
                  </button>
                </div>
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
