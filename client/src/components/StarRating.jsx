import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, onRate, interactive = false, size = 'w-5 h-5' }) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate && onRate(star)}
          className={`focus:outline-none transition-transform ${
            interactive ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-default'
          }`}
        >
          <Star
            className={`${size} ${
              star <= rating
                ? 'fill-brand-star text-brand-star'
                : 'text-slate-200 fill-slate-50'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
