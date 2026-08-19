import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Clock3, Loader2, PackageCheck, RefreshCw, Search, ShoppingBag, Truck } from 'lucide-react';
import { getOrders, updateOrderStatus, type Order } from '@/services/orderClient';
import { formatPrice } from '@/lib/formatters';

const ORDER_STATUSES: Array<{ value: 'ALL' | Order['status']; label: string }> = [
  { value: 'ALL', label: 'كل الطلبات' },
  { value: 'PENDING', label: 'جديد' },
  { value: 'CONFIRMED', label: 'مؤكد' },
  { value: 'PACKED', label: 'قيد التجهيز' },
  { value: 'SHIPPED', label: 'مع الموصل' },
  { value: 'DELIVERED', label: 'تم التسليم' },
  { value: 'CANCELED', label: 'ملغي' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<'ALL' | Order['status']>('ALL');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOrders({ limit: 100, status: status === 'ALL' ? undefined : status, search: query.trim() || undefined });
      setOrders(result.items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  }, [query, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadOrders(), query.trim() ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [loadOrders, query]);

  const stats = useMemo(() => ({
    active: orders.filter((order) => ['PENDING', 'CONFIRMED', 'PACKED'].includes(order.status)).length,
    delivery: orders.filter((order) => order.status === 'SHIPPED').length,
    delivered: orders.filter((order) => order.status === 'DELIVERED').length,
  }), [orders]);

  const changeStatus = async (order: Order, nextStatus: Order['status']) => {
    if (order.status === nextStatus) return;
    setWorkingId(order.id);
    setError(null);
    try {
      await updateOrderStatus(order.id, nextStatus);
      await loadOrders();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'تعذر تحديث حالة الطلب');
    } finally {
      setWorkingId(null);
    }
  };

  if (loading && orders.length === 0) return <PageLoader />;

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold text-emerald-700">تشغيل المتجر</p><h1 className="mt-2 text-3xl font-black [color:var(--gs-foreground)]">إدارة الطلبات</h1><p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">من الطلب الجديد حتى التسليم، في قائمة واحدة واضحة لفريق العمل.</p></div>
        <button type="button" onClick={() => void loadOrders()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-surface)] px-4 py-2.5 text-sm font-bold"><RefreshCw className="h-4 w-4" /> تحديث</button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3"><OrderStat icon={Clock3} label="تحتاج معالجة" value={String(stats.active)} tone="amber" /><OrderStat icon={Truck} label="مع الموصل" value={String(stats.delivery)} tone="blue" /><OrderStat icon={PackageCheck} label="تم التسليم" value={String(stats.delivered)} tone="green" /></div>
      {error && <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}

      <section className="overflow-hidden rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[var(--gs-border)] p-4 sm:flex-row"><label className="relative flex-1"><Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 [color:var(--gs-foreground-secondary)]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث برقم الطلب أو اسم العميل..." className="w-full rounded-xl border border-[var(--gs-border)] bg-transparent py-3 pr-10 pl-4 text-sm outline-none focus:border-emerald-500" /></label><select value={status} onChange={(event) => setStatus(event.target.value as 'ALL' | Order['status'])} className="rounded-xl border border-[var(--gs-border)] bg-transparent px-3 py-2.5 text-sm font-bold outline-none focus:border-emerald-500">{ORDER_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
        {orders.length === 0 ? <div className="p-12 text-center text-sm [color:var(--gs-foreground-secondary)]">لا توجد طلبات مطابقة.</div> : <div className="divide-y divide-[var(--gs-border)]">{orders.map((order) => <OrderRow key={order.id} order={order} working={workingId === order.id} onStatusChange={(nextStatus) => void changeStatus(order, nextStatus)} />)}</div>}
      </section>
    </div>
  );
}

function OrderRow({ order, working, onStatusChange }: { order: Order; working: boolean; onStatusChange: (status: Order['status']) => void }) {
  return <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6"><div className="flex min-w-0 flex-1 items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700"><ShoppingBag className="h-5 w-5" /></div><div className="min-w-0"><p className="font-black [color:var(--gs-foreground)]">{order.code}</p><p className="mt-1 truncate text-xs [color:var(--gs-foreground-secondary)]">{order.customer?.fullName || 'عميل المتجر'}{order.customer?.phone ? ` • ${order.customer.phone}` : ''}</p></div></div><div className="flex items-center justify-between gap-4 sm:justify-end"><div className="text-left"><p className="font-black text-emerald-700">{formatPrice(order.total, order.currency === 'YER' ? 'ar-YE' : 'en-US')}</p><p className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">{formatDate(order.createdAt)}</p></div><select disabled={working} value={order.status} onChange={(event) => onStatusChange(event.target.value as Order['status'])} className="rounded-xl border border-[var(--gs-border)] bg-transparent px-3 py-2 text-xs font-bold outline-none focus:border-emerald-500">{ORDER_STATUSES.filter((item) => item.value !== 'ALL').map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><ChevronLeft className="hidden h-5 w-5 [color:var(--gs-foreground-secondary)] sm:block" /></div></div>;
}

function OrderStat({ icon: Icon, label, value, tone }: { icon: typeof Clock3; label: string; value: string; tone: 'amber' | 'blue' | 'green' }) {
  const colors = { amber: 'bg-amber-500/10 text-amber-700', blue: 'bg-blue-500/10 text-blue-700', green: 'bg-emerald-500/10 text-emerald-700' };
  return <div className="rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold [color:var(--gs-foreground-secondary)]">{label}</span><span className={`rounded-xl p-2 ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-xl font-black [color:var(--gs-foreground)]">{value}</p></div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ar-YE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function PageLoader() {
  return <div className="flex min-h-[45vh] items-center justify-center" dir="rtl"><div className="flex items-center gap-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] px-5 py-4 text-sm font-bold [color:var(--gs-foreground-secondary)]"><Loader2 className="h-5 w-5 animate-spin text-emerald-700" />جارٍ تحميل الطلبات...</div></div>;
}
