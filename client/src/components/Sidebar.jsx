import React from 'react';
import { Home, Compass, QrCode, Ticket, User, Store } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'scan', label: 'Scan Nota', icon: QrCode },
    { id: 'voucher', label: 'Voucher', icon: Ticket },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-20 md:w-64 bg-white border-r border-slate-100 flex flex-col items-center md:items-stretch py-6 shrink-0 min-h-screen">
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
      <nav className="flex-1 px-3 space-y-2">
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
                  : 'text-brand-muted hover:text-brand-text hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand-ocean' : 'text-brand-muted'}`} />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Merchant Portal Shortcut */}
      <div className="px-3 pt-4 border-t border-slate-100">
        <button
          onClick={() => setActiveTab('merchant')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
            activeTab === 'merchant'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4 text-brand-ocean" />
          <span className="hidden md:inline">Portal Kasir / Resto</span>
        </button>
      </div>
    </aside>
  );
}
