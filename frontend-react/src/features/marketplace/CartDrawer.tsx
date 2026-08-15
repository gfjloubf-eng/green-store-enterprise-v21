import { useEffect, useState, useRef } from 'react';
import { useCart } from './useCart';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';

export default function CartDrawer() {
  const { items, totals, set, clear } = useCart();
  const { locale } = useI18n();
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
    <div className="fixed inset-0 z-50 flex">
      <button
        aria-label="Close cart"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <aside
        ref={panelRef}
        className="ml-auto w-[80%] max-w-[320px] bg-[var(--gs-surface)] text-[var(--gs-foreground)] border border-[var(--gs-border)] rounded-l-2xl shadow-2xl p-4 flex flex-col"
        style={{ transition: 'transform 250ms ease' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">سلة التسوق</h3>
          <div className="flex items-center gap-2">
            <button className="text-sm text-red-600" onClick={() => clear()}>
              مسح
            </button>
            <button className="text-2xl font-bold" onClick={() => setOpen(false)} aria-label="close">×</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto space-y-3 py-2">
          {items.length === 0 ? (
            <div className="p-6 text-center opacity-80">سلة التسوق فارغة</div>
          ) : (
            items.map(it => (
              <div key={it.product.id} className="flex items-center gap-3">
                <img src={it.product.image || '/placeholder.svg'} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="font-medium">{it.product.name}</div>
                  <div className="text-sm text-muted">{it.product.category?.name}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-semibold">{formatPrice(it.product.sellingPrice * it.quantity, locale)}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => set(it.product.id, it.quantity - 1)} className="w-8 h-8 bg-gray-100 rounded">−</button>
                    <div className="w-10 text-center">{it.quantity}</div>
                    <button onClick={() => set(it.product.id, it.quantity + 1)} className="w-8 h-8 bg-green-600 text-white rounded">+</button>
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
            <button className="w-full bg-green-700 text-white rounded-md py-3">الدفع (عرضي)</button>
            <button className="w-full border rounded-md py-3">متابعة التسوق</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
