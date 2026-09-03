/* ============================================================
   GSDS v1.2 — CartPage (reads the unified cart context)
   Green Store Enterprise v2 — customer cart page
   ============================================================
   Uses CartContext (→ cartClient gateway) as its single source, exactly like
   the drawer, topbar counters and checkout, so every surface always shows
   the same items and totals (tax 15% + delivery 3 YER once).
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import { useCartContext } from '@/features/marketplace/cartState';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';
import { WhatsAppOrderAction } from '@/components/ui/WhatsAppOrderAction';
import { buildCartWhatsAppMessage } from '@/config/whatsapp';
import { createOrder } from '@/services/orderClient';
import { getStoredAccessToken } from '@/services/authClient';

export function CartPage() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const {
    items,
    totals,
    loading,
    error,
    authMode,
    increase,
    decrease,
    setQuantity,
    removeItem,
    clear,
    refresh,
    dismissError,
  } = useCartContext();

  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setActionError(null);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const runAction = async (operation: () => Promise<{ ok: boolean; message?: string }>, successMsg: string, itemId?: string) => {
    if (itemId) setBusyItemId(itemId);
    setActionError(null);
    const result = await operation();
    if (itemId) setBusyItemId(null);
    if (result.ok) {
      showSuccess(successMsg);
    } else {
      setActionSuccess(null);
      setActionError(result.message || 'تعذرت العملية.');
    }
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      void runAction(() => removeItem(itemId), 'تمت إزالة المنتج من السلة', itemId);
      return;
    }
    void runAction(() => setQuantity(itemId, newQty), 'تم تحديث الكمية بنجاح', itemId);
  };

  const handleClearCart = async () => {
    if (clearing || items.length === 0) return;
    if (!window.confirm('هل أنت متأكد من رغبتك في تفريغ سلة الشراء بالكامل؟')) return;
    setClearing(true);
    setActionError(null);
    const result = await clear();
    setClearing(false);
    if (result.ok) showSuccess('تم تفريغ السلة بنجاح');
    else setActionError(result.message || 'فشل تفريغ السلة.');
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col gap-6 pb-8" dir="rtl">
        <div className="flex items-center gap-2 py-16 justify-center text-sm font-semibold text-[var(--gs-foreground-muted)]">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          جارٍ تحميل سلة المشتريات...
        </div>
      </div>
    );
  }

  const syncError = error ?? actionError;

  return (
    <div className="flex flex-col gap-6 pb-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-emerald-600" />
            سلة مشترياتك
          </h1>
          <p className="text-xs [color:var(--gs-foreground-secondary)] mt-1">
            راجع المنتجات والكميات قبل إتمام الطلب.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => void handleClearCart()}
              disabled={clearing}
              className="gsd-btn gsd-btn--danger-ghost gsd-btn--sm rounded-xl text-xs disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {clearing ? 'جاري...' : 'تفريغ السلة'}
            </button>
          )}
          <span className="rounded-full bg-[var(--gs-muted)] px-3 py-1 text-[10px] font-bold text-[var(--gs-foreground-secondary)]">
            {authMode === 'account' ? 'سلة حسابي (مزامنة مع الخادم)' : 'سلة الزائر (محفوظة على جهازك)'}
          </span>
        </div>
      </div>

      {(syncError || actionSuccess) && (
        <div className="space-y-2">
          {syncError && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-start justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-700 dark:text-rose-300"
            >
              <span className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {syncError}
              </span>
              <button type="button" onClick={dismissError} className="font-black" aria-label="إغلاق التنبيه">×</button>
            </div>
          )}
          {actionSuccess && (
            <div role="status" className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {actionSuccess}
            </div>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div className="gsd-card rounded-3xl p-12 text-center flex flex-col items-center justify-center border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-lg font-bold [color:var(--gs-foreground)]">لا توجد منتجات في سلتك</h2>
          <p className="text-xs [color:var(--gs-foreground-secondary)] max-w-sm">
            سلتك فارغة حالياً. ابدأ بتصفح المنتجات الطازجة واختيار ما يناسبك.
          </p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="gsd-btn gsd-btn--primary gsd-btn--md inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold"
          >
            تصفح المنتجات
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Item List */}
          <div className="space-y-3">
            {items.map((item) => {
              const isUpdating = busyItemId === item.id;
              const productName = item.product?.name || `منتج رقم ${item.productId}`;
              return (
                <div
                  key={item.id}
                  className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={productName}
                        className="h-14 w-14 rounded-xl object-cover shrink-0 border border-[var(--gs-border)]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                        {productName.slice(0, 2)}
                      </div>
                    )}
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-sm font-semibold [color:var(--gs-foreground)] truncate">
                        {productName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--gs-foreground-secondary)]">
                        <span>سعر الوحدة: {formatPrice(item.unitPrice, locale)}</span>
                        {item.product?.category?.name && (
                          <span className="rounded-full bg-[var(--gs-muted)] px-2 py-0.5 text-[10px] font-semibold">
                            {item.product.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-[var(--gs-border-subtle)] pt-3 sm:pt-0">
                    <div className="flex items-center gap-1.5 border border-[var(--gs-border)] rounded-xl p-1 bg-[var(--gs-background)]">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--gs-muted)] text-[var(--gs-foreground)] disabled:opacity-40 touch-manipulation"
                        aria-label={`إنقاص كمية ${productName}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-xs font-bold w-7 text-center" aria-live="polite">
                        {isUpdating ? '...' : item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--gs-muted)] text-[var(--gs-foreground)] disabled:opacity-40 touch-manipulation"
                        aria-label={`زيادة كمية ${productName}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-left min-w-24">
                      <div className="text-sm font-bold text-emerald-600">{formatPrice(item.totalPrice, locale)}</div>
                    </div>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => void runAction(() => removeItem(item.id), 'تمت إزالة المنتج من السلة', item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition disabled:opacity-40"
                      title="إزالة"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals Summary */}
          <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] h-fit space-y-4 lg:sticky lg:top-24">
            <h2 className="text-base font-bold [color:var(--gs-foreground)] border-b border-[var(--gs-border)] pb-3">
              ملخص طلبك
            </h2>

            <div className="space-y-2 text-xs text-[var(--gs-foreground-secondary)]">
              <div className="flex items-center justify-between">
                <span>المجموع الفرعي:</span>
                <strong className="text-[var(--gs-foreground)]">{formatPrice(totals.subtotal, locale)}</strong>
              </div>
              {totals.savings > 0 && (
                <div className="flex items-center justify-between text-emerald-600">
                  <span>خصم العروض:</span>
                  <strong>-{formatPrice(totals.savings, locale)}</strong>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>الضريبة (15%):</span>
                <strong className="text-[var(--gs-foreground)]">{formatPrice(totals.taxTotal, locale)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>التوصيل (مرة واحدة):</span>
                <strong className="text-[var(--gs-foreground)]">{formatPrice(totals.deliveryTotal, locale)}</strong>
              </div>
              <div className="border-t border-[var(--gs-border-subtle)] pt-2 flex items-center justify-between text-sm font-bold text-emerald-600">
                <span>الإجمالي النهائي:</span>
                <span>{formatPrice(totals.grandTotal, locale)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={items.length === 0}
              onClick={() => navigate('/checkout')}
              className="gsd-btn gsd-btn--primary gsd-btn--lg w-full rounded-2xl inline-flex items-center justify-center gap-2 mt-4 text-xs font-bold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              متابعة إتمام الطلب
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* WhatsApp Quick Cart Order (registered users only — server order) */}
            <div className="pt-3 border-t border-[var(--gs-border-subtle)] space-y-2">
              <span className="text-[11px] font-bold text-[var(--gs-foreground-secondary)] block">أو طلب سريع عبر واتساب:</span>
              <WhatsAppOrderAction
                getMessage={(_target) =>
                  buildCartWhatsAppMessage(
                    items.map((item) => ({
                      name: item.product?.name || `منتج رقم ${item.productId}`,
                      price: item.unitPrice,
                      quantity: item.quantity,
                      unitName: item.product?.unit?.name || 'وحدة',
                    })),
                    totals.grandTotal || 0,
                  )
                }
                beforeOpen={async () => {
                  if (!getStoredAccessToken()) {
                    throw new Error('يرجى تسجيل الدخول أولاً حتى يتم حفظ الطلب في إدارة الطلبات.');
                  }
                  const order = await createOrder({ notes: 'طلب سريع عبر واتساب', allowLocalFallback: false });
                  if (order.isLocal) {
                    throw new Error('تعذر حفظ الطلب في الخادم. لم يتم فتح واتساب حتى لا يضيع الطلب من إدارة الطلبات.');
                  }
                  await refresh();
                  return {
                    orderCode: order.code,
                    invoiceNumber: order.invoices?.[0]?.number,
                    invoiceUrl: order.invoices?.[0]?.publicUrl,
                  };
                }}
                variant="dropdown"
                buttonText="طلب سريع عبر واتساب"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sticky Checkout Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-14 left-0 right-0 z-30 lg:hidden border-t border-[var(--gs-border)] bg-[var(--gs-surface)]/95 backdrop-blur-md p-3 px-4 shadow-xl flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[var(--gs-foreground-secondary)] block">الإجمالي الكلي</span>
            <span className="text-sm font-bold text-emerald-600">{formatPrice(totals.grandTotal, locale)}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="gsd-btn gsd-btn--primary gsd-btn--md rounded-2xl px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2 min-h-[44px] touch-manipulation"
          >
            متابعة إتمام الطلب
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
