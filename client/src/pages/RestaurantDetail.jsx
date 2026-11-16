import React, { useState, useEffect } from 'react';
import { ChevronLeft, Share2, Heart, Star, MapPin, Clock, Camera, ShieldCheck, Lock, Edit3, Utensils, Award, CheckCircle2 } from 'lucide-react';
import StarRating from '../components/StarRating';
import { fetchRestaurantReviews } from '../services/api';

export default function RestaurantDetail({ resto, onBack, onStartReview }) {
  if (!resto) return null;

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchRestaurantReviews(resto.id).then(setReviews);
  }, [resto.id]);

  const popularPhotos = resto.gallery || [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
  ];

  const signatureDishes = resto.signature_dishes || [
    { name: 'Nasi Campur Sore Istimewa', price: 'Rp 48.000', desc: 'Ayam bakar rempah, sambal matah, urap sayur, dan kerupuk gendar' },
    { name: 'Iga Bakar Madu Mantrijeron', price: 'Rp 65.000', desc: 'Iga sapi empuk berbalut madu hutan dengan sambal terasi bakar' },
    { name: 'Es Kopi Susu Tirtodipuran', price: 'Rp 26.000', desc: 'Espresso robusta lokal dengan gula aren organik dan susu segar' }
  ];

  return (
    <div className="flex-1 max-w-5xl mx-auto overflow-y-auto pb-28 relative">
      {/* Hero Banner & Actions */}
      <div className="relative h-72 md:h-96 w-full bg-slate-900">
        <img 
          src={resto.banner_url} 
          alt={resto.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Top Buttons with Micro-interactions */}
        <div className="absolute top-6 inset-x-6 flex justify-between items-center z-10">
          <button 
            onClick={onBack}
            className="p-3 rounded-2xl bg-white/90 backdrop-blur-md text-slate-800 hover:bg-white shadow-md btn-interactive"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex space-x-2">
            <button className="p-3 rounded-2xl bg-white/90 backdrop-blur-md text-slate-800 hover:bg-white shadow-md btn-interactive">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-2xl bg-white/90 backdrop-blur-md text-slate-800 hover:text-red-500 shadow-md btn-interactive">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 right-6 px-3.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center space-x-2">
          <Camera className="w-4 h-4 text-sky-400" />
          <span>Galeri Foto ({popularPhotos.length})</span>
        </div>
      </div>

      {/* Main Info Card with Liquid Glass */}
      <div className="px-4 md:px-8 -mt-8 relative z-20">
        <div className="liquid-glass rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide uppercase inline-flex items-center space-x-1 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Buka Hari Ini ({resto.open_hour || '10:00'} - {resto.close_hour || '22:00'})</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold tracking-wide border border-sky-200">
                  Verified Merchant
                </span>
              </div>
              <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-900">{resto.name}</h1>
              <p className="text-sm text-slate-600 mt-1 font-medium">{resto.tagline || `${resto.category} · ${resto.price_range}`}</p>
            </div>

            <div className="flex items-center md:flex-col md:items-end bg-amber-50/70 p-4 rounded-2xl border border-amber-200/70 card-hover">
              <div className="text-3xl font-heading font-black text-amber-600 flex items-center space-x-1">
                <span>{resto.average_rating}</span>
                <span className="text-base text-amber-500">/ 5.0</span>
              </div>
              <StarRating rating={Math.round(resto.average_rating)} size="w-4 h-4" />
              <span className="text-xs text-slate-600 mt-1 font-semibold">{resto.total_reviews} Ulasan Pembeli Asli</span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-white/70 border border-slate-100 shadow-xs card-hover">
              <MapPin className="w-5 h-5 text-brand-ocean shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900">{resto.address}</p>
                <p className="text-[11px] text-slate-500">{resto.distance || '0.8 km dari pusat kota Yogyakarta'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-white/70 border border-slate-100 shadow-xs card-hover">
              <Clock className="w-5 h-5 text-brand-ocean shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900">Setiap Hari: {resto.open_hour || '10:00'} - {resto.close_hour || '22:00'}</p>
                <p className="text-[11px] text-slate-500">Menerima reservasi & makan di tempat</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {(resto.tags || ['Cozy Ambiance', 'Halal Certified', 'Family-Friendly', 'Free Wi-Fi']).map((t, idx) => (
              <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Menu Unggulan & Harga Asli with Liquid Glass */}
        <div className="mt-8 liquid-glass rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <Utensils className="w-5 h-5 text-amber-500" />
              <h3 className="font-heading font-bold text-lg text-slate-900">Menu Unggulan & Kisaran Harga</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">Harga per porsi</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {signatureDishes.map((dish, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/80 border border-slate-100 flex flex-col justify-between card-hover shadow-xs">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-heading font-bold text-sm text-slate-900">{dish.name}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dish.desc}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-brand-ocean">{dish.price}</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">Favorit</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Galeri Foto Suasana */}
        <div className="mt-8 liquid-glass rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-base text-slate-900">Galeri Suasana & Makanan</h3>
            <span className="text-xs font-semibold text-brand-ocean cursor-pointer hover:underline">Semua Foto</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {popularPhotos.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-2xl shadow-xs card-hover">
                <img key={i} src={src} alt="Gallery" loading="lazy" decoding="async" className="w-full h-32 md:h-44 object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Ulasan Terverifikasi Pembeli Asli */}
        <div className="mt-8 liquid-glass rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Ulasan Pembeli Terverifikasi</h3>
              <p className="text-xs text-slate-500 mt-0.5">Semua ulasan dijamin asli dan telah lolos verifikasi nomor nota.</p>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Anti Fake Review</span>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm">Belum ada ulasan yang ditampilkan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-white/80 border border-slate-100 card-hover shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                        {rev.author_name ? rev.author_name.slice(0, 2).toUpperCase() : 'US'}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-slate-800">{rev.author_name || 'Pelanggan Terverifikasi'}</h5>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 inline" />
                          <span>Terverifikasi via Nota #{rev.receipt_code || 'INV-VERIFIED'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mt-2">
                    "{rev.review_text}"
                  </p>

                  {rev.photos_url && rev.photos_url.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {rev.photos_url.map((p, idx) => (
                        <img key={idx} src={p} alt="Review attachment" loading="lazy" decoding="async" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Bar: Rate Resto CTA */}
      <div className="fixed bottom-0 inset-x-0 md:pl-64 z-30 p-4 liquid-glass border-t border-slate-200/80 flex items-center justify-between max-w-5xl mx-auto shadow-xl">
        <div className="flex items-center space-x-3 text-xs text-slate-600">
          <div className="p-2 rounded-xl bg-brand-ice text-brand-ocean">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold block text-slate-900 text-sm">Punya Nota Belanja di Resto Ini?</span>
            <span className="text-slate-500 text-[11px]">Beri ulasan jujur & raih voucher diskon 5% untuk kunjunganmu berikutnya.</span>
          </div>
        </div>

        <button
          onClick={() => onStartReview(resto)}
          className="px-6 py-3.5 rounded-2xl bg-brand-ocean hover:bg-sky-600 text-white font-heading font-bold text-sm flex items-center space-x-2 shadow-lg shadow-brand-ocean/30 btn-interactive"
        >
          <Edit3 className="w-4 h-4" />
          <span>Beri Ulasan Nota</span>
        </button>
      </div>
    </div>
  );
}
