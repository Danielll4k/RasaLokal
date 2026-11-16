import React from 'react';

export default function RestaurantSkeleton() {
  return (
    <div className="liquid-glass rounded-3xl p-4 shadow-sm flex flex-col justify-between">
      {/* Banner Skeleton */}
      <div className="w-full h-48 rounded-2xl animate-shimmer mb-3.5" />

      {/* Content Skeleton */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <div className="h-4 w-3/5 rounded-lg animate-shimmer" />
          <div className="h-4 w-8 rounded-md animate-shimmer" />
        </div>
        <div className="h-3 w-4/5 rounded-md animate-shimmer" />
      </div>

      {/* Footer Skeleton */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 w-24 rounded-md animate-shimmer" />
        <div className="h-4 w-12 rounded-md animate-shimmer" />
      </div>
    </div>
  );
}
