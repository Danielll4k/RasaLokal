import React, { useState, useEffect } from 'react';
import { ChevronLeft, Share2, Heart, Star, MapPin, Clock, Camera, ShieldCheck, Lock, Edit3 } from 'lucide-react';
import StarRating from '../components/StarRating';

export default function RestaurantDetail({ resto, onBack, onStartReview }) {
  if (!resto) return null;

  const popularPhotos = [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
  ];

  return (
    <div className="flex-1 max-w-5xl mx-auto overflow-y-auto pb-24 relative">
      {/* Hero Banner & Actions */}
      <div className="relative h-72 md:h-96 w-full bg-slate-900">
        <img 
          src={resto.banner_url} 
          alt={resto.name}
          className="w-full h-full object-cover opacity-90"
        />
        
        {/* Top Buttons */}
        <div className="absolute top-6 inset-x-6 flex justify-between items-center z-10">
          <button 
            onClick={onBack}
            className="p-3 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:bg-white shadow-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex space-x-2">
            <button className="p-3 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:bg-white shadow-md transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:text-red-500 shadow-md transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 right-6 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center space-x-1.5">
          <Camera className="w-4 h-4" />
          <span>1 / 8</span>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="px-4 md:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold tracking-wide uppercase inline-block mb-2">
                BUKA SEKARANG
              </span>
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-slate-900">{resto.name}</h1>
              <p className="text-sm text-brand-muted mt-1">{resto.category} · {resto.price_range || '$$'}</p>
            </div>

            <div className="flex items-center md:flex-col md:items-end">
              <div className="text-3xl font-heading font-bold text-slate-900 flex items-center space-x-1">
                <span>{resto.average_rating}</span>
              </div>
              <StarRating rating={Math.round(resto.average_rating)} size="w-4 h-4" />
              <span className="text-xs text-brand-muted mt-1 font-medium">{resto.total_reviews} ulasan terverifikasi</span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
              <MapPin className="w-5 h-5 text-brand-ocean shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{resto.address}</p>
                <p className="text-[11px] text-brand-muted">{resto.distance || '0.8 km dari lokasimu'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
              <Clock className="w-5 h-5 text-brand-ocean shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800">Buka hingga {resto.close_hour || '22:00'}</p>
                <p className="text-[11px] text-brand-muted">Senin - Minggu · 10:00 - 22:00</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(resto.tags || ['Cozy', 'Halal', 'Family-friendly']).map((t, idx) => (
              <span key={idx} className="px-3 py-1 rounded-xl bg-brand-ice text-brand-ocean text-xs font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Foto Populer */}
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-base text-slate-800">Foto populer</h3>
            <span className="text-xs font-semibold text-brand-ocean cursor-pointer hover:underline">Lihat semua</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {popularPhotos.map((src, i) => (
              <img key={i} src={src} alt="Popular" className="w-full h-32 md:h-44 object-cover rounded-2xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar: Rate Resto CTA */}
      <div className="fixed bottom-0 inset-x-0 md:pl-64 z-30 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-between max-w-5xl mx-auto shadow-lg">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <Lock className="w-4 h-4 text-brand-ocean shrink-0" />
          <div>
            <span className="font-semibold block text-slate-800">Ulasan khusus pembeli</span>
            <span className="text-brand-muted text-[11px]">Siapkan nota fisik belanjamu</span>
          </div>
        </div>

        <button
          onClick={() => onStartReview(resto)}
          className="px-6 py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-ocean text-white font-heading font-semibold text-sm flex items-center space-x-2 shadow-lg shadow-brand-primary/25 transition-all"
        >
          <Edit3 className="w-4 h-4" />
          <span>Rate Resto</span>
        </button>
      </div>
    </div>
  );
}
