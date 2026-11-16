import React, { useState, useEffect, useRef } from 'react';
import { QrCode, KeyRound, Camera, ShieldCheck, ShieldAlert, AlertTriangle, Sparkles, Receipt, RefreshCw, Upload, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { verifyVoucherCode } from '../services/api';

export default function ScanNota({ onVerified, onBack }) {
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' or 'input'
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorDetail, setErrorDetail] = useState(null); // { title, message, code, type }
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [detectedSuccess, setDetectedSuccess] = useState(false);

  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Audio feedback: Success chime
  const playSuccessChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  };

  // Audio feedback: Low error buzzer for bogus/fake barcode
  const playErrorBuzzer = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {}
  };

  const extractCode = (decodedText) => {
    if (!decodedText) return '';
    const match = decodedText.match(/code=([A-Za-z0-9-]+)/i);
    if (match && match[1]) {
      return match[1].toUpperCase();
    }
    return decodedText.trim().toUpperCase();
  };

  const handleVerify = async (tokenCode) => {
    const targetCode = tokenCode || code;
    if (!targetCode) return;
    setLoading(true);
    setErrorDetail(null);
    try {
      const res = await verifyVoucherCode(targetCode);
      if (res.success) {
        playSuccessChime();
        setDetectedSuccess(true);
        setTimeout(() => {
          onVerified(res.data);
        }, 600);
      } else {
        playErrorBuzzer();
        setErrorDetail({
          title: res.title || 'Kode Nota Belum Sesuai',
          type: res.error_type || 'INFO',
          message: res.message || 'Kode nota belum sesuai atau tidak ditemukan pada sistem kasir.',
          submittedCode: targetCode
        });
      }
    } catch (err) {
      playErrorBuzzer();
      setErrorDetail({
        title: 'Kendala Koneksi',
        type: 'NETWORK_ERROR',
        message: 'Gagal menghubungi server verifikasi. Periksa koneksi internet Anda.',
        submittedCode: targetCode
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeDetected = (rawText) => {
    const cleanCode = extractCode(rawText);
    if (!cleanCode) return;

    setCode(cleanCode);

    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(() => {});
      setCameraActive(false);
    }

    handleVerify(cleanCode);
  };

  // Start Camera with html5-qrcode
  const startCamera = async () => {
    setCameraError('');
    setErrorDetail(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-camera-viewport');
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          handleCodeDetected(decodedText);
        },
        () => {}
      );
      setCameraActive(true);
    } catch (err) {
      setCameraActive(false);
      setCameraError('Kamera fisik tidak terdeteksi atau izin akses kamera belum diizinkan oleh browser.');
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (e) {}
      setCameraActive(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setLoading(true);
    setErrorDetail(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-camera-viewport');
      }
      const decodedResult = await scannerRef.current.scanFile(file, true);
      handleCodeDetected(decodedResult);
    } catch (err) {
      playErrorBuzzer();
      setErrorDetail({
        title: 'Gambar Tidak Terbaca',
        type: 'IMAGE_UNREADABLE',
        message: 'Tidak dapat mendeteksi Barcode atau QR Code resmi dari gambar yang Anda unggah. Pastikan gambar nota jelas dan tidak buram.',
        submittedCode: file.name
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeTab]);

  return (
    <div className="flex-1 px-4 md:px-10 py-4 md:py-8 max-w-2xl mx-auto overflow-y-auto pb-28 md:pb-12">
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-ocean bg-brand-ice px-3 py-1 rounded-full inline-block mb-2 border border-brand-ocean/20">
          SISTEM VERIFIKASI PEMBELIAN FISIK
        </span>
        <h1 className="font-heading font-black text-2xl text-slate-900">Validasi Nota Belanja</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Setiap ulasan diawali dengan memindai kode nota resmi agar ulasan yang terkumpul berasal dari pembeli yang berkunjung langsung.
        </p>
      </div>

      {/* Tabs with Liquid Glass */}
      <div className="liquid-glass p-1.5 rounded-2xl flex gap-1 mb-6 shadow-sm">
        <button
          onClick={() => { setActiveTab('scan'); setErrorDetail(null); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all btn-interactive ${
            activeTab === 'scan' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-4 h-4 text-sky-400" />
          <span>Kamera Scanner Aktif</span>
        </button>
        <button
          onClick={() => { setActiveTab('input'); setErrorDetail(null); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all btn-interactive ${
            activeTab === 'input' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-4 h-4 text-sky-400" />
          <span>Input Manual Kode</span>
        </button>
      </div>

      {/* PEMBERITAHUAN NOTA BELUM SESUAI */}
      {errorDetail && (
        <div className="mb-6 p-5 rounded-3xl bg-amber-50/95 border border-amber-300 text-left shadow-lg animate-shake relative overflow-hidden">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                  INFORMASI VERIFIKASI NOTA
                </span>
              </div>
              <h4 className="font-heading font-bold text-base text-slate-900 mt-1">
                {errorDetail.title || 'Kode Nota Belum Sesuai'}
              </h4>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {errorDetail.message}
              </p>

              {errorDetail.submittedCode && (
                <div className="mt-3 p-2.5 bg-white/90 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Kode yang dimasukkan:</span>
                  <span className="font-mono font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {errorDetail.submittedCode}
                  </span>
                </div>
              )}

              <div className="mt-3.5 flex gap-2">
                <button
                  onClick={() => {
                    setErrorDetail(null);
                    if (activeTab === 'scan') startCamera();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold btn-interactive shadow-sm"
                >
                  Coba Pindai Ulang
                </button>
                <button
                  onClick={() => setErrorDetail(null)}
                  className="px-3 py-2 rounded-xl bg-white text-slate-700 text-xs font-semibold border border-slate-200 hover:bg-slate-50 btn-interactive"
                >
                  Tutup Pesan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Live Camera Scanner */}
      {activeTab === 'scan' ? (
        <div className="bg-slate-900 rounded-3xl p-6 text-center text-white mb-6 relative overflow-hidden shadow-2xl border border-slate-800 card-hover">
          {/* Camera Viewport Container */}
          <div className={`relative w-full max-w-[280px] h-[280px] mx-auto rounded-3xl overflow-hidden border-2 transition-colors ${
            detectedSuccess ? 'border-emerald-400 ring-4 ring-emerald-400/30' : 'border-sky-400/50'
          } bg-black flex items-center justify-center shadow-inner`}>
            
            {/* HTML5 QR Camera Element */}
            <div id="qr-camera-viewport" className="w-full h-full object-cover"></div>

            {/* Viewfinder Corners */}
            <div className="absolute top-2 left-2 w-7 h-7 border-t-4 border-l-4 border-sky-400 rounded-tl-xl pointer-events-none z-10" />
            <div className="absolute top-2 right-2 w-7 h-7 border-t-4 border-r-4 border-sky-400 rounded-tr-xl pointer-events-none z-10" />
            <div className="absolute bottom-2 left-2 w-7 h-7 border-b-4 border-l-4 border-sky-400 rounded-bl-xl pointer-events-none z-10" />
            <div className="absolute bottom-2 right-2 w-7 h-7 border-b-4 border-r-4 border-sky-400 rounded-br-xl pointer-events-none z-10" />

            {/* Animated Laser Scanning Line */}
            {cameraActive && (
              <div className="absolute inset-x-4 h-0.5 bg-sky-400 shadow-[0_0_15px_#38bdf8] animate-scan-laser pointer-events-none z-10" />
            )}

            {/* Success flash indicator */}
            {detectedSuccess && (
              <div className="absolute inset-0 bg-emerald-500/30 backdrop-blur-xs flex items-center justify-center z-20 animate-in zoom-in-95">
                <CheckCircle2 className="w-16 h-16 text-emerald-300 drop-shadow-md animate-bounce" />
              </div>
            )}
          </div>

          {/* Camera Status & Controls */}
          {cameraActive ? (
            <p className="text-xs text-sky-200 mt-4 flex items-center justify-center space-x-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Kamera aktif. Arahkan lensa ke QR Code atau Barcode pada struk nota.</span>
            </p>
          ) : (
            <div className="mt-4">
              <p className="text-xs text-slate-400 mb-3">
                {cameraError || 'Kamera sedang diinisialisasi...'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-brand-ocean hover:bg-sky-600 text-white text-xs font-bold inline-flex items-center space-x-1.5 btn-interactive shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Nyalakan Kamera</span>
                </button>

                {/* Upload Image Option */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center space-x-1.5 border border-slate-700 btn-interactive"
                >
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>Unggah Foto Nota</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Manual Code Input */
        <div className="liquid-glass rounded-3xl p-6 md:p-8 shadow-sm mb-6">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Kode Unik Barcode pada Nota (Contoh: SORE-8X29K)
          </label>
          <div className="border-2 border-slate-200 rounded-2xl p-3.5 flex items-center space-x-3 focus-within:border-brand-ocean transition-all mb-2 bg-white">
            <KeyRound className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="KETIK KODE: SORE-8X29K"
              className="w-full uppercase font-mono font-bold tracking-widest text-base text-slate-900 placeholder-slate-300 focus:outline-none"
            />
          </div>
          <span className="text-[11px] text-slate-500 block mb-6">
            💡 1 nota transaksi hanya menghasilkan 1 barcode unik yang berlaku selama 24 jam sejak dicetak oleh kasir.
          </span>

          <button
            onClick={() => handleVerify(code)}
            disabled={loading || !code.trim()}
            className="w-full py-3.5 rounded-2xl bg-brand-ocean hover:bg-sky-600 disabled:bg-slate-200 text-white font-heading font-bold text-sm btn-interactive shadow-md shadow-brand-ocean/20"
          >
            {loading ? 'Memeriksa Keaslian Barcode...' : 'Verifikasi & Buka Rating'}
          </button>
        </div>
      )}

      {/* QUICK TESTING SCENARIOS FOR KMM 2026 JURY / DEMONSTRATION */}
      <div className="bg-slate-50/90 border border-slate-200/90 rounded-3xl p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="font-heading font-bold text-xs text-slate-900 uppercase tracking-wide">
              Uji Coba Skenario Sistem Verifikasi
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Demo KMM 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Scenario 1: Valid Genuine Receipt */}
          <button
            onClick={() => {
              setCode('SORE-8X29K');
              handleVerify('SORE-8X29K');
            }}
            disabled={loading}
            className="p-3 rounded-2xl bg-white border border-emerald-300 hover:bg-emerald-50 text-left btn-interactive transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">✅ 1. Nota Transaksi Resmi</span>
              <span className="font-mono text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-bold">SORE-8X29K</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Lolos verifikasi & membuka formulir ulasan.</p>
          </button>

          {/* Scenario 2: Unregistered / Unlisted Code */}
          <button
            onClick={() => {
              setCode('FAKE-99999');
              handleVerify('FAKE-99999');
            }}
            disabled={loading}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-left btn-interactive transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">ℹ️ 2. Kode Belum Terdaftar</span>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-bold">FAKE-99999</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Pemberitahuan: kode nota tidak ditemukan di kasir resto.</p>
          </button>

          {/* Scenario 3: Expired >24h Receipt */}
          <button
            onClick={() => {
              setCode('SORE-EXPD1');
              handleVerify('SORE-EXPD1');
            }}
            disabled={loading}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-left btn-interactive transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">⏱️ 3. Nota Melewati 24 Jam</span>
              <span className="font-mono text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">SORE-EXPD1</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Pemberitahuan: masa berlaku ulasan 24 jam setelah dicetak.</p>
          </button>

          {/* Scenario 4: Already Redeemed (Single-Use) */}
          <button
            onClick={() => {
              setCode('SORE-USED2');
              handleVerify('SORE-USED2');
            }}
            disabled={loading}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-left btn-interactive transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">🔒 4. Nota Sudah Pernah Digunakan</span>
              <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-bold">SORE-USED2</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Pemberitahuan: satu nota berlaku untuk satu ulasan.</p>
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="text-center text-xs text-slate-500 flex items-center justify-center space-x-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Sistem RasaLokal: Verifikasi kode nota memastikan setiap ulasan berasal dari pengalaman pembeli nyata.</span>
      </div>
    </div>
  );
}
