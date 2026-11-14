import React, { useState } from 'react';
import { QrCode, KeyRound, Camera, ShieldCheck, AlertCircle, ArrowRight, Upload } from 'lucide-react';
import { verifyVoucherCode } from '../services/api';

export default function ScanNota({ onVerified, onBack }) {
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' or 'input'
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (tokenCode) => {
    setLoading(true);
    setError('');
    try {
      const res = await verifyVoucherCode(tokenCode || code);
      if (res.success) {
        onVerified(res.data);
      } else {
        setError(res.message || 'Verifikasi gagal. Periksa kembali kode nota Anda.');
      }
    } catch (err) {
      setError('Terjadi kendala koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateScan = () => {
    // Standard proposal demo code
    setCode('SORE-8X29K');
    handleVerify('SORE-8X29K');
  };

  return (
    <div className="flex-1 px-4 md:px-10 py-8 max-w-2xl mx-auto overflow-y-auto">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="font-heading font-bold text-xl text-slate-900">Verifikasi Nota</h1>
      </div>

      {/* Info Card */}
      <div className="bg-brand-ice/80 border border-brand-primary/20 rounded-3xl p-5 mb-6 flex items-start space-x-3.5">
        <div className="p-2.5 rounded-2xl bg-white text-brand-ocean shadow-sm shrink-0">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-sm text-slate-800">Buka akses ratingmu</h3>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Scan QR/barcode atau masukkan kode unik pada nota fisik untuk memastikan ulasan berasal dari pelanggan asli.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 mb-6">
        <button
          onClick={() => { setActiveTab('scan'); setError(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'scan' ? 'bg-white text-brand-ocean shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Scan nota</span>
        </button>
        <button
          onClick={() => { setActiveTab('input'); setError(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
            activeTab === 'input' ? 'bg-white text-brand-ocean shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Input kode</span>
        </button>
      </div>

      {/* Tab 1: Scanner View */}
      {activeTab === 'scan' ? (
        <div className="bg-slate-800 rounded-3xl p-8 text-center text-white mb-6 relative overflow-hidden shadow-xl">
          {/* Scanner Viewfinder Box */}
          <div className="relative w-64 h-56 mx-auto border-2 border-brand-primary/60 rounded-3xl flex flex-col items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            {/* Viewfinder Corners */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-brand-primary rounded-tl-xl" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-brand-primary rounded-tr-xl" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-brand-primary rounded-bl-xl" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-brand-primary rounded-br-xl" />

            {/* Scanning line animation */}
            <div className="w-48 h-0.5 bg-brand-primary shadow-[0_0_12px_#51B5E5] animate-pulse mb-3" />
            <QrCode className="w-12 h-12 text-slate-400 opacity-60" />
            <span className="text-[11px] text-slate-300 mt-3 font-medium">Arahkan ke QR / barcode nota</span>
          </div>

          <p className="text-xs text-slate-400 mt-6">
            Pastikan kode terlihat jelas dan berada di dalam bingkai.
          </p>

          {/* Demonstration Shortcut */}
          <button
            onClick={handleSimulateScan}
            disabled={loading}
            className="w-full mt-6 py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-ocean text-white font-heading font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-brand-primary/20 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>{loading ? 'Memvalidasi Nota...' : 'Simulasikan scan nota'}</span>
          </button>

          <button 
            onClick={() => setActiveTab('input')}
            className="mt-3 text-xs text-slate-400 hover:text-white inline-flex items-center space-x-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah foto nota atau ketik kode manual</span>
          </button>
        </div>
      ) : (
        /* Tab 2: Manual Code Input */
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Kode unik nota
          </label>
          <div className="border border-slate-200 rounded-2xl p-3.5 flex items-center space-x-3 focus-within:border-brand-primary mb-2">
            <KeyRound className="w-5 h-5 text-brand-muted" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Contoh: SORE-8X29K"
              className="w-full uppercase font-mono font-bold tracking-wider text-sm text-slate-800 placeholder-slate-300 focus:outline-none"
            />
          </div>
          <span className="text-[11px] text-brand-muted block mb-6">
            Kode biasanya tercetak di bagian bawah nota dan hanya dapat digunakan satu kali.
          </span>

          <button
            onClick={() => handleVerify(code)}
            disabled={loading || !code.trim()}
            className="w-full py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-ocean disabled:bg-slate-200 text-white font-heading font-semibold text-sm transition-all shadow-md shadow-brand-primary/20"
          >
            {loading ? 'Memeriksa...' : 'Verifikasi kode'}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center space-x-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="text-center text-xs text-slate-400 flex items-center justify-center space-x-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Aman dan privat · Data nota hanya digunakan untuk validasi transaksi dan tidak dipublikasikan.</span>
      </div>
    </div>
  );
}
