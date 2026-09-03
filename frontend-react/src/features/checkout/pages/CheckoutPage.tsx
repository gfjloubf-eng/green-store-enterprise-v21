/* ============================================================
   GSDS v1.2 — CheckoutPage Component (Safe Order Finalization)
   ============================================================ */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Tag, ShoppingBag, AlertCircle, CheckCircle2, ArrowRight, Store, Eye, Package, Copy, Check, FileText, ExternalLink } from 'lucide-react';
import { createOrder, type Order } from '@/services/orderClient';
import { useCartContext } from '@/features/marketplace/cartState';
import { SupportTeamCards } from '@/components/support/SupportTeamCards';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';
import { StoreService } from '@/features/marketplace/services/storeService';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const {
    items: cartItems,
    totals,
    loading,
    error: cartSyncError,
    authMode,
    refresh,
  } = useCartContext();
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'CARD'>('CASH_ON_DELIVERY');
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (cartSyncError && authMode === 'account') {
      // Re-sync once on mount so the checkout never finalizes from stale data.
      void refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlaceOrder = async () => {
    if (submitting) return;
    if (!cartItems || cartItems.length === 0) {
      setError('سلة التسوق فارغة');
      return;
    }
    // A signed-in user must never create an order from an unsynced cart.
    if (authMode === 'account' && cartSyncError) {
      setError('تعذر مزامنة سلة حسابك مع الخادم. لم يتم إنشاء الطلب؛ حاول مرة أخرى.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder({ notes: notes.trim() || undefined });
      await refresh();

      // Initiate / Attach Payment Transaction
      const { createPayment } = await import('@/services/paymentClient');
      await createPayment({
        orderId: order.id,
        amount: order.total,
        currency: order.currency || 'YER',
        paymentMethod,
        idempotencyKey: `IDEM-${order.id}-${Date.now()}`,
      });

      setCreatedOrder(order);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'فشل إنشاء الطلب والدفع. يرجى المحاولة لاحقاً.');
      setSubmitting(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2500);
      }
    } catch {
      // Prevent browser permission errors from breaking page interaction
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3" dir="rtl">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
        <span className="text-sm font-medium [color:var(--gs-foreground-secondary)]">جاري تجهيز بيانات الطلب...</span>
      </div>
    );
  }

  // 1. Dedicated Standalone Order Success View
  if (success && createdOrder) {
    const orderCode = createdOrder.code || createdOrder.id;
    const rawInvoiceUrl = createdOrder.invoices?.[0]?.publicUrl;
    const safeInvoiceUrl = rawInvoiceUrl && (rawInvoiceUrl.startsWith('http://') || rawInvoiceUrl.startsWith('https://') || rawInvoiceUrl.startsWith('/')) ? rawInvoiceUrl : null;

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12" dir="rtl">
        {/* Success Header Banner */}
        <div className="gsd-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-[var(--gs-surface)] to-[var(--gs-surface)] space-y-6 text-center shadow-lg">
          <div className="h-20 w-20 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--gs-foreground)]">تم إنشاء طلبك بنجاح ✓</h1>
            <p className="text-xs sm:text-sm text-[var(--gs-foreground-secondary)] mt-2 max-w-md mx-auto leading-relaxed">
              تم استلام طلبك وبدء تجهيزه في المتجر. يمكنك تتبع حالة الطلب واستعراض الفاتورة في أي وقت.
            </p>
          </div>

          {/* Key Order Info Grid */}
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 pt-4 border-t border-[var(--gs-border-subtle)] text-right">
            <div className="rounded-2xl bg-[var(--gs-background)] p-3 border border-[var(--gs-border-subtle)] space-y-1">
              <span className="text-[10px] font-bold text-[var(--gs-foreground-muted)] block">رقم الطلب</span>
              <div className="flex items-center justify-between">
                <strong className="font-mono text-xs sm:text-sm text-[var(--gs-foreground)] truncate">{orderCode}</strong>
                <button
                  type="button"
                  onClick={() => handleCopyCode(orderCode)}
                  className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition"
                  title="نسخ رقم الطلب"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--gs-background)] p-3 border border-[var(--gs-border-subtle)] space-y-1">
              <span className="text-[10px] font-bold text-[var(--gs-foreground-muted)] block">الإجمالي النهائي</span>
              <strong className="text-xs sm:text-sm text-emerald-600 block">{formatPrice(createdOrder.total || totals.grandTotal, locale)}</strong>
            </div>

            <div className="rounded-2xl bg-[var(--gs-background)] p-3 border border-[var(--gs-border-subtle)] space-y-1">
              <span className="text-[10px] font-bold text-[var(--gs-foreground-muted)] block">حالة الطلب</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                نشط / قيد التجهيز
              </span>
            </div>

            <div className="rounded-2xl bg-[var(--gs-background)] p-3 border border-[var(--gs-border-subtle)] space-y-1">
              <span className="text-[10px] font-bold text-[var(--gs-foreground-muted)] block">طريقة الدفع</span>
              <span className="text-xs font-bold text-[var(--gs-foreground)] block">
                {paymentMethod === 'CARD' ? 'بطاقة مدى / ائتمان' : 'الدفع عند الاستلام'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[var(--gs-border-subtle)]">
            <button
              type="button"
              onClick={() => navigate(`/orders/${createdOrder.id}`)}
              className="gsd-btn gsd-btn--primary gsd-btn--md rounded-2xl inline-flex items-center gap-2 px-5 py-3 text-xs font-bold shadow-md"
            >
              <Eye className="h-4 w-4" />
              تتبع وعرض الطلب
            </button>

            {safeInvoiceUrl ? (
              <a
                href={safeInvoiceUrl}
                target="_blank"
                rel="noreferrer"
                className="gsd-btn gsd-btn--ghost gsd-btn--md rounded-2xl inline-flex items-center gap-2 px-5 py-3 text-xs font-bold border border-emerald-600/30 text-emerald-700 hover:bg-emerald-600 hover:text-white"
              >
                <FileText className="h-4 w-4" />
                عرض الفاتورة
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-500/20">
                <FileText className="h-4 w-4 text-amber-600" />
                جارٍ إصدار الفاتورة الإلكترونية رسمياً...
              </span>
            )}

            <button
              type="button"
              onClick={() => navigate('/products')}
              className="gsd-btn gsd-btn--ghost gsd-btn--md rounded-2xl inline-flex items-center gap-2 px-5 py-3 text-xs font-bold text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]"
            >
              <Package className="h-4 w-4" />
              متابعة التسوق
            </button>
          </div>
        </div>

        {/* Customer Support Integration */}
        <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-3">
          <h3 className="text-sm font-bold text-[var(--gs-foreground)]">تحتاج مساعدة بخصوص هذا الطلب؟</h3>
          <SupportTeamCards onOpenTicket={() => navigate('/support')} />
        </div>
      </div>
    );
  }

  const items = cartItems ?? [];

  return (
    <div className="flex flex-col gap-6 pb-12" dir="rtl">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold [color:var(--gs-foreground)]">إتمام الطلب والدفع</h1>
        <p className="text-xs text-[var(--gs-foreground-secondary)]">مراجعة العناصر والتسليم قبل تأكيد الطلب الحقيقي.</p>
      </header>

      {error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {items.length === 0 ? (
        <div className="gsd-card rounded-3xl p-10 text-center space-y-4 border border-[var(--gs-border)] bg-[var(--gs-surface)]">
          <ShoppingBag className="h-12 w-12 text-emerald-600 mx-auto" />
          <h2 className="text-base font-bold">لا يوجد عناصر في السلة لإتمام الطلب</h2>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="gsd-btn gsd-btn--primary gsd-btn--md rounded-xl px-5 py-2 text-xs"
          >
            تصفح المنتجات الآن
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Delivery Address */}
            <section className="gsd-card rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <MapPin className="h-5 w-5" />
                <span>عنوان التسليم والمستلم</span>
              </div>
              <div className="rounded-2xl bg-[var(--gs-background)] p-4 text-xs space-y-1">
                <div className="font-semibold [color:var(--gs-foreground)]">عنوان التوصيل السريع</div>
                <div className="text-[var(--gs-foreground-secondary)]">اليمن، صنعاء، شارع هائل</div>
              </div>
            </section>

            {/* Delivery Time */}
            <section className="gsd-card rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <Clock className="h-5 w-5" />
                <span>وقت التوصيل المتوقع</span>
              </div>
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-semibold text-emerald-700">
                التسليم المباشر فور تأكيد الطلب خلال 30 دقيقة
              </div>
            </section>

            {/* Payment Method */}
            <section className="gsd-card rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <Tag className="h-5 w-5" />
                <span>طريقة الدفع (Payment Method)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold text-right transition-colors ${
                    paymentMethod === 'CASH_ON_DELIVERY'
                      ? '[border-color:var(--gs-primary)] [background:var(--gs-primary-soft)] [color:var(--gs-primary)]'
                      : '[border-color:var(--gs-border)] [background:var(--gs-background)] [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)]'
                  }`}
                >
                  الدفع عند الاستلام (COD)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold text-right transition-colors ${
                    paymentMethod === 'CARD'
                      ? '[border-color:var(--gs-primary)] [background:var(--gs-primary-soft)] [color:var(--gs-primary)]'
                      : '[border-color:var(--gs-border)] [background:var(--gs-background)] [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)]'
                  }`}
                >
                  بطاقة مدى / ائتمان (Card)
                </button>
              </div>
            </section>

            {/* Order Notes */}
            <section className="gsd-card rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <Tag className="h-5 w-5" />
                <span>ملاحظات إضافية على الطلب</span>
              </div>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أضف أي إرشادات خاصة بالتوصيل أو التغليف..."
                className="gsd-input w-full rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] p-3 text-xs"
              />
            </section>
          </div>

          {/* Order Summary & Finalize Action */}
          <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] h-fit space-y-4">
            <h2 className="text-base font-bold [color:var(--gs-foreground)] border-b border-[var(--gs-border)] pb-3">
              ملخص الفاتورة ({items.length} منتجات)
            </h2>

            <div className="space-y-2 text-xs divide-y divide-[var(--gs-border-subtle)]">
              {items.map((item) => {
                const supplyingStore = StoreService.getAll().find((s) => s.productIds.includes(item.productId || item.product?.id || ''));
                return (
                  <div key={item.id} className="pt-2 flex justify-between">
                    <div>
                      <span className="font-semibold text-[var(--gs-foreground)]">{item.product?.name || item.productId}</span>
                      <span className="text-[var(--gs-foreground-muted)] block">
                        الكمية: {item.quantity} × {formatPrice(item.unitPrice, locale)}
                      </span>
                      {supplyingStore && (
                        <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] text-[var(--gs-foreground-secondary)] font-semibold">
                          <Store className="h-3 w-3 text-emerald-600" />
                          {supplyingStore.name}
                        </span>
                      )}
                    </div>
                    <strong className="text-emerald-600">{formatPrice(item.totalPrice, locale)}</strong>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[var(--gs-border)] pt-3 space-y-1 text-xs">
              <div className="flex justify-between text-[var(--gs-foreground-secondary)]">
                <span>المجموع الفرعي:</span>
                <strong className="text-[var(--gs-foreground)]">{formatPrice(totals.subtotal, locale)}</strong>
              </div>
              {totals.savings > 0 && (
                <div className="flex justify-between text-[var(--gs-foreground-secondary)] text-emerald-600">
                  <span>خصم العروض:</span>
                  <strong>-{formatPrice(totals.savings, locale)}</strong>
                </div>
              )}
              <div className="flex justify-between text-[var(--gs-foreground-secondary)]">
                <span>الضريبة (15%):</span>
                <strong className="text-[var(--gs-foreground)]">{formatPrice(totals.taxTotal, locale)}</strong>
              </div>
              <div className="flex justify-between text-[var(--gs-foreground-secondary)]">
                <span>التوصيل (مرة واحدة):</span>
                <strong className="text-[var(--gs-foreground)]">{formatPrice(totals.deliveryTotal, locale)}</strong>
              </div>
              <div className="flex justify-between text-sm font-bold text-emerald-600 pt-2 border-t border-[var(--gs-border-subtle)]">
                <span>الإجمالي النهائي:</span>
                <span>{formatPrice(totals.grandTotal, locale)}</span>
              </div>
            </div>

            {authMode === 'account' && cartSyncError && (
              <div
                role="alert"
                className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-[11px] font-bold text-rose-700 dark:text-rose-300"
              >
                تعذر مزامنة سلة حسابك مع الخادم. لم يتم إنشاء الطلب؛ حاول مرة أخرى بعد تحديث السلة.
              </div>
            )}

            <button
              type="button"
              disabled={submitting || (authMode === 'account' && Boolean(cartSyncError))}
              onClick={handlePlaceOrder}
              className="gsd-btn gsd-btn--primary gsd-btn--lg w-full rounded-2xl py-3 text-xs font-bold flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>جاري تأكيد الطلب...</span>
                </>
              ) : (
                <>
                  تأكيد الطلب
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
