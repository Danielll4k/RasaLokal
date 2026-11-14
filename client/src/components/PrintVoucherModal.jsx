import React from 'react';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

export default function PrintVoucherModal({ isOpen, onClose, voucherData, type = 'review' }) {
  if (!isOpen || !voucherData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Printable Ticket Area */}
        <div id="printable-voucher" className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center bg-slate-50/50">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-ice text-brand-ocean mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <h4 className="font-heading font-bold text-lg text-slate-800">
            {type === 'review' ? 'VOUCHER NOTA PEMBELIAN' : 'VOUCHER DISKON 5%'}
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {voucherData.restaurant_name || 'RasaLokal Merchant Partner'}
          </p>

          {/* QR Code Container */}
          <div className="my-4 flex justify-center">
            {voucherData.qr_image ? (
              <img src={voucherData.qr_image} alt="Voucher QR" className="w-36 h-36 rounded-xl border border-slate-200 p-1 bg-white shadow-sm" />
            ) : (
              <div className="w-36 h-36 rounded-xl border-2 border-brand-ocean bg-white flex flex-col items-center justify-center p-2 text-brand-ocean">
                <span className="text-[10px] font-bold">SCAN QR NOTA</span>
                <span className="font-mono text-xs font-bold mt-1">{voucherData.voucher_code || voucherData.discount_code}</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl py-2 px-3 border border-slate-200 mb-3">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Kode Unik</span>
            <span className="font-mono text-base font-bold text-brand-ocean tracking-wider">
              {voucherData.voucher_code || voucherData.discount_code}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 space-y-1 text-left border-t border-slate-200/80 pt-3">
            {type === 'review' ? (
              <>
                <p>• Berlaku sekali pakai untuk 1x ulasan terverifikasi.</p>
                <p>• Dapatkan diskon 5% untuk kunjungan berikutnya setelah menyelesaikan rating.</p>
                <p>• Masa berlaku: 30 hari sejak transaksi.</p>
              </>
            ) : (
              <>
                <p>• Potongan 5% dengan minimal belanja Rp 100.000.</p>
                <p>• Tunjukkan kode QR atau cetak voucher ini kepada kasir saat pembayaran.</p>
              </>
            )}
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-2xl bg-brand-primary hover:bg-brand-ocean text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-md shadow-brand-primary/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Lembar Voucher</span>
          </button>
        </div>
      </div>
    </div>
  );
}
