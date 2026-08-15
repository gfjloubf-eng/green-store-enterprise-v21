import { useMemo } from 'react';
import { Store } from 'lucide-react';
import type { CartItem } from './cartTypes';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';
import { StoreService } from './services/storeService';

export default function CartItemRow({ item, onSet }: { item: CartItem; onSet: (q: number) => void }) {
  const { locale } = useI18n();

  const supplyingStore = useMemo(() => {
    if (!item?.product?.id) return undefined;
    return StoreService.getAll().find((s) => s.productIds.includes(item.product.id));
  }, [item?.product?.id]);

  return (
    <div className="flex items-center gap-3">
      <img src={item.product.image || '/placeholder.svg'} alt="" className="w-14 h-14 rounded object-cover" />
      <div className="flex-1 space-y-1">
        <div className="font-medium text-sm [color:var(--gs-foreground)]">{item.product.name}</div>
        <div className="flex flex-wrap items-center gap-2 text-xs [color:var(--gs-foreground-secondary)]">
          <span>{item.product.category?.name}</span>
          {supplyingStore && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--gs-muted)] px-2 py-0.5 text-[10px] font-semibold [color:var(--gs-foreground-secondary)]">
              <Store className="h-3 w-3 text-emerald-600" />
              {supplyingStore.name}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="font-semibold text-sm [color:var(--gs-foreground)]">{formatPrice(item.product.sellingPrice * item.quantity, locale)}</div>
        <div className="flex items-center gap-2 mt-2">
          <button type="button" onClick={() => onSet(Math.max(0, item.quantity - 1))} className="w-8 h-8 rounded bg-[var(--gs-muted)] font-bold text-sm [color:var(--gs-foreground)]">−</button>
          <div className="w-8 text-center text-sm font-semibold [color:var(--gs-foreground)]">{item.quantity}</div>
          <button type="button" onClick={() => onSet(item.quantity + 1)} className="w-8 h-8 rounded bg-emerald-600 text-white font-bold text-sm">+</button>
        </div>
      </div>
    </div>
  );
}
