import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Tag, ShoppingBag, AlertCircle, CheckCircle2, ArrowRight, Store, Eye, Package } from 'lucide-react';
import { createOrder, type Order } from '@/services/orderClient';
import { getCart, type Cart } from '@/services/cartClient';
import { SupportTeamCards } from '@/components/support/SupportTeamCards';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';
import { StoreService } from '@/features/marketplace/services/storeService';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const [cart, setCart] = useState<Cart | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'CARD'>('CASH_ON_DELIVERY');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  useEffect(() => {
    getCart()
      .then((c) => setCart(c))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePlaceOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setError('سلة التسوق فارغة');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder({ notes: notes.trim() || undefined });
      
      // Initiate / Attach Payment Transaction
      const { createPayment } = await import('@/services/paymentClient');
      await createPayment({
        orderId: order.id,
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3" dir="rtl">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
        <span className="text-sm font-medium [color:var(--gs-foreground-secondary)]">جاري تجهيز بيانات الطلب...</span>
      </div>
    );
  }

  const items = cart?.items ?? [];

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

      {success && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-emerald-500/10 border border-emerald-500/20 p-6 text-xs text-emerald-800 space-y-4">
            <div className="flex items-center gap-3 text-lg font-bold text-emerald-700">
              <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-600" />
              <span>تم إنشاء طلبك بنجاح ✓</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              تم استلام طلبك وبدء تجهيزه. يسعدنا تقديم أفضل خدمة لك عبر منصة قطوف.
            </p>

            {createdOrder && (
              <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-emerald-500/20 text-xs">
                <div>
                  <span className="text-emerald-700 block">رقم الطلب:</span>
                  <strong className="font-mono text-sm text-emerald-950">{createdOrder.code || createdOrder.id}</strong>
                </div>
                <div>
                  <span className="text-emerald-700 block">المبلغ الإجمالي:</span>
                  <strong className="text-sm text-emerald-950">{formatPrice(createdOrder.total || cart?.grandTotal, locale)}</strong>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-3">
              {createdOrder && (
                <button
                  type="button"
                  onClick={() => navigate(`/orders/${createdOrder.id}`)}
                  className="gsd-btn gsd-btn--primary gsd-btn--md rounded-2xl inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold"
                >
                  <Eye className="h-4 w-4" />
                  عرض الطلب
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="gsd-btn gsd-btn--ghost gsd-btn--md rounded-2xl inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold border border-emerald-600/30 text-emerald-700 hover:bg-emerald-600 hover:text-white"
              >
                <Package className="h-4 w-4" />
                متابعة التسوق
              </button>
            </div>
          </div>

          <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-3">
            <h3 className="text-sm font-bold text-[var(--gs-foreground)]">تحتاج مساعدة بخصوص طلبك؟</h3>
            <SupportTeamCards onOpenTicket={() => navigate('/support')} />
          </div>
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
                <div className="text-[var(--gs-foreground-secondary)]">المملكة العربية السعودية، جدة / الرياض</div>
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
                <strong className="text-[var(--gs-foreground)]">{formatPrice(cart?.subtotal, locale)}</strong>
              </div>
              <div className="flex justify-between text-[var(--gs-foreground-secondary)]">
                <span>رسوم التوصيل والضريبة:</span>
                <strong className="text-[var(--gs-foreground)]">{formatPrice(0, locale)}</strong>
              </div>
              <div className="flex justify-between text-sm font-bold text-emerald-600 pt-2 border-t border-[var(--gs-border-subtle)]">
                <span>الإجمالي النهائي:</span>
                <span>{formatPrice(cart?.grandTotal, locale)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
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
