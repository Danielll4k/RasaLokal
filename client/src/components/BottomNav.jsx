import React from 'react';
import { Home, Compass, QrCode, Ticket, User } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, isSimulated = false }) {
  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'explore', label: 'Jelajah', icon: Compass },
    { id: 'scan', label: 'Scan Nota', icon: QrCode, isCenter: true },
    { id: 'voucher', label: 'Voucher', icon: Ticket },
    { id: 'profile', label: 'Akun', icon: User },
  ];

  return (
    <nav className={`${
      isSimulated 
        ? 'sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 z-40 px-3 py-1.5 shadow-[0_-8px_30px_rgba(15,23,42,0.12)]' 
        : 'fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 z-40 px-3 py-1.5 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] md:hidden'
    }`}>
      <div className="flex items-center justify-around max-w-lg mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative -top-5 flex flex-col items-center group focus:outline-none"
              >
                <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-slate-900/30'
                    : 'bg-brand-ocean text-white shadow-brand-ocean/35'
                } p-3.5`}>
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className={`text-[10px] font-bold mt-1 tracking-tight ${
                  isActive ? 'text-brand-ocean' : 'text-slate-600'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center py-1 px-2.5 rounded-xl transition-all"
            >
              <Icon className={`w-5 h-5 transition-colors ${
                isActive ? 'text-brand-ocean stroke-[2.5]' : 'text-slate-400 group-hover:text-slate-600'
              }`} />
              <span className={`text-[10px] font-medium mt-1 ${
                isActive ? 'text-brand-ocean font-bold' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
