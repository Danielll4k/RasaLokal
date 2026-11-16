import React from 'react';
import { Printer, X, ShieldCheck, Clock, CheckCircle2, QrCode, Sparkles } from 'lucide-react';

export default function PrintVoucherModal({ isOpen, onClose, voucherData, type = 'review', onSimulateScan }) {
  if (!isOpen || !voucherData) return null;

  const handlePrint = () => {
    window.print();
  };

  // Format date and 24h expiry
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeFormatted = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const expiryDate = voucherData.expires_at ? new Date(voucherData.expires_at) : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const expiryFormatted = expiryDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  }) + ', ' + expiryDate.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short'
  });

  const items = voucherData.items || [
    { name: 'Nasi Campur Sore Istimewa', qty: 2, price: 48000, subtotal: 96000 },
    { name: 'Iga Bakar Madu Mantrijeron', qty: 1, price: 65000, subtotal: 65000 },
    { name: 'Es Kopi Susu Tirtodipuran', qty: 2, price: 26000, subtotal: 52000 }
  ];

  const subtotalAmount = items.reduce((sum, item) => sum + (item.subtotal || item.price * item.qty), 0);
  const taxAmount = Math.round(subtotalAmount * 0.1);
  const totalAmount = voucherData.total_amount || (subtotalAmount + taxAmount);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            PRINTER KASIR SIAP
          </span>
          <h3 className="font-heading font-black text-lg text-slate-900 mt-1">
            {type === 'review' ? 'Struk Transaksi & Barcode Ulasan' : 'Lembar Voucher Diskon 5%'}
          </h3>
          <p className="text-xs text-slate-500">1 Nota = 1 Barcode = 1 Ulasan (Expired 24 Jam)</p>
        </div>

        {/* Printable Thermal Receipt Container (80mm Thermal Paper Simulator) */}
        <div id="printable-thermal-receipt" className="bg-[#FAF9F5] border-2 border-dashed border-slate-300 rounded-2xl p-5 text-slate-800 font-mono text-xs shadow-inner">
          {/* Header Toko */}
          <div className="text-center pb-3 border-b border-dashed border-slate-400">
            <h4 className="font-black text-sm uppercase tracking-wider text-slate-900">
              {voucherData.restaurant_name || 'SORE DINING MANTRIJERON'}
            </h4>
            <p className="text-[10px] text-slate-600 mt-0.5">Jl. Tirtodipuran No. 18, Yogyakarta</p>
            <p className="text-[10px] text-slate-500">Telp: (0274) 388-291 · NPWP: 93.812.901.4-541</p>
          </div>

          {/* Metadata Transaksi */}
          <div className="py-2.5 border-b border-dashed border-slate-400 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">No. Nota :</span>
              <span className="font-bold text-slate-900">{voucherData.receipt_number || 'INV-SORE-20261116-001'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Waktu    :</span>
              <span>{dateFormatted} {timeFormatted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kasir    :</span>
              <span>{voucherData.cashier_name || 'Budi (POS-01)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Meja     :</span>
              <span className="font-semibold">{voucherData.table_number || 'Meja 04 (Dine In)'}</span>
            </div>
          </div>

          {/* Rincian Menu Pesanan */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1.5 text-[11px]">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div className="max-w-[200px]">
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-[10px] text-slate-500">{item.qty} x Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  Rp {(item.subtotal || item.price * item.qty).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          {/* Total & Pembayaran */}
          <div className="py-2.5 border-b-2 border-slate-900 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>Rp {subtotalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>PB1 (Pajak Resto 10%)</span>
              <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-300">
              <span>TOTAL BAYAR</span>
              <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-[10px] text-emerald-700 font-bold pt-0.5">
              <span>Metode: QRIS Dinamis</span>
              <span className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800">LUNAS / PAID</span>
            </div>
          </div>

          {/* Perforated Cut Line Divider */}
          <div className="my-3 text-center text-slate-400 select-none text-[10px] font-bold tracking-widest">
            ✂ - - - - - - POTONG DISINI UNTUK ULASAN - - - - - - ✂
          </div>

          {/* SECTION BARCODE & QR ULASAN (FITUR INTI SISTEM) */}
          <div className="p-3 bg-white border border-slate-300 rounded-xl text-center space-y-2">
            <div className="flex items-center justify-center space-x-1 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>KUPON VERIFIKASI PEMBELI</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-tight">
              Scan barcode/QR ini di aplikasi <strong>RasaLokal</strong> untuk memberikan ulasan & dapatkan <strong>Diskon 5%</strong> kunjungan berikutnya!
            </p>

            {/* QR Code */}
            <div className="flex justify-center py-1">
              {voucherData.qr_image ? (
                <img 
                  src={voucherData.qr_image} 
                  alt="QR Code Nota" 
                  className="w-32 h-32 rounded-lg border border-slate-300 p-1 bg-white"
                />
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center">
                  <QrCode className="w-10 h-10 text-slate-400" />
                  <span className="text-[9px] text-slate-400 mt-1 font-mono">QR CODE NOTA</span>
                </div>
              )}
            </div>

            {/* Visual Simulated 1D Barcode (Code128) */}
            <div className="bg-slate-50 py-1.5 px-3 rounded border border-slate-200">
              {/* Simulated Barcode Lines */}
              <div className="h-7 w-48 mx-auto flex items-stretch justify-center gap-[2px] bg-white p-1">
                <span className="w-1 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-2 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-1.5 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-1 bg-black"></span>
                <span className="w-2 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-1 bg-black"></span>
                <span className="w-1.5 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-2 bg-black"></span>
                <span className="w-1 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-1.5 bg-black"></span>
                <span className="w-1 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-2 bg-black"></span>
                <span className="w-1 bg-black"></span>
                <span className="w-0.5 bg-black"></span>
                <span className="w-1.5 bg-black"></span>
                <span className="w-1 bg-black"></span>
              </div>
              <span className="font-mono font-black text-sm tracking-widest text-slate-900 block mt-1">
                {voucherData.voucher_code || voucherData.discount_code}
              </span>
            </div>

            {/* 24-Hour Expiration & 1 Nota 1 Review Rule Notice */}
            <div className="text-[10px] text-left text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-2 space-y-1">
              <div className="flex items-center space-x-1 font-bold text-amber-900">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>KADALUARSA: 24 JAM SETELAH DICETAK</span>
              </div>
              <p className="text-slate-700">
                • Berlaku s/d: <strong className="text-slate-900">{expiryFormatted}</strong>.
              </p>
              <p className="text-slate-700">
                • <strong>1 Nota = 1 Barcode = 1 Review</strong> (token hangus otomatis setelah ulasan dikirim).
              </p>
            </div>
          </div>

          <div className="text-center pt-3 text-[10px] text-slate-500">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>RasaLokal · Platform Ulasan Terverifikasi Pembeli Asli</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handlePrint}
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.01]"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Cetak Nota & Barcode (Print Struk Thermal)</span>
          </button>

          {onSimulateScan && (
            <button
              onClick={() => {
                onSimulateScan(voucherData.voucher_code);
                onClose();
              }}
              className="w-full py-2.5 rounded-2xl bg-brand-ice hover:bg-sky-100 text-brand-ocean font-heading font-bold text-xs flex items-center justify-center space-x-2 border border-brand-ocean/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulasikan Langsung di Scanner Pelanggan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
