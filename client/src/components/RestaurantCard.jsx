import React from 'react';
import { Star, ShieldCheck, Heart } from 'lucide-react';

export default function RestaurantCard({ resto, onSelect }) {
  return (
    <div 
      onClick={() => onSelect(resto)}
      className="group bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3 bg-slate-100">
        <img 
          src={resto.banner_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'} 
          alt={resto.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-400 hover:text-red-500 transition-colors"
        >
          <Heart className="w-4 h-4" />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-bold text-brand-ocean tracking-wide uppercase">
            TOP PICK
          </span>
          {resto.is_verified && (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 backdrop-blur-md text-[10px] font-semibold text-white flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 inline" />
              <span>Verified buyers only</span>
            </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-semibold text-base text-brand-text group-hover:text-brand-ocean transition-colors">
          {resto.name}
        </h3>
        <p className="text-xs text-brand-muted mt-0.5">
          {resto.category} · {resto.price_range || '$$'}
        </p>

        <div className="flex items-center space-x-3 mt-3 text-xs text-slate-500">
          <div className="flex items-center space-x-1 font-semibold text-slate-800">
            <Star className="w-4 h-4 fill-brand-star text-brand-star" />
            <span>{resto.average_rating}</span>
            <span className="text-brand-muted font-normal">({resto.total_reviews})</span>
          </div>
          <span>·</span>
          <span>{resto.distance || '0.8 km'}</span>
        </div>
      </div>
    </div>
  );
}
