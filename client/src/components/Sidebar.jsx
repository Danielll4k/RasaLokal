import React from 'react';
import { Home, Compass, QrCode, Ticket, User, Store, LogIn, LogOut, ShieldCheck } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, currentUser, onOpenLogin }) {
  const isCashier = currentUser?.role === 'cashier';

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'scan', label: 'Scan Nota', icon: QrCode },
    { id: 'voucher', label: 'Voucher', icon: Ticket },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex w-20 md:w-64 bg-white border-r border-slate-200/80 flex-col items-center md:items-stretch py-6 shrink-0 min-h-screen justify-between">
      <div>
        {/* Brand Logo */}
        <div className="px-6 mb-8 flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-ocean to-brand-primary flex items-center justify-center text-white font-bold text-xl shadow-md shadow-brand-primary/20 shrink-0">
            R
          </div>
          <div className="hidden md:block">
            <span className="font-heading font-bold text-xl text-brand-text tracking-tight">Rasa<span className="text-brand-ocean">Lokal</span></span>
            <span className="block text-[11px] text-brand-muted font-medium">Verified Reviews</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-ice text-brand-ocean font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-ocean' : 'text-slate-400'}`} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Merchant Portal Shortcut */}
        <div className="px-3 pt-3 mt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('merchant')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'merchant'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Store className="w-4 h-4 text-brand-ocean" />
            <span className="hidden md:inline">Portal Kasir / Resto</span>
          </button>
        </div>
      </div>

      {/* User Login & Role Status Footer */}
      <div className="px-3 pt-4 border-t border-slate-100">
        <div 
          onClick={onOpenLogin}
          className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm ${
              isCashier ? 'bg-slate-900' : 'bg-brand-ocean'
            }`}>
              {currentUser?.avatar || 'AR'}
            </div>
            <div className="hidden md:block min-w-0 flex-1">
              <h5 className="font-heading font-bold text-xs text-slate-900 truncate">
                {currentUser?.name || 'Alya Rahman'}
              </h5>
              <span className={`text-[10px] font-semibold block truncate ${
                isCashier ? 'text-sky-700' : 'text-emerald-700'
              }`}>
                {currentUser?.badge || (isCashier ? 'Kasir Merchant' : 'Reviewer Terverifikasi')}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-brand-ocean font-semibold">
            <span>Ganti Akun / Login</span>
            <LogIn className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </aside>
  );
}
