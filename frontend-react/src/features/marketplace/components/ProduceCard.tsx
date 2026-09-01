import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Check, Loader2 } from 'lucide-react';
import type { ProductDTO } from '@/features/products/domain/productDTO';
import { placeholderImage } from '@/assets/images/products/productImages';
import { formatPrice } from '@/lib/formatters';
import { formatUnitLabel } from '@/lib/unitLabels';
import { isOrganic, isYemeni } from '@/features/marketplace/utils/productTags';
import { calculateEffectivePrice } from '@/features/products/services/offerService';

export interface ProduceCardProps {
  product: ProductDTO;
  isFavorite: boolean;
  isAdding: boolean;
  isAdded?: boolean;
  onQuickAdd: () => void;
  onToggleFavorite: () => void;
  badgeText?: string;
  locale: string;
}

export function ProduceCard({
  product,
  isFavorite,
  isAdding,
  isAdded,
  onQuickAdd,
  onToggleFavorite,
  badgeText,
  locale,
}: ProduceCardProps) {
  const navigate = useNavigate();
  const priceInfo = calculateEffectivePrice(product);
  const defaultBadge = isYemeni(product) ? 'محلي' : isOrganic(product) ? 'عضوي' : 'متوفر';
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group gsd-card rounded-2xl p-3 border border-[var(--gs-border-subtle)] hover:border-emerald-500 transition duration-200 flex flex-col justify-between relative bg-[var(--gs-surface)] shadow-xs hover:shadow-md">
      {/* Top Badges & Favorite Heart */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            priceInfo.hasActiveOffer
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          }`}
        >
          {priceInfo.hasActiveOffer
            ? `${priceInfo.offerTitle || 'عرض'} (-${priceInfo.discountPercentage}%)`
              : badgeText || (isYemeni(product) ? 'محلي' : isOrganic(product) ? 'عضوي' : defaultBadge)}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="p-1.5 rounded-full text-[var(--gs-foreground-muted)] hover:text-rose-500 transition focus:outline-none focus:ring-2 focus:ring-rose-400"
          aria-label={isFavorite ? `إزالة ${product.name} من المفضلة` : `إضافة ${product.name} إلى المفضلة`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <div
        onClick={() => navigate(`/products/${product.id}`)}
        className="cursor-pointer overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900/40 mb-2 relative aspect-square"
      >
        <img
          src={product.image || placeholderImage}
          alt={product.name}
          width={480}
          height={480}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = placeholderImage;
          }}
          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-2 text-center text-[11px] font-bold text-white">
            نفد المخزون
          </div>
        )}
      </div>

      {/* Title & Category */}
      <div className="space-y-1 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
        <div className="text-xs font-extrabold text-[var(--gs-foreground)] line-clamp-2 min-h-[32px]">
          {product.name}
        </div>
        <div className="flex items-center justify-between gap-2 text-[11px] text-[var(--gs-foreground-secondary)]">
          <span>{formatUnitLabel(product.unit)}</span>
          <span className="truncate">{product.category.name}</span>
        </div>
      </div>

      {/* Price & Add to Cart Button */}
      <div className="pt-2 mt-2 border-t border-[var(--gs-border-subtle)] flex items-center justify-between gap-1">
        <div>
          {priceInfo.hasActiveOffer && (
            <div className="text-[10px] text-gray-400 line-through">
              {formatPrice(priceInfo.originalPrice, locale)}
            </div>
          )}
          <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">
            {formatPrice(priceInfo.finalPrice, locale)}{' '}
            <span className="text-[10px] font-normal text-emerald-800/80 dark:text-emerald-300/80">
              / {formatUnitLabel(product.unit, true)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onQuickAdd}
          disabled={isAdding || isOutOfStock}
          className={`min-h-10 px-3 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1 transition-all ${
            isOutOfStock
              ? 'bg-gray-400 text-white cursor-not-allowed opacity-60'
              : isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white'
          }`}
          aria-label={`إضافة ${product.name} إلى السلة`}
        >
          {isOutOfStock ? (
            'نفد'
          ) : isAdding ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span className="hidden sm:inline">جاري...</span>
            </>
          ) : isAdded ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">تمت الإضافة</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              <span>أضف إلى السلة</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
