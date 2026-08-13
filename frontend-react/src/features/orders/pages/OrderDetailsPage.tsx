import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, ArrowRight, Calendar, User, AlertCircle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { getOrderById, updateOrderStatus, cancelOrder, type Order } from '@/services/orderClient';
import { useAuth } from '@/hooks/useAuth';

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'قيد الانتظار', bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-600' },
  CONFIRMED: { label: 'مؤكد', bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-600' },
  PACKED: { label: 'تم التجهيز', bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-600' },
  SHIPPED: { label: 'قيد الشحن', bg: 'bg-indigo-500/10 border-indigo-500/20', text: 'text-indigo-600' },
  DELIVERED: { label: 'تم التسليم', bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-600' },
  CANCELED: { label: 'ملغي', bg: 'bg-rose-500/10 border-rose-500/20', text: 'text-rose-600' },
  RETURNED: { label: 'مسترجع', bg: 'bg-zinc-500/10 border-zinc-500/20', text: 'text-zinc-600' },
  REFUNDED: { label: 'مسترد', bg: 'bg-orange-500/10 border-orange-500/20', text: 'text-orange-600' },
};

const NEXT_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELED'],
  CONFIRMED: ['PACKED', 'SHIPPED', 'CANCELED'],
  PACKED: ['SHIPPED', 'CANCELED'],
  SHIPPED: ['DELIVERED', 'RETURNED'],
  DELIVERED: ['RETURNED', 'REFUNDED'],
  CANCELED: [],
  RETURNED: ['REFUNDED'],
  REFUNDED: [],
};

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isStaff = user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'EMPLOYEE' || user?.role === 'SUPER_ADMIN';

  const fetchOrderDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err: any) {
      if (err?.status === 404 || err?.message === 'order_not_found') {
        setError('الطلب غير موجود أو لا تملك الصلاحية للوصول إليه');
      } else {
        setError(err?.message || 'فشل تحميل تفاصيل الطلب');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order || !id) return;
    setUpdating(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const updated = await updateOrderStatus(id, newStatus);
      setOrder(updated);
      setSuccessMsg(`تم تحديث حالة الطلب إلى: ${STATUS_BADGES[newStatus]?.label || newStatus}`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setError(err?.message || 'فشل تحديث حالة الطلب');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !id) return;
    if (!window.confirm('هل أنت تأكد من رغبتك في إلغاء هذا الطلب؟')) return;

    setUpdating(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const updated = await cancelOrder(id);
      setOrder(updated);
      setSuccessMsg('تم إلغاء الطلب بنجاح');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setError(err?.message || 'فشل إلغاء الطلب');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3" dir="rtl">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
        <span className="text-sm font-medium text-[var(--gs-foreground-secondary)]">جاري تحميل تفاصيل الطلب...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="gsd-card rounded-3xl p-10 text-center space-y-4 border border-[var(--gs-border)] bg-[var(--gs-surface)]" dir="rtl">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold [color:var(--gs-foreground)]">خطأ في الوصول إلى الطلب</h2>
        <p className="text-xs text-[var(--gs-foreground-secondary)] max-w-sm mx-auto">
          {error || 'الطلب المطلوبة غير موجودة في النظام'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="gsd-btn gsd-btn--primary gsd-btn--md rounded-xl px-5 py-2 text-xs"
        >
          العودة لسجل الطلبات
        </button>
      </div>
    );
  }

  const badge = STATUS_BADGES[order.status] || { label: order.status, bg: 'bg-gray-100', text: 'text-gray-700' };
  const dateStr = new Date(order.createdAt).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const possibleTransitions = NEXT_TRANSITIONS[order.status] || [];
  const canCancelAsCustomer = !isStaff && (order.status === 'PENDING' || order.status === 'CONFIRMED');

  return (
    <div className="flex flex-col gap-6 pb-12" dir="rtl">
      {/* Back Button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--gs-border)] pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="p-2 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-surface)] hover:bg-[var(--gs-muted)]"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold font-mono [color:var(--gs-foreground)]">{order.code}</h1>
              <span className={`px-3 py-1 rounded-full border text-xs font-bold ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-[var(--gs-foreground-secondary)] mt-0.5 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              تاريخ الطلب: {dateStr}
            </p>
          </div>
        </div>

        {/* Customer Self-Service Cancel */}
        {canCancelAsCustomer && (
          <button
            type="button"
            disabled={updating}
            onClick={handleCancelOrder}
            className="gsd-btn gsd-btn--secondary gsd-btn--sm text-rose-600 hover:bg-rose-50 rounded-xl inline-flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            إلغاء الطلب
          </button>
        )}
      </div>

      {successMsg && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main Items Table */}
        <div className="space-y-6">
          <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
            <h2 className="text-base font-bold [color:var(--gs-foreground)] flex items-center gap-2 border-b border-[var(--gs-border)] pb-3">
              <Package className="h-5 w-5 text-emerald-600" />
              عناصر الفاتورة المشتراة ({order.items?.length || 0})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[var(--gs-border)] text-[var(--gs-foreground-secondary)]">
                    <th className="py-2.5 px-3">المنتج</th>
                    <th className="py-2.5 px-3">الرمز (SKU)</th>
                    <th className="py-2.5 px-3 text-center">الكمية</th>
                    <th className="py-2.5 px-3">سعر الوحدة</th>
                    <th className="py-2.5 px-3 text-left">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--gs-border-subtle)]">
                  {order.items?.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--gs-background)]">
                      <td className="py-3 px-3 font-semibold text-[var(--gs-foreground)]">{item.name}</td>
                      <td className="py-3 px-3 font-mono text-[var(--gs-foreground-muted)]">{item.sku || '—'}</td>
                      <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                      <td className="py-3 px-3">{item.unitPrice.toFixed(2)} ر.س</td>
                      <td className="py-3 px-3 text-left font-bold text-emerald-600">{item.total.toFixed(2)} ر.س</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Context for Staff */}
          {isStaff && order.customer && (
            <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-3">
              <h2 className="text-base font-bold [color:var(--gs-foreground)] flex items-center gap-2 border-b border-[var(--gs-border)] pb-3">
                <User className="h-5 w-5 text-emerald-600" />
                معلومات صاحب الطلب (Customer Context)
              </h2>
              <div className="grid gap-2 sm:grid-cols-3 text-xs">
                <div>
                  <span className="text-[var(--gs-foreground-secondary)] block">الاسم:</span>
                  <strong className="text-[var(--gs-foreground)]">{order.customer.fullName}</strong>
                </div>
                <div>
                  <span className="text-[var(--gs-foreground-secondary)] block">البريد الإلكتروني:</span>
                  <strong className="text-[var(--gs-foreground)]">{order.customer.email || 'غير محدد'}</strong>
                </div>
                <div>
                  <span className="text-[var(--gs-foreground-secondary)] block">رقم الهاتف:</span>
                  <strong className="text-[var(--gs-foreground)]">{order.customer.phone || 'غير محدد'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Totals & Staff Lifecycle Controls */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-3">
            <h2 className="text-base font-bold [color:var(--gs-foreground)] border-b border-[var(--gs-border)] pb-3">
              ملخص المبالغ المالية
            </h2>

            <div className="space-y-2 text-xs text-[var(--gs-foreground-secondary)]">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <strong className="text-[var(--gs-foreground)]">{order.subtotal.toFixed(2)} {order.currency}</strong>
              </div>
              <div className="flex justify-between">
                <span>رسوم التوصيل:</span>
                <strong className="text-[var(--gs-foreground)]">{order.shipping.toFixed(2)} {order.currency}</strong>
              </div>
              <div className="flex justify-between">
                <span>الضريبة:</span>
                <strong className="text-[var(--gs-foreground)]">{order.tax.toFixed(2)} {order.currency}</strong>
              </div>
              <div className="border-t border-[var(--gs-border)] pt-2 flex justify-between text-sm font-bold text-emerald-600">
                <span>المجموع الإجمالي:</span>
                <span>{order.total.toFixed(2)} {order.currency}</span>
              </div>
            </div>
          </div>

          {/* Staff Status Transition Controls */}
          {isStaff && (
            <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
              <h2 className="text-base font-bold [color:var(--gs-foreground)] flex items-center gap-2 border-b border-[var(--gs-border)] pb-3">
                <RefreshCw className="h-5 w-5 text-emerald-600" />
                تغيير حالة دوره الطلب (Staff / Admin)
              </h2>

              <p className="text-xs text-[var(--gs-foreground-secondary)]">
                الحالة الحالية: <strong className="text-emerald-600">{badge.label}</strong>
              </p>

              {possibleTransitions.length > 0 ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--gs-foreground-secondary)]">الانتقال المسموح القادم:</label>
                  <div className="flex flex-wrap gap-2">
                    {possibleTransitions.map((st) => (
                      <button
                        key={st}
                        type="button"
                        disabled={updating}
                        onClick={() => handleStatusChange(st)}
                        className={`gsd-btn gsd-btn--sm rounded-xl px-3 py-1.5 text-xs font-semibold ${
                          st === 'CANCELED'
                            ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500/20'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {STATUS_BADGES[st]?.label || st}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[var(--gs-foreground-muted)] italic">
                  وصل الطلب إلى حالة نهائية ({badge.label}). لا يمكن إجراء تحويلات إضافية.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
