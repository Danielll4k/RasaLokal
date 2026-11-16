import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Award, Coffee, Utensils, Tag, PlusCircle, ArrowRight, Star, ShieldCheck, Flame, Compass, Sparkles } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import RestaurantSkeleton from '../components/RestaurantSkeleton';
import { fetchRestaurants } from '../services/api';

export default function Home({ onSelectResto, onNavigate, currentUser, onOpenLogin }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('Semua Wilayah');

  const districts = ['Semua Wilayah', 'Mantrijeron', 'Kotabaru', 'Kaliurang', 'Prawirotaman'];

  const categories = [
    { label: 'Semua Kategori', icon: Award, cat: 'All' },
    { label: 'Indonesian Modern', icon: Utensils, cat: 'Indonesian Modern' },
    { label: 'Kopi & Roastery', icon: Coffee, cat: 'Cafe & Pastries' },
    { label: 'Asian Grill', icon: Flame, cat: 'Asian Grill' },
    { label: 'Eksplor Peta', icon: Compass, cat: 'explore' },
  ];

  useEffect(() => {
    setLoading(true);
    fetchRestaurants(search, activeCategory).then((data) => {
      if (selectedDistrict !== 'Semua Wilayah') {
        setRestaurants(data.filter(r => r.address && r.address.toLowerCase().includes(selectedDistrict.toLowerCase())));
      } else {
        setRestaurants(data);
      }
      setLoading(false);
    });
  }, [search, activeCategory, selectedDistrict]);

  return (
    <div className="flex-1 px-4 md:px-10 py-4 md:py-8 max-w-7xl mx-auto overflow-y-auto pb-28 md:pb-12">
      {/* Top Bar: Location & Header Identity (Desktop only) */}
      <div className="hidden md:flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">KOTA PILOT · KMM 2026</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-900 font-heading font-bold text-lg mt-0.5">
            <MapPin className="w-5 h-5 text-brand-ocean" />
            <span>Daerah Istimewa Yogyakarta</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div 
            onClick={onOpenLogin}
            className="text-right hidden sm:block cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-xs font-bold text-slate-800 block">{currentUser?.name || 'Alya Rahman'}</span>
            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full inline-block ${
              currentUser?.role === 'cashier' ? 'bg-sky-50 text-sky-700' : 'bg-emerald-50 text-emerald-700'
            }`}>
              {currentUser?.badge || 'Reviewer Terverifikasi'}
            </span>
          </div>
          <div 
            onClick={onOpenLogin || (() => onNavigate('profile'))}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-ocean to-brand-primary border-2 border-white flex items-center justify-center font-bold text-sm text-white cursor-pointer shadow-md btn-interactive"
            title="Ganti Akun / Login"
          >
            {currentUser?.avatar || 'AR'}
          </div>
        </div>
      </div>

      {/* District quick filter buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none mb-6">
        <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1">Wilayah:</span>
        {districts.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDistrict(d)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 btn-interactive ${
              selectedDistrict === d
                ? 'bg-slate-900 text-white shadow-md'
                : 'liquid-glass text-slate-700 hover:border-brand-ocean/40'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Search Bar & Filter Button with Liquid Glass */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex-1 liquid-glass rounded-2xl px-4 py-3.5 flex items-center space-x-3 shadow-sm focus-within:ring-2 focus-within:ring-sky-200 transition-all">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari resto (contoh: Sore Dining, Kopi Kalyan, Iga Bakar, dsb)..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
          />
        </div>
        <button 
          onClick={() => onNavigate('explore')}
          className="p-3.5 rounded-2xl bg-brand-ocean hover:bg-sky-600 text-white shadow-md shadow-brand-ocean/20 btn-interactive"
          title="Filter & Jelajah Peta"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Category Chips with Liquid Glass */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none mb-8">
        {categories.map((c, i) => {
          const Icon = c.icon;
          const isSelected = activeCategory === c.cat;
          return (
            <button
              key={i}
              onClick={() => {
                if (c.cat === 'explore') {
                  onNavigate('explore');
                } else {
                  setActiveCategory(c.cat === activeCategory ? 'All' : c.cat);
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all btn-interactive ${
                isSelected
                  ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/25'
                  : 'liquid-glass text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-brand-ocean'}`} />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Perforated Coupon Banner & Sedang Populer Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Banner Voucher Pembeli Terverifikasi */}
        <div className="lg:col-span-2 relative rounded-3xl bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#0c4a6e] p-7 md:p-8 text-white overflow-hidden shadow-xl flex flex-col justify-between card-hover">
          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase mb-3 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Ulasan Pembeli Terverifikasi</span>
            </div>
            <h2 className="font-heading font-black text-2xl md:text-3xl leading-snug">
              Verifikasi Nota Belanja, Dapatkan Diskon 5%
            </h2>
            <p className="text-xs text-sky-100 mt-2 font-normal leading-relaxed">
              Di RasaLokal, setiap ulasan dijamin 100% dari pembeli asli via kode unik nota transaksi. Tulis pengalaman jujurmu dan nikmati voucher potongan 5% di kunjungan berikutnya.
            </p>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
            <button 
              onClick={() => onNavigate('scan')}
              className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-heading font-bold text-xs inline-flex items-center space-x-2 shadow-lg hover:bg-slate-50 btn-interactive"
            >
              <span>Scan Nota Sekarang</span>
              <ArrowRight className="w-4 h-4 text-brand-ocean" />
            </button>

            <button 
              onClick={() => onNavigate('voucher')}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-heading font-semibold text-xs border border-white/20 btn-interactive"
            >
              Lihat Dompet Voucher
            </button>
          </div>

          {/* Authentic Perforated Coupon Watermark */}
          <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-3xl border-4 border-dashed border-white/20 flex flex-col items-center justify-center text-center rotate-12 bg-white/5 backdrop-blur-sm pointer-events-none">
            <span className="text-3xl font-heading font-black text-white/90">5%</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-sky-200">VOUCHER</span>
          </div>
        </div>

        {/* Highlight Resto Mantrijeron */}
        <div className="liquid-glass rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <h3 className="font-heading font-bold text-sm text-slate-900">Spotlight Jogja</h3>
              </div>
              <button onClick={() => onNavigate('explore')} className="text-xs font-semibold text-brand-ocean hover:underline">
                Lihat Semua
              </button>
            </div>

            {restaurants[0] && (
              <div 
                onClick={() => onSelectResto(restaurants[0])}
                className="group p-3.5 rounded-2xl bg-slate-50/80 hover:bg-sky-50/50 transition-all cursor-pointer border border-slate-100 card-hover"
              >
                <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3">
                  <img 
                    src={restaurants[0].banner_url} 
                    alt={restaurants[0].name} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">
                    ⭐ {restaurants[0].average_rating}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-sm text-slate-900 truncate group-hover:text-brand-ocean transition-colors">
                  {restaurants[0].name}
                </h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">{restaurants[0].tagline || restaurants[0].address}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60 text-xs">
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                    ✓ 100% Terverifikasi
                  </span>
                  <span className="font-semibold text-brand-ocean group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Buka Profil &rarr;
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Pilot Project KMM 2026</span>
            <span className="font-semibold text-slate-700">Tim RacikCode UMY</span>
          </div>
        </div>
      </div>

      {/* Rekomendasi Untukmu Section with Skeleton Loading Support */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900">Restoran Terverifikasi di Yogyakarta</h2>
            <p className="text-xs text-slate-500 mt-0.5">Semua ulasan dijamin valid berasal dari nota pembayaran fisik kasir.</p>
          </div>
          <button onClick={() => onNavigate('explore')} className="text-xs font-semibold text-brand-ocean hover:underline">
            Semua ({restaurants.length}) &rarr;
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RestaurantSkeleton />
            <RestaurantSkeleton />
            <RestaurantSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((resto) => (
              <RestaurantCard key={resto.id} resto={resto} onSelect={onSelectResto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
