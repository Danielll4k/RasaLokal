import React from 'react';
import { Star, ShieldCheck, Heart, MapPin, Sparkles } from 'lucide-react';

export default function RestaurantCard({ resto, onSelect }) {
  if (!resto) return null;

  return (
    <div 
      onClick={() => onSelect(resto)}
      className="group liquid-glass rounded-3xl p-4 shadow-sm hover:shadow-xl hover:border-brand-ocean/40 card-hover cursor-pointer flex flex-col justify-between relative overflow-hidden"
    >
      {/* Banner & Badges */}
      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-3.5 bg-slate-100">
        <img 
          src={resto.banner_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'} 
          alt={resto.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Favorite Button with Micro-Interaction */}
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-400 hover:text-red-500 hover:bg-white shadow-sm btn-interactive"
          title="Simpan Restoran"
        >
          <Heart className="w-4 h-4 transition-transform active:scale-125" />
        </button>

        {/* Open Badge with Animated Pulse Indicator */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold flex items-center space-x-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Buka · {resto.close_hour || '22:00'}</span>
          </span>
        </div>

        {/* Bottom tags with Liquid Glass pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 tracking-wide shadow-sm flex items-center space-x-1 border border-white/40">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{resto.category}</span>
          </span>
          {resto.is_verified && (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-600/90 backdrop-blur-md text-[10px] font-bold text-white flex items-center space-x-1 shadow-sm border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span>100% Terverifikasi</span>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-brand-ocean transition-colors line-clamp-1">
              {resto.name}
            </h3>
            <span className="text-xs font-bold text-slate-700 bg-slate-100/80 px-2 py-0.5 rounded-md shrink-0">
              {resto.price_level || '$$'}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1 line-clamp-1 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{resto.address}</span>
          </p>
        </div>

        {/* Rating and Distance Footer */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-slate-900">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{resto.average_rating}</span>
            <span className="text-slate-400 font-normal">({resto.total_reviews} ulasan)</span>
          </div>

          <span className="text-slate-500 font-medium bg-slate-100/60 px-2 py-0.5 rounded-md">
            {resto.distance || '0.8 km'}
          </span>
        </div>
      </div>
    </div>
  );
}
