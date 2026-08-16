/* ============================================================
   GSDS v1.2 — Educational Image Card Component
   Green Store Enterprise v2 — Real Produce Intelligence
   ============================================================
   Renders educational/illustrative produce visuals safely.
   Features:
   - Lazy loading with smooth skeleton animation
   - Graceful fallback on network/image load failure
   - Zero external branding, zero exposed URLs, zero external links
   ============================================================ */

import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { placeholderImage } from '@/assets/images/products/productImages';

interface EducationalImageCardProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  caption?: string;
}

export function EducationalImageCard({
  src,
  alt,
  className = '',
  aspectRatio = 'video',
  caption,
}: EducationalImageCardProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : 'aspect-auto';

  const imageSrc = !src || hasError ? placeholderImage : src;

  return (
    <div className={`group relative overflow-hidden rounded-xl bg-emerald-950/20 border border-emerald-500/20 ${aspectClass} ${className}`}>
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-emerald-950/40 via-emerald-800/20 to-emerald-950/40 flex items-center justify-center">
          <Leaf className="h-8 w-8 text-emerald-500/40 animate-spin" />
        </div>
      )}

      {/* Primary Image Element */}
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Overlay gradient for aesthetics */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Optional Caption */}
      {caption && (
        <div className="absolute bottom-3 right-3 left-3 flex items-center gap-1.5 text-xs text-emerald-100 font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
          <Leaf className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{caption}</span>
        </div>
      )}
    </div>
  );
}
