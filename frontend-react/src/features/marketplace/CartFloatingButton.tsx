import { useCartContext } from './cartState';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';

export default function CartFloatingButton() {
  const { items, totals } = useCartContext();
  const { locale } = useI18n();

  const count = totals.totalQuantity || items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed right-4 bottom-20 md:hidden z-40" dir="rtl">
      <button
        type="button"
        aria-label={`فتح سلة التسوق — ${count} منتج`}
        title="سلة التسوق"
        className="flex items-center gap-3 rounded-full bg-emerald-700 px-4 py-3 text-white shadow-lg"
        onClick={() => {
          // CartDrawer listens for this event.
          window.dispatchEvent(new CustomEvent('cart:open'));
        }}
      >
        <div className="flex flex-col items-end leading-none">
          <span className="text-sm font-bold">{count} منتج</span>
          <span className="mt-0.5 text-xs opacity-90">{formatPrice(totals.grandTotal, locale)}</span>
        </div>
        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7m5-7v7m6-7v7m-9 0h10" />
          </svg>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-black text-emerald-950">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
