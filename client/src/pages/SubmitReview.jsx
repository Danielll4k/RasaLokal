import React, { useState } from 'react';
import { Star, ShieldCheck, Camera, CheckCircle2, Ticket, ArrowRight, X } from 'lucide-react';
import StarRating from '../components/StarRating';
import { submitReview } from '../services/api';

export default function SubmitReview({ verifiedData, onSuccess, onCancel }) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState([
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600'
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [rewardModal, setRewardModal] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitReview({
        voucher_id: verifiedData.voucher_id,
        rating,
        review_text: reviewText,
        photos_url: photos
      });

      if (res.success) {
        setRewardModal(res.data.reward_voucher);
      }
    } catch (err) {
      alert('Gagal mengirim ulasan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 px-4 md:px-10 py-8 max-w-2xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-semibold text-brand-ocean tracking-wider uppercase flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>PEMBELIAN TERVERIFIKASI</span>
          </span>
          <h1 className="font-heading font-bold text-xl text-slate-900 mt-1">
            Ulasan: {verifiedData.restaurant?.name || 'Sore Dining'}
          </h1>
          <p className="text-xs text-brand-muted">Nota: {verifiedData.voucher_code}</p>
        </div>

        <button 
          onClick={onCancel}
          className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
        {/* Star Rating Section */}
        <div className="text-center py-4 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Beri Penilaian Pengalamanmu
          </label>
          <div className="flex justify-center">
            <StarRating rating={rating} onRate={setRating} interactive size="w-9 h-9" />
          </div>
          <span className="inline-block mt-2 font-heading font-bold text-sm text-brand-ocean">
            {rating === 5 ? 'Sangat Puas ⭐⭐⭐⭐⭐' : `${rating} dari 5 Bintang`}
          </span>
        </div>

        {/* Text Review */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Ceritakan Pengalaman Makanmu
          </label>
          <textarea
            rows="4"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Bagikan rasa makanan, suasana restoran, atau pelayanan ramah kasir..."
            className="w-full rounded-2xl border border-slate-200 p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary"
            required
          />
        </div>

        {/* Upload Foto Makanan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Foto Makanan atau Suasana
          </label>
          <div className="flex gap-3">
            {photos.map((p, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200">
                <img src={p} alt="Review upload" className="w-full h-full object-cover" />
              </div>
            ))}
            <button
              type="button"
              className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-brand-ocean hover:text-brand-ocean transition-colors"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-semibold">Tambah</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-ocean text-white font-heading font-semibold text-sm shadow-lg shadow-brand-primary/20 transition-all"
        >
          {submitting ? 'Mengirim Ulasan...' : 'Kirim Ulasan & Klaim Diskon 5%'}
        </button>
      </form>

      {/* Success & Reward Modal */}
      {rewardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center border border-slate-100 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-heading font-bold text-xl text-slate-900">Ulasan Terkirim!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Terima kasih! Ulasanmu kini berlabel <strong className="text-emerald-600">Pembelian Terverifikasi</strong>.
            </p>

            {/* Ticket Card */}
            <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-brand-ice to-white border border-brand-primary/30 text-left">
              <div className="flex items-center space-x-2 text-brand-ocean text-xs font-bold uppercase tracking-wider mb-1">
                <Ticket className="w-4 h-4" />
                <span>VOUCHER DISKON 5%</span>
              </div>
              <h4 className="font-heading font-bold text-base text-slate-800">{rewardModal.restaurant_name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">Syarat: Min. belanja Rp 100.000</p>
              <div className="mt-3 bg-white py-1.5 px-3 rounded-lg border border-slate-200 inline-block font-mono text-xs font-bold text-slate-800">
                {rewardModal.discount_code}
              </div>
            </div>

            <button
              onClick={() => onSuccess()}
              className="w-full py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-ocean text-white font-heading font-semibold text-sm shadow-md shadow-brand-primary/20"
            >
              Lihat di Voucher Saya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
