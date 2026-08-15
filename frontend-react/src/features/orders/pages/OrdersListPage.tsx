import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, Calendar, ChevronLeft, ChevronRight, Eye, AlertCircle, ShoppingBag } from 'lucide-react';
import { getOrders, type Order } from '@/services/orderClient';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';

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

export function OrdersListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { locale } = useI18n();

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isStaff = user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'EMPLOYEE' || user?.role === 'SUPER_ADMIN';

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrders({
        page,
        limit,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      setOrders(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      setError(err?.message || 'تعذر تحميل قائمة الطلبات');
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  return (
    <div className="flex flex-col gap-6 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-3">
            <Package className="h-6 w-6 text-emerald-600" />
            {isStaff ? 'إدارة جميع الطلبات' : 'سجل الطلبات والمشتريات'}
          </h1>
          <p className="text-xs text-[var(--gs-foreground-secondary)] mt-1">
            {isStaff ? 'استعراض وإدارة طلبات جميع العملاء وتحديث حالات الدورة.' : 'تتبع واستعراض تفاصيل طلباتك ومتابعة التسليم.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="gsd-card rounded-3xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--gs-background)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]'
              }`}
            >
              {st === 'ALL' ? 'جميع الطلبات' : STATUS_BADGES[st]?.label || st}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الطلب أو المنتج..."
            className="gsd-input w-full pr-9 pl-3 py-2 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-xs"
          />
        </form>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] h-28 animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="gsd-card rounded-3xl p-12 text-center flex flex-col items-center justify-center border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-3">
          <ShoppingBag className="h-12 w-12 text-emerald-600" />
          <h2 className="text-base font-bold [color:var(--gs-foreground)]">لا يوجد طلبات مسجلة</h2>
          <p className="text-xs text-[var(--gs-foreground-secondary)] max-w-sm">
            لم يتم العثور على أي طلبات تطابق المعايير المحددة.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
            const badge = STATUS_BADGES[ord.status] || { label: ord.status, bg: 'bg-gray-100', text: 'text-gray-700' };
            const dateStr = new Date(ord.createdAt).toLocaleDateString('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={ord.id}
                className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-500/30 transition shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-bold font-mono [color:var(--gs-foreground)]">{ord.code}</span>
                    <span className={`px-3 py-1 rounded-full border text-xs font-bold ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                    {ord.customer && isStaff && (
                      <span className="text-xs bg-[var(--gs-background)] px-2.5 py-1 rounded-lg text-[var(--gs-foreground-secondary)]">
                        العميل: <strong>{ord.customer.fullName}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[var(--gs-foreground-secondary)] flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {dateStr}
                    </span>
                    <span>• {ord.items?.length || 0} منتجات</span>
                  </div>

                  {/* Quick items list */}
                  <div className="text-xs text-[var(--gs-foreground-muted)] line-clamp-1">
                    {ord.items?.map((it) => `${it.name} (${it.quantity})`).join('، ')}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-[var(--gs-border-subtle)] pt-3 md:pt-0">
                  <div className="text-right md:text-left">
                    <span className="text-[11px] text-[var(--gs-foreground-muted)] block">الإجمالي الكلي</span>
                    <strong className="text-base font-bold text-emerald-600">{formatPrice(ord.total, locale)}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/orders/${ord.id}`)}
                    className="gsd-btn gsd-btn--secondary gsd-btn--sm rounded-xl inline-flex items-center gap-2 px-4 py-2 text-xs"
                  >
                    <Eye className="h-4 w-4" />
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 text-xs text-[var(--gs-foreground-secondary)]">
              <span>إجمالي الطلبات: {total} | الصفحة {page} من {totalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-surface)] disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-surface)] disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrdersListPage;
