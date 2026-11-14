import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Award, Coffee, Utensils, Tag, PlusCircle, ArrowRight, Star } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { fetchRestaurants } from '../services/api';

export default function Home({ onSelectResto, onNavigate }) {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { label: 'Top Rated', icon: Award, cat: 'Indonesian Modern' },
    { label: 'Near Me', icon: MapPin, cat: 'All' },
    { label: 'Cafes', icon: Coffee, cat: 'Cafe & Pastries' },
    { label: 'Fast Food', icon: Utensils, cat: 'Fast Food' },
    { label: 'Promo Resto', icon: Tag, cat: 'Asian Grill' },
    { label: 'Add Resto', icon: PlusCircle, cat: 'All' }
  ];

  useEffect(() => {
    fetchRestaurants(search, activeCategory).then(setRestaurants);
  }, [search, activeCategory]);

  return (
    <div className="flex-1 px-4 md:px-10 py-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Bar: Location & Avatar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted block">LOKASI SAAT INI</span>
          <div className="flex items-center space-x-1.5 text-slate-800 font-heading font-semibold text-sm cursor-pointer hover:text-brand-ocean transition-colors">
            <MapPin className="w-4 h-4 text-brand-ocean" />
            <span>Kemang, Jakarta</span>
            <span className="text-xs text-brand-muted font-normal">▾</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('profile')}
          className="w-10 h-10 rounded-full bg-brand-ice border-2 border-brand-primary/30 flex items-center justify-center font-bold text-xs text-brand-ocean cursor-pointer shadow-sm hover:scale-105 transition-transform"
        >
          AR
        </div>
      </div>

      {/* Search Bar & Filter Button */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl px-4 py-3.5 flex items-center space-x-3 shadow-sm focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-ice transition-all">
          <Search className="w-5 h-5 text-brand-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari restoran atau makanan..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <button 
          onClick={() => onNavigate('explore')}
          className="p-3.5 rounded-2xl bg-brand-primary hover:bg-brand-ocean text-white shadow-md shadow-brand-primary/20 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none mb-8">
        {categories.map((c, i) => {
          const Icon = c.icon;
          const isSelected = activeCategory === c.cat && c.label !== 'Near Me' && c.label !== 'Add Resto';
          return (
            <button
              key={i}
              onClick={() => {
                if (c.label === 'Add Resto') {
                  onNavigate('merchant');
                } else {
                  setActiveCategory(c.cat === activeCategory ? 'All' : c.cat);
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-brand-ice border-brand-primary text-brand-ocean shadow-sm'
                  : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4 text-brand-ocean" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Banner Reward Diskon 5% & Sedang Populer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Banner 5% */}
        <div className="lg:col-span-2 relative rounded-3xl bg-gradient-to-r from-brand-primary to-brand-ocean p-8 text-white overflow-hidden shadow-lg shadow-brand-primary/15 flex flex-col justify-between">
          <div className="relative z-10 max-w-sm">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase inline-block mb-3">
              REWARD SPESIAL
            </span>
            <h2 className="font-heading font-bold text-2xl md:text-3xl leading-snug">
              Review & nikmati diskon 5%
            </h2>
            <p className="text-xs text-white/90 mt-2 font-normal">
              Beri rating jujur dari nota belanjamu, dapatkan voucher diskon untuk kunjungan berikutnya.
            </p>
          </div>

          <div className="relative z-10 mt-6">
            <button 
              onClick={() => onNavigate('scan')}
              className="px-5 py-2.5 rounded-xl bg-white text-brand-ocean font-heading font-semibold text-xs inline-flex items-center space-x-2 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <span>Mulai review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Decorative Badge 5% OFF */}
          <div className="absolute -right-4 -bottom-4 md:right-8 md:bottom-8 w-28 h-28 rounded-full border-4 border-dashed border-white/30 flex flex-col items-center justify-center text-center rotate-12 bg-white/10 backdrop-blur-sm">
            <span className="text-2xl font-heading font-bold">5%</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">OFF</span>
          </div>
        </div>

        {/* Sedang Populer Preview Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-sm text-slate-800">Sedang populer</h3>
            <button onClick={() => onNavigate('explore')} className="text-xs font-semibold text-brand-ocean hover:underline">
              Lihat semua
            </button>
          </div>

          {restaurants[2] && (
            <div 
              onClick={() => onSelectResto(restaurants[2])}
              className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50/70 hover:bg-brand-ice/50 transition-colors cursor-pointer border border-slate-100"
            >
              <img 
                src={restaurants[2].banner_url} 
                alt={restaurants[2].name} 
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-semibold text-sm text-slate-800 truncate">{restaurants[2].name}</h4>
                <p className="text-xs text-brand-muted truncate">{restaurants[2].category}</p>
                <div className="flex items-center space-x-1.5 mt-1 text-xs">
                  <Star className="w-3.5 h-3.5 fill-brand-star text-brand-star" />
                  <span className="font-bold text-slate-700">{restaurants[2].average_rating}</span>
                  <span className="text-slate-400">({restaurants[2].total_reviews})</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">{restaurants[2].distance}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rekomendasi Untukmu Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-800">Rekomendasi untukmu</h2>
            <p className="text-xs text-brand-muted">Pilihan terbaik dan terverifikasi di sekitar Kemang</p>
          </div>
          <button onClick={() => onNavigate('explore')} className="text-xs font-semibold text-brand-ocean hover:underline">
            Lihat semua
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((resto) => (
            <RestaurantCard key={resto.id} resto={resto} onSelect={onSelectResto} />
          ))}
        </div>
      </div>
    </div>
  );
}
