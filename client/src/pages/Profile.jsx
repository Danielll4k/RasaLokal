import React, { useState, useEffect } from 'react';
import { ChevronRight, Store, FileText, Bookmark, Settings, HelpCircle, ShieldCheck, LogIn, LogOut } from 'lucide-react';
import { fetchUserProfile } from '../services/api';

export default function Profile({ onOpenMerchantPortal, currentUser, onOpenLogin }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile().then(setProfile);
  }, [currentUser]);

  const menuItems = [
    { label: 'Ulasan saya', icon: FileText },
    { label: 'Tempat tersimpan', icon: Bookmark },
    { label: 'Pengaturan akun', icon: Settings },
    { label: 'Bantuan & FAQ', icon: HelpCircle },
  ];

  const activeUser = currentUser || profile || {
    name: 'Alya Rahman',
    bio: 'Food explorer · Yogyakarta',
    role: 'customer',
    avatar: 'AR'
  };

  const isCashier = activeUser.role === 'cashier';

  return (
    <div className="flex-1 px-4 md:px-10 py-4 md:py-8 max-w-2xl mx-auto overflow-y-auto pb-28 md:pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-black text-2xl text-slate-900">Profil Akun</h1>
        <button
          onClick={onOpenLogin}
          className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm hover:scale-105 transition-all"
        >
          <LogIn className="w-3.5 h-3.5 text-sky-400" />
          <span>Ganti Akun</span>
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm text-center mb-6">
        <div className={`w-20 h-20 rounded-3xl border-4 text-white font-heading font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-md ${
          isCashier ? 'bg-slate-900 border-slate-700' : 'bg-brand-ocean border-sky-200'
        }`}>
          {activeUser.avatar || (isCashier ? 'SD' : 'AR')}
        </div>
        <h2 className="font-heading font-bold text-lg text-slate-900">{activeUser.name}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{activeUser.email}</p>
        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
          isCashier ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          {activeUser.badge || (isCashier ? 'Kasir Resmi Merchant Partner' : 'Reviewer Terverifikasi')}
        </span>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-100">
          <div>
            <span className="font-heading font-black text-xl text-slate-900 block">
              {profile?.stats?.total_reviews || 12}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Ulasan</span>
          </div>
          <div>
            <span className="font-heading font-black text-xl text-slate-900 block">
              {profile?.stats?.total_photos || 8}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Foto</span>
          </div>
          <div>
            <span className="font-heading font-black text-xl text-brand-ocean block">
              {profile?.stats?.total_vouchers || 3}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Voucher 5%</span>
          </div>
        </div>
      </div>

      {/* Account Menu List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-2 shadow-sm mb-6 divide-y divide-slate-100">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50/80 rounded-2xl transition-colors text-left"
            >
              <div className="flex items-center space-x-3 text-sm font-semibold text-slate-700">
                <Icon className="w-4 h-4 text-brand-ocean" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          );
        })}
      </div>

      {/* Portal Restoran Banner */}
      <div 
        onClick={onOpenMerchantPortal}
        className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all border border-slate-800"
      >
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-white/10 text-sky-400 shadow-sm">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-white">Portal Kasir & Merchant</h4>
            <p className="text-xs text-slate-300 mt-0.5">Cetak nota transaksi berkode barcode acak (expired 24h)</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-sky-400" />
      </div>
    </div>
  );
}
