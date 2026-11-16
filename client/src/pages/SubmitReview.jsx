import React, { useState } from 'react';
import { Star, ShieldCheck, Camera, CheckCircle2, Ticket, ArrowRight, X, Sparkles, MessageSquare } from 'lucide-react';
import StarRating from '../components/StarRating';
import { submitReview } from '../services/api';

export default function SubmitReview({ verifiedData, onSuccess, onCancel, currentUser }) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('Rasa iga bakarnya sangat meresap dan dagingnya empuk sekali. Suasana di Tirtodipuran tenang dan pelayanannya sigap. Nota fisiknya rapi dan proses verifikasi ulasannya praktis!');
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
    <div className="flex-1 px-4 md:px-8 py-4 md:py-6 max-w-2xl mx-auto overflow-y-auto pb-28 md:pb-12">
      {/* Header - Clean Spacing for Mobile & Desktop */}
      <div className="flex items-start justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="min-w-0 pr-3">
          <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase inline-flex items-center space-x-1.5 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Nota Pembeli Berhasil Terverifikasi</span>
          </span>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 mt-1 truncate">
            Tulis Ulasan: {verifiedData.restaurant?.name || 'Sore Dining'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kode Transaksi: <span className="font-mono font-bold text-slate-800">{verifiedData.voucher_code}</span>
          </p>
        </div>

        <button 
          onClick={onCancel}
          className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 btn-interactive shrink-0"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="liquid-glass rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
        {/* Star Rating Section */}
        <div className="text-center py-4 bg-slate-50/80 rounded-2xl border border-slate-100">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Rating Keseluruhan Pengalaman
          </label>
          <div className="flex justify-center transition-transform active:scale-95 duration-150">
            <StarRating rating={rating} onRate={setRating} interactive size="w-9 h-9 sm:w-10 sm:h-10" />
          </div>
          <span className="inline-block mt-2 font-heading font-bold text-sm text-slate-800">
            {rating === 5 ? '⭐⭐⭐⭐⭐ Luar Biasa (5.0)' : `${rating}.0 dari 5.0 Bintang`}
          </span>
        </div>

        {/* Text Review */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center space-x-1.5">
            <MessageSquare className="w-4 h-4 text-brand-ocean" />
            <span>Ceritakan Pengalaman Kuliner Anda</span>
          </label>
          <textarea
            rows="3"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Bagikan rasa masakan, porsi hidangan, suasana tempat, atau keramahan pelayanan staf..."
            className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-ocean leading-relaxed"
            required
          />
        </div>

        {/* Upload Foto Makanan */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Bukti Foto Hidangan (Opsional)
          </label>
          <div className="flex gap-2.5">
            {photos.map((p, idx) => (
              <div key={idx} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm card-hover">
                <img src={p} alt="Review upload" className="w-full h-full object-cover" />
              </div>
            ))}
            <button
              type="button"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-brand-ocean hover:text-brand-ocean btn-interactive"
            >
              <Camera className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">Tambah</span>
            </button>
          </div>
        </div>

        {/* Submit Button with Ripple/Interactive Animation */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 sm:py-4 rounded-2xl bg-brand-ocean hover:bg-sky-600 text-white font-heading font-bold text-sm shadow-lg shadow-sky-500/25 btn-interactive flex items-center justify-center space-x-2"
        >
          <span>{submitting ? 'Menyimpan Ulasan ke Basis Data...' : 'Kirim Ulasan & Dapatkan Kupon Diskon 5%'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Success & Reward Modal */}
      {rewardModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center border border-slate-100 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-heading font-black text-xl text-slate-900">Ulasan Lolos Verifikasi!</h3>
            <p className="text-xs text-slate-600 mt-1">
              Rating Anda telah dicatat ke database dan memperbarui skor resto secara realtime.
            </p>

            {/* Perforated Reward Ticket */}
            <div className="my-6 p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-amber-50 border border-sky-200 text-left relative overflow-hidden">
              <div className="flex items-center space-x-1.5 text-brand-ocean text-xs font-bold uppercase tracking-wider mb-1">
                <Ticket className="w-4 h-4 text-brand-ocean" />
                <span>REWARD VOUCHER DISKON 5%</span>
              </div>
              <h4 className="font-heading font-bold text-base text-slate-900">{rewardModal.restaurant_name}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Berlaku selama 30 hari untuk makan di tempat</p>
              
              <div className="mt-3 bg-white py-1.5 px-3 rounded-lg border border-dashed border-sky-300 inline-block font-mono text-xs font-bold text-slate-900">
                {rewardModal.discount_code}
              </div>
            </div>

            <button
              onClick={() => onSuccess()}
              className="w-full py-3.5 rounded-2xl bg-brand-ocean hover:bg-sky-600 text-white font-heading font-bold text-sm shadow-md shadow-brand-ocean/20 btn-interactive"
            >
              Simpan ke Dompet Voucher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
