import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { getCart, updateCartItem, removeCartItem, clearCart as clearCartApi, type Cart, type CartItem } from '@/services/cartClient';

export function CartPage() {
  const navigate = useNavigate();
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
        <span className="text-sm font-medium [color:var(--gs-foreground-secondary)]">جاري تحميل السلة...</span>
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
        <div className="gsd-card rounded-3xl p-12 text-center flex flex-col items-center justify-center border border-[var(--gs-border)] bg-[var(--gs-surface)]">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-lg font-bold [color:var(--gs-foreground)]">سلة الشراء فارغة</h2>
          <p className="text-xs [color:var(--gs-foreground-secondary)] mt-1 max-w-sm">
            لم تقم بإضافة أي منتجات إلى سلة الشراء بعد. تصفح الكتالوج واكتشف أحدث الخضروات والمنتجات الطازجة.
          </p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="mt-6 gsd-btn gsd-btn--primary gsd-btn--md inline-flex items-center gap-2 rounded-xl"
          >
            تصفح الكتالوج الآن
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Item List */}
          <div className="space-y-3">
            {items.map((item) => {
              const isUpdating = updatingItemId === item.id;
              return (
                <div
                  key={item.id}
                  className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                      {item.product?.name ? item.product.name.slice(0, 2) : 'منتج'}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold [color:var(--gs-foreground)]">
                        {item.product?.name || `منتج رقم ${item.productId}`}
                      </h3>
                      <span className="text-xs text-[var(--gs-foreground-secondary)]">
                        سعر الوحدة: {item.unitPrice.toFixed(2)} ر.س
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-[var(--gs-border-subtle)] pt-3 sm:pt-0">
                    <div className="flex items-center gap-2 border border-[var(--gs-border)] rounded-xl p-1 bg-[var(--gs-background)]">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        className="p-1 rounded-lg hover:bg-[var(--gs-muted)] text-[var(--gs-foreground)] disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                        className="p-1 rounded-lg hover:bg-[var(--gs-muted)] text-[var(--gs-foreground)] disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-left">
                      <div className="text-sm font-bold text-emerald-600">{item.totalPrice.toFixed(2)} ر.س</div>
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
                <strong className="text-[var(--gs-foreground)]">{(cart?.subtotal ?? 0).toFixed(2)} ر.س</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>الضريبة المضافة:</span>
                <strong className="text-[var(--gs-foreground)]">{(cart?.taxTotal ?? 0).toFixed(2)} ر.س</strong>
              </div>
              <div className="border-t border-[var(--gs-border-subtle)] pt-2 flex items-center justify-between text-sm font-bold text-emerald-600">
                <span>الإجمالي الكلي:</span>
                <span>{(cart?.grandTotal ?? 0).toFixed(2)} ر.س</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="gsd-btn gsd-btn--primary gsd-btn--lg w-full rounded-2xl inline-flex items-center justify-center gap-2 mt-4"
            >
              متابعة الشراء والتسليم
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
