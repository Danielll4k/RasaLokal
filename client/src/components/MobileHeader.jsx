import React from 'react';
import { MapPin, Store, LogIn } from 'lucide-react';

export default function MobileHeader({ onOpenMerchantPortal, onOpenLogin, currentUser }) {
  const isCashier = currentUser?.role === 'cashier';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between md:hidden">
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-ocean to-brand-primary flex items-center justify-center text-white font-black text-base shadow-sm shrink-0">
          R
        </div>
        <div>
          <div className="flex items-center space-x-1 text-slate-900 font-heading font-black text-sm leading-tight">
            <span>Rasa<span className="text-brand-ocean">Lokal</span></span>
          </div>
          <div className="flex items-center space-x-1 text-slate-500 text-[10px] font-semibold">
            <MapPin className="w-3 h-3 text-brand-ocean" />
            <span>Yogyakarta</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenMerchantPortal}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          title="Portal Resto / Kasir"
        >
          <Store className="w-4 h-4 text-brand-ocean" />
        </button>

        {/* User Role Avatar & Quick Login */}
        <button
          onClick={onOpenLogin}
          className={`flex items-center space-x-1.5 py-1 px-2.5 rounded-full border text-xs font-bold transition-all shadow-sm ${
            isCashier
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-brand-ice text-brand-ocean border-brand-ocean/30'
          }`}
          title="Ganti Akun / Login"
        >
          <span>{currentUser?.avatar || 'AR'}</span>
          <span className="text-[10px] hidden sm:inline">({isCashier ? 'Kasir' : 'User'})</span>
        </button>
      </div>
    </header>
  );
}
