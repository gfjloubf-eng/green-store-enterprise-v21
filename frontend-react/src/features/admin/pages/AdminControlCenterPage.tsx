import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  ChevronLeft,
  CircleCheck,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRoundCheck,
  Users,
} from 'lucide-react';
import { getCustomers, type Customer } from '@/services/customerClient';
import { getOrders, type Order } from '@/services/orderClient';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';

const ACTIVE_ORDER_STATUSES = new Set<Order['status']>(['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED']);

const statusLabels: Record<Order['status'], string> = {
  DRAFT: 'مسودة',
  PENDING: 'جديد',
  CONFIRMED: 'مؤكد',
  PACKED: 'قيد التجهيز',
  SHIPPED: 'مع الموصل',
  DELIVERED: 'تم التسليم',
  CANCELED: 'ملغي',
  RETURNED: 'مرتجع',
  REFUNDED: 'مسترد',
};

const statusStyles: Record<Order['status'], string> = {
  DRAFT: 'bg-slate-500/10 text-slate-600',
  PENDING: 'bg-amber-500/10 text-amber-700',
  CONFIRMED: 'bg-blue-500/10 text-blue-700',
  PACKED: 'bg-violet-500/10 text-violet-700',
  SHIPPED: 'bg-cyan-500/10 text-cyan-700',
  DELIVERED: 'bg-emerald-500/10 text-emerald-700',
  CANCELED: 'bg-rose-500/10 text-rose-700',
  RETURNED: 'bg-orange-500/10 text-orange-700',
  REFUNDED: 'bg-slate-500/10 text-slate-700',
};

