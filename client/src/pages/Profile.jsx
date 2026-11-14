import React, { useState, useEffect } from 'react';
import { ChevronRight, Store, FileText, Bookmark, Settings, HelpCircle, ShieldCheck } from 'lucide-react';
import { fetchUserProfile } from '../services/api';

export default function Profile({ onOpenMerchantPortal }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile().then(setProfile);
  }, []);

  const menuItems = [
    { label: 'Ulasan saya', icon: FileText },
    { label: 'Tempat tersimpan', icon: Bookmark },
    { label: 'Pengaturan akun', icon: Settings },
    { label: 'Bantuan', icon: HelpCircle },
  ];

  return (
    <div className="flex-1 px-4 md:px-10 py-8 max-w-2xl mx-auto overflow-y-auto">
      {/* Header */}
      <h1 className="font-heading font-bold text-xl text-slate-800 mb-6">Profil</h1>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-brand-ice border-4 border-brand-primary/20 text-brand-ocean font-heading font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
          AR
        </div>
        <h2 className="font-heading font-bold text-lg text-slate-900">{profile?.name || 'Alya Rahman'}</h2>
        <p className="text-xs text-brand-muted">{profile?.bio || 'Food explorer · Jakarta'}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-slate-100">
          <div>
            <span className="font-heading font-bold text-lg text-slate-900 block">
              {profile?.stats?.total_reviews || 12}
            </span>
            <span className="text-xs text-brand-muted">Ulasan</span>
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-slate-900 block">
              {profile?.stats?.total_photos || 8}
            </span>
            <span className="text-xs text-brand-muted">Foto</span>
          </div>
          <div>
            <span className="font-heading font-bold text-lg text-brand-ocean block">
              {profile?.stats?.total_vouchers || 3}
            </span>
            <span className="text-xs text-brand-muted">Voucher</span>
          </div>
        </div>
      </div>

      {/* Account Menu List */}
      <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm mb-6 divide-y divide-slate-100">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50/80 rounded-2xl transition-colors text-left"
            >
              <div className="flex items-center space-x-3 text-sm font-medium text-slate-700">
                <Icon className="w-4 h-4 text-brand-ocean" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          );
        })}
      </div>

      {/* Portal Restoran Banner (Proposal M-05 Shortcut) */}
      <div 
        onClick={onOpenMerchantPortal}
        className="bg-brand-ice/90 border border-brand-primary/30 rounded-3xl p-5 flex items-center justify-between cursor-pointer hover:bg-brand-ice transition-colors shadow-sm"
      >
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-white text-brand-ocean shadow-sm">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-800">Portal Restoran</h4>
            <p className="text-xs text-slate-500 mt-0.5">Isi dan terbitkan voucher pelanggan dari mesin kasir</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-brand-ocean" />
      </div>
    </div>
  );
}
