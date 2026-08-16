import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckCircle2, Store } from 'lucide-react';
import { getCart, updateCartItem, removeCartItem, clearCart as clearCartApi, type Cart, type CartItem } from '@/services/cartClient';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';
import { StoreService } from '@/features/marketplace/services/storeService';
import { WhatsAppOrderAction } from '@/components/ui/WhatsAppOrderAction';
import { buildCartWhatsAppMessage } from '@/config/whatsapp';

export function CartPage() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCart();
      setCart(data);
    } catch (e: any) {
      setError(e?.message ?? 'تعذر تحميل سلة التسوق');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleUpdateQuantity = async (item: CartItem, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(item.id);
      return;
    }
    setUpdatingItemId(item.id);
    setError(null);
    try {
      const updated = await updateCartItem(item.id, newQty);
      setCart(updated);
      showSuccess('تم تحديث الكمية بنجاح');
    } catch (e: any) {
      setError(e?.message ?? 'فشل في تحديث الكمية');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItemId(itemId);
    setError(null);
    try {
      const updated = await removeCartItem(itemId);
      setCart(updated);
      showSuccess('تم إزالة المنتج من السلة');
    } catch (e: any) {
      setError(e?.message ?? 'فشل في إزالة المنتج');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('هل أنت تأكد من رغبتك في تفريغ سلة الشراء بالكامل؟')) return;
    setLoading(true);
    setError(null);
    try {
      await clearCartApi();
      setCart(null);
      showSuccess('تم تفريغ السلة بنجاح');
    } catch (e: any) {
      setError(e?.message ?? 'فشل في تفريغ السلة');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 pb-8" dir="rtl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="h-8 w-56 bg-[var(--gs-muted)] animate-pulse rounded-xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] h-24 animate-pulse" />
            ))}
          </div>
          <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] h-56 animate-pulse" />
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];

  return (
    <div className="flex flex-col gap-6 pb-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-emerald-600" />
            سلة التسوق الخاصة بك
          </h1>
          <p className="text-xs [color:var(--gs-foreground-secondary)] mt-1">
            إدارة الخضروات والمنتجات المطلوبة قبل إتمام الطلب.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearCart}
            className="gsd-btn gsd-btn--ghost gsd-btn--sm text-rose-600 hover:bg-rose-50 inline-flex items-center gap-2 rounded-xl"
          >
            <Trash2 className="h-4 w-4" />
            تفريغ السلة
          </button>
        )}
      </div>

      {actionSuccess && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={fetchCart} className="underline text-xs font-semibold">تحديث</button>
        </div>
      )}

      {/* Cart Content */}
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
              const isUpdating = updatingItemId === item.id;
              const supplyingStore = StoreService.getAll().find((s) => s.productIds.includes(item.productId || item.product?.id || ''));

              return (
                <div
                  key={item.id}
                  className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    {item.product?.image ? (
                      <img src={item.product.image} alt={item.product.name} className="h-14 w-14 rounded-xl object-cover shrink-0 border border-[var(--gs-border)]" />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                        {item.product?.name ? item.product.name.slice(0, 2) : 'منتج'}
                      </div>
                    )}
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold [color:var(--gs-foreground)]">
                        {item.product?.name || `منتج رقم ${item.productId}`}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--gs-foreground-secondary)]">
                        <span>سعر الوحدة: {formatPrice(item.unitPrice, locale)}</span>
                        {supplyingStore && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--gs-muted)] px-2 py-0.5 text-[10px] font-semibold">
                            <Store className="h-3 w-3 text-emerald-600" />
                            {supplyingStore.name}
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
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--gs-muted)] text-[var(--gs-foreground)] disabled:opacity-40 touch-manipulation focus:outline-none focus:ring-2 focus:ring-[var(--gs-primary)]"
                        aria-label="إنقاص الكمية"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-xs font-bold w-7 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[var(--gs-muted)] text-[var(--gs-foreground)] disabled:opacity-40 touch-manipulation focus:outline-none focus:ring-2 focus:ring-[var(--gs-primary)]"
                        aria-label="زيادة الكمية"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-left">
                      <div className="text-sm font-bold text-emerald-600">{formatPrice(item.totalPrice, locale)}</div>
                    </div>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
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
          <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] h-fit space-y-4">
            <h2 className="text-base font-bold [color:var(--gs-foreground)] border-b border-[var(--gs-border)] pb-3">
              ملخص الحساب
            </h2>

            <div className="space-y-2 text-xs text-[var(--gs-foreground-secondary)]">
              <div className="flex items-center justify-between">
                <span>المجموع الفرعي:</span>
                <strong className="text-[var(--gs-foreground)]">{formatPrice(cart?.subtotal, locale)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>الضريبة المضافة:</span>
                <strong className="text-[var(--gs-foreground)]">{formatPrice(cart?.taxTotal, locale)}</strong>
              </div>
              <div className="border-t border-[var(--gs-border-subtle)] pt-2 flex items-center justify-between text-sm font-bold text-emerald-600">
                <span>الإجمالي الكلي:</span>
                <span>{formatPrice(cart?.grandTotal, locale)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={items.length === 0}
              onClick={() => navigate('/checkout')}
              className="gsd-btn gsd-btn--primary gsd-btn--lg w-full rounded-2xl inline-flex items-center justify-center gap-2 mt-4 text-xs font-bold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              متابعة الطلب الإلكتوني
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Dual WhatsApp Quick Cart Order */}
            <div className="pt-3 border-t border-[var(--gs-border-subtle)] space-y-2">
              <span className="text-[11px] font-bold text-[var(--gs-foreground-secondary)] block">أو طلب سريع عبر واتساب:</span>
              <WhatsAppOrderAction
                getMessage={(_target) =>
                  buildCartWhatsAppMessage(
                    items.map((i) => ({
                      name: i.product?.name || `منتج رقم ${i.productId}`,
                      price: i.unitPrice,
                      quantity: i.quantity,
                      unitName: (i.product as any)?.unit?.name || 'وحدة',
                    })),
                    cart?.grandTotal || 0
                  )
                }
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
            <span className="text-sm font-bold text-emerald-600">{formatPrice(cart?.grandTotal, locale)}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="gsd-btn gsd-btn--primary gsd-btn--md rounded-2xl px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2 min-h-[44px] touch-manipulation"
          >
            متابعة الطلب
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
