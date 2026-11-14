import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { fetchRestaurants } from '../services/api';

export default function Explore({ onSelectResto, onBack }) {
  const [query, setQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants(query).then(setRestaurants);
  }, [query]);

  return (
    <div className="flex-1 px-4 md:px-10 py-8 max-w-4xl mx-auto overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-heading font-bold text-xl text-slate-800">Jelajahi</h1>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-slate-200/90 rounded-2xl px-4 py-3.5 flex items-center space-x-3 shadow-sm mb-8 focus-within:border-brand-primary">
        <Search className="w-5 h-5 text-brand-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari tempat, menu, atau area..."
          className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Populer di Dekatmu List */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <h2 className="font-heading font-semibold text-base text-slate-800 mb-4">Populer di dekatmu</h2>

        <div className="divide-y divide-slate-100">
          {restaurants.map((resto) => (
            <div
              key={resto.id}
              onClick={() => onSelectResto(resto)}
              className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 rounded-2xl px-2 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <img 
                  src={resto.banner_url} 
                  alt={resto.name} 
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div>
                  <h3 className="font-heading font-semibold text-sm text-slate-800 group-hover:text-brand-ocean transition-colors">
                    {resto.name}
                  </h3>
                  <p className="text-xs text-brand-muted">{resto.category}</p>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                    <div className="flex items-center space-x-1 font-semibold text-slate-700">
                      <Star className="w-3.5 h-3.5 fill-brand-star text-brand-star" />
                      <span>{resto.average_rating}</span>
                    </div>
                    <span>·</span>
                    <span>{resto.distance}</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-ocean group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
