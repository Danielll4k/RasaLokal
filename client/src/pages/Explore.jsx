import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react';
import { fetchRestaurants } from '../services/api';
import RestaurantSkeleton from '../components/RestaurantSkeleton';

export default function Explore({ onSelectResto, onBack }) {
  const [query, setQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRestaurants(query).then((data) => {
      setRestaurants(data);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="flex-1 px-4 md:px-10 py-4 md:py-8 max-w-4xl mx-auto overflow-y-auto pb-28 md:pb-12">
      {/* Top Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2.5 rounded-2xl liquid-glass text-slate-700 hover:bg-slate-100 transition-colors btn-interactive shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-heading font-black text-2xl text-slate-900">Jelajahi Kuliner Jogja</h1>
          <p className="text-xs text-slate-500">Temukan restoran terverifikasi berdasarkan nama atau menu</p>
        </div>
      </div>

      {/* Search Input with Liquid Glass */}
      <div className="liquid-glass rounded-2xl px-4 py-3.5 flex items-center space-x-3 shadow-sm mb-6 focus-within:ring-2 focus-within:ring-sky-200 transition-all">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari tempat, menu (contoh: Iga Bakar, Kopi Gayo, dll)..."
          className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
        />
      </div>

      {/* Results List */}
      <div className="liquid-glass rounded-3xl p-5 md:p-6 shadow-sm">
        <h2 className="font-heading font-bold text-base text-slate-900 mb-4">
          Rekomendasi Resto Terverifikasi ({restaurants.length})
        </h2>

        {loading ? (
          <div className="space-y-4">
            <div className="h-20 rounded-2xl animate-shimmer" />
            <div className="h-20 rounded-2xl animate-shimmer" />
            <div className="h-20 rounded-2xl animate-shimmer" />
          </div>
        ) : (
          <div className="divide-y divide-slate-100/80">
            {restaurants.map((resto) => (
              <div
                key={resto.id}
                onClick={() => onSelectResto(resto)}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group cursor-pointer hover:bg-sky-50/40 rounded-2xl px-3 transition-all card-hover"
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={resto.banner_url} 
                    alt={resto.name} 
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-sm text-slate-900 group-hover:text-brand-ocean transition-colors">
                      {resto.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{resto.category} · {resto.price_level || '$$'}</p>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                      <div className="flex items-center space-x-1 font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{resto.average_rating}</span>
                      </div>
                      <span>·</span>
                      <span className="flex items-center space-x-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{resto.distance}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-brand-ocean group-hover:text-white text-slate-400 transition-colors shadow-xs">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
