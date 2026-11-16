import React, { useState } from 'react';
import { User, Store, ShieldCheck, ArrowRight, X, Lock, CheckCircle2, KeyRound } from 'lucide-react';
import { loginUser } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, currentRole = 'customer' }) {
  if (!isOpen) return null;

  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [email, setEmail] = useState(currentRole === 'cashier' ? 'kasir@soredining.id' : 'alya@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
    if (role === 'cashier') {
      setEmail('kasir@soredining.id');
    } else {
      setEmail('alya@gmail.com');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser({ email, role: selectedRole });
      if (res.success) {
        onLoginSuccess(res.data.user);
        onClose();
      } else {
        setError(res.message || 'Login gagal.');
      }
    } catch (err) {
      setError('Koneksi ke server terputus.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-ocean to-brand-primary flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-black text-xl text-slate-900">Masuk ke RasaLokal</h2>
          <p className="text-xs text-slate-500 mt-1">Pilih peran akun untuk menguji fitur ulasan atau portal kasir</p>
        </div>

        {/* Quick Role Select Cards (Demo Friendly for KMM 2026 Jury) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Role 1: Reviewer Pelanggan */}
          <div 
            onClick={() => handleRoleSelect('customer')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedRole === 'customer'
                ? 'border-brand-ocean bg-brand-ice/60 shadow-sm'
                : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1.5">
              <div className={`p-1.5 rounded-xl ${selectedRole === 'customer' ? 'bg-brand-ocean text-white' : 'bg-slate-200 text-slate-600'}`}>
                <User className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xs text-slate-900">Reviewer</span>
            </div>
            <p className="text-[11px] text-slate-600 font-semibold">Alya Rahman</p>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/80 px-1.5 py-0.5 rounded inline-block mt-1">
              ✓ Scan & Review
            </span>
          </div>

          {/* Role 2: Kasir / Restoran Partner */}
          <div 
            onClick={() => handleRoleSelect('cashier')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedRole === 'cashier'
                ? 'border-brand-ocean bg-brand-ice/60 shadow-sm'
                : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1.5">
              <div className={`p-1.5 rounded-xl ${selectedRole === 'cashier' ? 'bg-brand-ocean text-white' : 'bg-slate-200 text-slate-600'}`}>
                <Store className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xs text-slate-900">Kasir Resto</span>
            </div>
            <p className="text-[11px] text-slate-600 font-semibold">Sore Dining</p>
            <span className="text-[10px] text-sky-800 font-semibold bg-sky-100/80 px-1.5 py-0.5 rounded inline-block mt-1">
              ✓ Cetak Barcode 24h
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Akun</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-ocean font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-ocean font-medium"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-xl border border-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-brand-ocean hover:bg-sky-600 text-white font-heading font-bold text-sm shadow-md shadow-brand-ocean/20 transition-all flex items-center justify-center space-x-2 mt-4 hover:scale-[1.01]"
          >
            <span>{loading ? 'Memproses Masuk...' : `Masuk sebagai ${selectedRole === 'cashier' ? 'Kasir Sore Dining' : 'Reviewer Alya'}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Integritas Data Terverifikasi · Kompetisi Mahasiswa Muhammadiyah (KMM) 2026
        </div>
      </div>
    </div>
  );
}
