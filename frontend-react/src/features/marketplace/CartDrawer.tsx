/* ============================================================
   CartDrawer — Global cart drawer (reads the unified cart context)
   Green Store Enterprise v2 (customer storefront)
   ============================================================
   Every value shown here comes from CartContext → cartClient gateway, the
   same source used by the /cart page, checkout, topbar and mobile nav, so
   counts and totals can never diverge between surfaces.
   Totals follow the storefront policy: tax 15% + delivery 3 YER once.
   ============================================================ */

import { useEffect, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCartContext } from './cartState';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';

export default function CartDrawer() {
  const {
    items,
    totals,
    loading,
    error,
    authMode,
    increase,
    decrease,
    removeItem,
    clear,
    dismissError,
  } = useCartContext();
  const { locale } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

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
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleIncrease = async (itemId: string, e: MouseEvent) => {
    e.stopPropagation();
    setBusyId(itemId);
    await increase(itemId);
    setBusyId(null);
  };

  const handleDecrease = async (itemId: string, e: MouseEvent) => {
    e.stopPropagation();
    setBusyId(itemId);
    await decrease(itemId);
    setBusyId(null);
  };

  const handleRemove = async (itemId: string, e: MouseEvent) => {
    e.stopPropagation();
    setBusyId(itemId);
    await removeItem(itemId);
    setBusyId(null);
  };

  const handleClear = async () => {
    if (items.length === 0 || clearing) return;
    if (!window.confirm('هل تريد تفريغ سلة المشتريات بالكامل؟')) return;
    setClearing(true);
    await clear();
    setClearing(false);
  };

  const handleCheckout = () => {
    setOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex" role="presentation">
      <button
        type="button"
        aria-label="إغلاق سلة التسوق"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="ml-auto flex max-h-[100dvh] w-[min(88vw,380px)] flex-col overflow-hidden rounded-l-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-[var(--gs-foreground)] shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 id="cart-drawer-title" className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-emerald-600" />
            سلة التسوق
          </h3>
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-[var(--gs-muted)] px-2 py-0.5 text-[10px] font-bold text-[var(--gs-foreground-secondary)]">
              {authMode === 'account' ? 'حسابي' : 'زائر'}
            </span>
            {items.length > 0 && (
              <button
                type="button"
                disabled={clearing}
                onClick={() => void handleClear()}
                className="min-h-10 rounded-lg px-2 text-xs font-bold text-rose-600 disabled:opacity-50"
              >
                {clearing ? '...' : 'تفريغ'}
              </button>
            )}
            <button
              type="button"
              className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-xl font-bold hover:bg-[var(--gs-muted)]"
              onClick={() => setOpen(false)}
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-3 flex items-start justify-between gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] font-semibold text-rose-700 dark:text-rose-300"
          >
            <span className="flex items-start gap-1.5">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </span>
            <button type="button" onClick={dismissError} className="font-bold" aria-label="إغلاق التنبيه">
              ×
            </button>
          </div>
        )}

        <div className="flex-1 overflow-auto space-y-3 py-2">
          {loading && items.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-10 text-xs text-[var(--gs-foreground-secondary)]">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              جارٍ تحميل السلة...
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-6 text-center opacity-80">
              <ShoppingBag className="h-10 w-10 text-[var(--gs-foreground-muted)]" />
              <p className="text-sm font-semibold">سلة التسوق فارغة</p>
              <p className="text-[11px] text-[var(--gs-foreground-secondary)]">
                تصفح الفواكه والخضروات الطازجة وأضف ما يناسبك.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const productName = item.product?.name || 'منتج';
              const busy = busyId === item.id;
              return (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-[var(--gs-border-subtle)] bg-[var(--gs-background)] p-2.5">
                  {item.product?.image ? (
                    <img
                      src={item.product.image}
                      alt={productName}
                      className="h-16 w-16 rounded-xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-700 dark:bg-emerald-950/50">
                      {productName.slice(0, 2)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold">{productName}</div>
                    <div className="mt-0.5 text-[10px] text-[var(--gs-foreground-secondary)]">
                      {formatPrice(item.unitPrice, locale)} / وحدة
                    </div>
                    <div className="mt-1.5 flex items-center gap-1">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={(e) => void handleDecrease(item.id, e)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--gs-border)] text-sm font-bold disabled:opacity-40"
                        aria-label={`إنقاص كمية ${productName}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-7 text-center text-xs font-black" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={(e) => void handleIncrease(item.id, e)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-bold disabled:opacity-40"
                        aria-label={`زيادة كمية ${productName}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={(e) => void handleRemove(item.id, e)}
                        className="ms-1 flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 disabled:opacity-40"
                        aria-label={`إزالة ${productName} من السلة`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-left text-xs font-black text-emerald-700 dark:text-emerald-400">
                    {formatPrice(item.totalPrice, locale)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-[var(--gs-border)] pt-3 mt-3 space-y-1.5 text-xs">
          <div className="flex justify-between text-[var(--gs-foreground-secondary)]">
            <span>المجموع الفرعي</span>
            <strong className="text-[var(--gs-foreground)]">{formatPrice(totals.subtotal, locale)}</strong>
          </div>
          {totals.savings > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>خصم العروض</span>
              <strong>-{formatPrice(totals.savings, locale)}</strong>
            </div>
          )}
          <div className="flex justify-between text-[var(--gs-foreground-secondary)]">
            <span>الضريبة (15%)</span>
            <strong className="text-[var(--gs-foreground)]">{formatPrice(totals.taxTotal, locale)}</strong>
          </div>
          <div className="flex justify-between text-[var(--gs-foreground-secondary)]">
            <span>التوصيل (مرة واحدة)</span>
            <strong className="text-[var(--gs-foreground)]">{formatPrice(totals.deliveryTotal, locale)}</strong>
          </div>
          <div className="flex justify-between items-center border-t border-[var(--gs-border-subtle)] pt-2 text-sm">
            <span className="font-bold">الإجمالي النهائي</span>
            <strong className="text-lg font-black text-emerald-700 dark:text-emerald-400">
              {formatPrice(totals.grandTotal, locale)}
            </strong>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              className="min-h-12 w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              إتمام الطلب
            </button>
            <button
              type="button"
              className="min-h-12 w-full rounded-xl border border-[var(--gs-border)] py-3 text-sm font-bold"
              onClick={() => setOpen(false)}
            >
              متابعة التسوق
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