function formatDate(value: string | null | undefined): string {
  if (!value) return 'غير متوفر';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'غير متوفر';
  return new Intl.DateTimeFormat('ar-YE', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function AdminControlCenterPage() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [ordersResponse, customerRows] = await Promise.all([
        getOrders({ page: 1, limit: 100 }),
        getCustomers(),
      ]);
      setOrders(ordersResponse.items);
      setCustomers(customerRows);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل بيانات مركز الإدارة');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Data loading is the external synchronization this effect is responsible for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDashboard();
  }, [loadDashboard]);

  const metrics = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + (order.status === 'CANCELED' ? 0 : order.total), 0);
    const activeOrders = orders.filter((order) => ACTIVE_ORDER_STATUSES.has(order.status));
    const deliveredOrders = orders.filter((order) => order.status === 'DELIVERED');
    const followUpOrders = orders.filter((order) => order.status === 'PENDING' || order.status === 'SHIPPED');

    return {
      revenue,
      activeOrders,
      deliveredOrders,
      followUpOrders,
    };
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  }, [orders]);

  const priorityCustomers = useMemo(() => {
    return [...customers].sort((a, b) => {
      if (b.totalOrders !== a.totalOrders) return b.totalOrders - a.totalOrders;
      return b.totalSpent - a.totalSpent;
    }).slice(0, 5);
  }, [customers]);

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center" dir="rtl">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] px-5 py-4 text-sm font-semibold [color:var(--gs-foreground-secondary)] shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          جارٍ تجهيز مركز الإدارة...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-emerald-50">
              <ShieldCheck className="h-4 w-4" />
              مركز تشغيل قطوف الطبيعة
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-4xl">القرارات المهمة في شاشة واحدة</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-50/80 sm:text-base">
              تابع الطلبات والعملاء وحركة التشغيل من لوحة آمنة مصممة لفريق المتجر، مع إبقاء المتجر العام وتجربة العميل مستقرة.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void loadDashboard(true)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/20 disabled:opacity-60">
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              تحديث البيانات
            </button>
            <button type="button" onClick={() => navigate('/orders')} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50">
              فتح الطلبات
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => void loadDashboard(true)} className="inline-flex items-center gap-1 font-bold underline underline-offset-4">
            إعادة المحاولة
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="مؤشرات التشغيل">
        <MetricCard icon={ShoppingBag} label="إجمالي المبيعات" value={formatPrice(metrics.revenue, locale)} hint={`${orders.length} طلب مسجل`} tone="emerald" />
        <MetricCard icon={Clock3} label="طلبات تحتاج متابعة" value={String(metrics.followUpOrders.length)} hint="جديد أو مع الموصل" tone="amber" />
        <MetricCard icon={CircleCheck} label="تم التسليم" value={String(metrics.deliveredOrders.length)} hint="طلبات مكتملة" tone="blue" />
        <MetricCard icon={Users} label="قاعدة العملاء" value={String(customers.length)} hint="ملفات قابلة للمتابعة" tone="violet" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--gs-border)] px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-black [color:var(--gs-foreground)]">آخر الطلبات</h2>
              <p className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">مراقبة سريعة لحركة المتجر</p>
            </div>
            <button type="button" onClick={() => navigate('/orders')} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline">
              كل الطلبات
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="لا توجد طلبات بعد" description="ستظهر الطلبات هنا فور وصولها إلى النظام." />
          ) : (
            <div className="divide-y divide-[var(--gs-border)]">
              {recentOrders.map((order) => (
                <button key={order.id} type="button" onClick={() => navigate(`/orders/${order.id}`)} className="flex w-full items-center gap-3 px-5 py-4 text-right transition hover:bg-emerald-500/[0.04] sm:px-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold [color:var(--gs-foreground)]">{order.code}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${statusStyles[order.status]}`}>{statusLabels[order.status]}</span>
                    </div>
                    <p className="mt-1 truncate text-xs [color:var(--gs-foreground-secondary)]">{order.customer?.fullName || 'عميل المتجر'} · {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="font-black text-emerald-700">{formatPrice(order.total, locale)}</p>
                    <p className="mt-1 text-[11px] [color:var(--gs-foreground-secondary)]">{order.items.length} منتجات</p>
                  </div>
                  <ChevronLeft className="h-5 w-5 shrink-0 [color:var(--gs-foreground-secondary)]" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-sm">
          <div className="flex items-center justify-between border-b border-[var(--gs-border)] px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-black [color:var(--gs-foreground)]">العملاء المهمون</h2>
              <p className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">ترتيب حسب التكرار والإنفاق</p>
            </div>
            <button type="button" onClick={() => navigate('/admin/customers')} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline">
              إدارة العملاء
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
          {priorityCustomers.length === 0 ? (
            <EmptyState icon={Users} title="لا توجد ملفات عملاء" description="ستظهر بيانات العملاء بعد تسجيل الطلبات أو إنشاء الحسابات." />
          ) : (
            <div className="divide-y divide-[var(--gs-border)]">
              {priorityCustomers.map((customer) => (
                <button key={customer.id} type="button" onClick={() => navigate(`/admin/customers/${customer.id}`)} className="flex w-full items-center gap-3 px-5 py-4 text-right transition hover:bg-emerald-500/[0.04] sm:px-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-sm font-black text-violet-700">{customer.fullName.slice(0, 1)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold [color:var(--gs-foreground)]">{customer.fullName}</p>
                    <p className="mt-1 truncate text-xs [color:var(--gs-foreground-secondary)]">{customer.phone || customer.email || 'بيانات التواصل غير مكتملة'}</p>
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="font-black [color:var(--gs-foreground)]">{customer.totalOrders} طلب</p>
                    <p className="mt-1 text-[11px] text-emerald-700">{formatPrice(customer.totalSpent, locale)}</p>
                  </div>
                  <ChevronLeft className="h-5 w-5 shrink-0 [color:var(--gs-foreground-secondary)]" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="الوصول السريع">
        <QuickAction icon={Search} title="البحث عن عميل" description="افتح ملفات العملاء وسجل الطلبات" onClick={() => navigate('/admin/customers')} />
        <QuickAction icon={Truck} title="متابعة التوصيل" description="راجع الطلبات التي مع الموصل" onClick={() => navigate('/admin/drivers')} />
        <QuickAction icon={Boxes} title="الموردون والمخزون" description="تابع التوريد والكميات" onClick={() => navigate('/admin/suppliers')} />
        <QuickAction icon={UserRoundCheck} title="فريق العمل" description="إدارة المستخدمين والأدوار" onClick={() => navigate('/admin/users')} />
      </section>

      {metrics.activeOrders.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p><strong>{metrics.activeOrders.length} طلب نشط</strong> يحتاج إلى متابعة ضمن دورة التجهيز أو التوصيل.</p>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, hint, tone }: { icon: typeof Users; label: string; value: string; hint: string; tone: 'emerald' | 'amber' | 'blue' | 'violet' }) {
  const tones = {
    emerald: 'bg-emerald-500/10 text-emerald-700',
    amber: 'bg-amber-500/10 text-amber-700',
    blue: 'bg-blue-500/10 text-blue-700',
    violet: 'bg-violet-500/10 text-violet-700',
  };

  return (
    <div className="rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold [color:var(--gs-foreground-secondary)]">{label}</p>
          <p className="mt-3 text-2xl font-black [color:var(--gs-foreground)]">{value}</p>
          <p className="mt-2 text-xs [color:var(--gs-foreground-secondary)]">{hint}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}><Icon className="h-5 w-5" /></div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, description, onClick }: { icon: typeof Search; title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-5 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white"><Icon className="h-5 w-5" /></div>
      <p className="font-black [color:var(--gs-foreground)]">{title}</p>
      <p className="mt-1 text-xs leading-6 [color:var(--gs-foreground-secondary)]">{description}</p>
    </button>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: typeof Users; title: string; description: string }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-500/10 text-slate-500"><Icon className="h-6 w-6" /></div>
      <p className="mt-3 font-bold [color:var(--gs-foreground)]">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-6 [color:var(--gs-foreground-secondary)]">{description}</p>
    </div>
  );
}
