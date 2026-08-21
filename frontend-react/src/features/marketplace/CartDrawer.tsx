import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './useCart';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';

export default function CartDrawer() {
  const { items, totals, set, clear } = useCart();
  const { locale } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('cart:open', onOpen as EventListener);
    return () => window.removeEventListener('cart:open', onOpen as EventListener);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="presentation">
      <button
        type="button"
        aria-label="إغلاق سلة التسوق"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="ml-auto flex max-h-[100dvh] w-[min(88vw,360px)] flex-col overflow-hidden rounded-l-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-[var(--gs-foreground)] shadow-2xl"
        style={{ transition: 'transform 250ms ease' }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 id="cart-drawer-title" className="text-lg font-semibold">سلة التسوق</h3>
          <div className="flex items-center gap-2">
            <button type="button" className="min-h-10 rounded-lg px-2 text-sm text-red-600" onClick={() => clear()}>
              مسح
            </button>
            <button type="button" className="min-h-10 min-w-10 rounded-lg text-2xl font-bold" onClick={() => setOpen(false)} aria-label="إغلاق">×</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto space-y-3 py-2">
          {items.length === 0 ? (
            <div className="p-6 text-center opacity-80">سلة التسوق فارغة</div>
          ) : (
            items.map(it => (
              <div key={it.product.id} className="flex items-center gap-3">
                <img src={it.product.image || '/placeholder.svg'} alt={it.product.name} className="h-16 w-16 rounded-lg object-cover" loading="lazy" />
                <div className="flex-1">
                  <div className="font-medium">{it.product.name}</div>
                  <div className="text-sm text-muted">{it.product.category?.name}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-semibold">{formatPrice(it.product.sellingPrice * it.quantity, locale)}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button type="button" onClick={() => set(it.product.id, it.quantity - 1)} className="h-10 w-10 rounded bg-gray-100" aria-label={`تقليل كمية ${it.product.name}`}>−</button>
                    <div className="w-10 text-center" aria-label={`الكمية ${it.quantity}`}>{it.quantity}</div>
                    <button type="button" onClick={() => set(it.product.id, it.quantity + 1)} className="h-10 w-10 rounded bg-green-600 text-white" aria-label={`زيادة كمية ${it.product.name}`}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between mb-2">
            <div className="text-sm text-muted">المجموع</div>
            <div className="font-semibold">{formatPrice(totals.subtotal, locale)}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="text-sm text-muted">تخفيض</div>
            <div className="font-semibold text-green-600">-{formatPrice(totals.discount, locale)}</div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="text-sm text-muted">تقديري التوصيل</div>
            <div className="font-semibold">{formatPrice(totals.delivery, locale)}</div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-muted">المجموع النهائي</div>
            <div className="text-lg font-bold">{formatPrice(totals.total, locale)}</div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              className="min-h-12 w-full rounded-md bg-green-700 py-3 text-white"
              onClick={() => {
                setOpen(false);
                navigate('/checkout');
              }}
              disabled={items.length === 0}
            >
              إتمام الطلب
            </button>
            <button type="button" className="min-h-12 w-full rounded-md border py-3" onClick={() => setOpen(false)}>
              متابعة التسوق
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
