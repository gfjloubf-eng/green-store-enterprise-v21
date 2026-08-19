import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ChevronLeft, Loader2, Phone, RefreshCw, Search, ShoppingBag, UserRound, Users } from 'lucide-react';
import { getCustomerById, getCustomerOrders, getCustomers, type Customer } from '@/services/customerClient';
import type { Order } from '@/services/orderClient';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';

export default function AdminCustomersPage() {
  const { customerId } = useParams<{ customerId?: string }>();
  return customerId ? <CustomerDetails customerId={customerId} /> : <CustomerDirectory />;
}

function CustomerDirectory() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCustomers(await getCustomers());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل العملاء');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Data loading is the external synchronization this effect is responsible for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCustomers();
  }, [loadCustomers]);

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return customers;
    return customers.filter((customer) => [customer.fullName, customer.phone, customer.email].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedQuery)));
  }, [customers, query]);

  if (loading) return <PageLoader text="جارٍ تحميل ملفات العملاء..." />;

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold text-emerald-700">خدمة العملاء</p>
          <h1 className="mt-2 text-3xl font-black [color:var(--gs-foreground)]">دليل العملاء</h1>
          <p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">ملف موحد لكل عميل مع عدد الطلبات وآخر تواصل وقيمة المشتريات.</p>
        </div>
        <button type="button" onClick={() => void loadCustomers()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-surface)] px-4 py-2.5 text-sm font-bold [color:var(--gs-foreground)] transition hover:border-emerald-500/50">
          <RefreshCw className="h-4 w-4" /> تحديث
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <DirectoryStat icon={Users} label="إجمالي العملاء" value={String(customers.length)} />
        <DirectoryStat icon={ShoppingBag} label="عملاء متكررون" value={String(customers.filter((customer) => customer.totalOrders > 1).length)} />
        <DirectoryStat icon={UserRound} label="بحاجة لبيانات" value={String(customers.filter((customer) => !customer.phone && !customer.email).length)} />
      </div>

      {error && <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}

      <div className="overflow-hidden rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-sm">
        <div className="border-b border-[var(--gs-border)] p-4 sm:p-5">
          <label className="relative block">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 [color:var(--gs-foreground-secondary)]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بالاسم أو الهاتف أو البريد..." className="w-full rounded-xl border border-[var(--gs-border)] bg-transparent py-3 pr-10 pl-4 text-sm outline-none transition focus:border-emerald-500" />
          </label>
        </div>
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-sm [color:var(--gs-foreground-secondary)]">لا توجد نتائج مطابقة.</div>
        ) : (
          <div className="divide-y divide-[var(--gs-border)]">
            {filteredCustomers.map((customer) => (
              <button key={customer.id} type="button" onClick={() => navigate(`/admin/customers/${customer.id}`)} className="flex w-full items-center gap-3 px-4 py-4 text-right transition hover:bg-emerald-500/[0.04] sm:px-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 font-black text-emerald-700">{customer.fullName.slice(0, 1)}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold [color:var(--gs-foreground)]">{customer.fullName}</p>
                  <p className="mt-1 truncate text-xs [color:var(--gs-foreground-secondary)]">{customer.phone || customer.email || 'لا توجد وسيلة تواصل مسجلة'}</p>
                </div>
                <div className="hidden text-left sm:block">
                  <p className="font-bold [color:var(--gs-foreground)]">{customer.totalOrders} طلب</p>
                  <p className="mt-1 text-xs text-emerald-700">{formatPrice(customer.totalSpent, 'ar-YE')}</p>
                </div>
                <ChevronLeft className="h-5 w-5 shrink-0 [color:var(--gs-foreground-secondary)]" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CustomerDetails({ customerId }: { customerId: string }) {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomer = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [customerData, orderData] = await Promise.all([getCustomerById(customerId), getCustomerOrders(customerId)]);
      setCustomer(customerData);
      setOrders(orderData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل ملف العميل');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    // Detail loading is the external synchronization this effect is responsible for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCustomer();
  }, [loadCustomer]);

  if (loading) return <PageLoader text="جارٍ تحميل ملف العميل..." />;
  if (!customer) return <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-700" dir="rtl">{error || 'العميل غير موجود.'}</div>;

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      <button type="button" onClick={() => navigate('/admin/customers')} className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:underline"><ArrowRight className="h-4 w-4" /> العودة إلى دليل العملاء</button>
      <section className="rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl font-black text-emerald-700">{customer.fullName.slice(0, 1)}</div>
          <div className="flex-1">
            <p className="text-xs font-bold text-emerald-700">ملف العميل</p>
            <h1 className="mt-1 text-2xl font-black [color:var(--gs-foreground)]">{customer.fullName}</h1>
            <div className="mt-3 flex flex-wrap gap-3 text-xs [color:var(--gs-foreground-secondary)]">
              {customer.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{customer.phone}</span>}
              {customer.email && <span>{customer.email}</span>}
            </div>
          </div>
          <button type="button" onClick={() => void loadCustomer()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--gs-border)] px-4 py-2 text-sm font-bold"><RefreshCw className="h-4 w-4" /> تحديث</button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <DirectoryStat icon={ShoppingBag} label="عدد الطلبات" value={String(customer.totalOrders)} />
        <DirectoryStat icon={UserRound} label="إجمالي المشتريات" value={formatPrice(customer.totalSpent, locale)} />
        <DirectoryStat icon={Phone} label="آخر طلب" value={customer.lastOrderAt ? new Intl.DateTimeFormat('ar-YE', { day: 'numeric', month: 'short' }).format(new Date(customer.lastOrderAt)) : 'لا يوجد'} />
      </div>

      <section className="overflow-hidden rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-sm">
        <div className="border-b border-[var(--gs-border)] px-5 py-4"><h2 className="font-black [color:var(--gs-foreground)]">سجل الطلبات</h2></div>
        {orders.length === 0 ? <div className="p-10 text-center text-sm [color:var(--gs-foreground-secondary)]">لا توجد طلبات مرتبطة بهذا العميل.</div> : <div className="divide-y divide-[var(--gs-border)]">{orders.map((order) => <button key={order.id} type="button" onClick={() => navigate(`/orders/${order.id}`)} className="flex w-full items-center gap-3 px-5 py-4 text-right transition hover:bg-emerald-500/[0.04]"><ShoppingBag className="h-5 w-5 text-emerald-700" /><span className="flex-1 font-bold [color:var(--gs-foreground)]">{order.code}<span className="mr-2 text-xs font-normal [color:var(--gs-foreground-secondary)]">{order.status}</span></span><span className="font-bold text-emerald-700">{formatPrice(order.total, locale)}</span><ChevronLeft className="h-4 w-4 [color:var(--gs-foreground-secondary)]" /></button>)}</div>}
      </section>
    </div>
  );
}

function DirectoryStat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return <div className="rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold [color:var(--gs-foreground-secondary)]">{label}</span><Icon className="h-4 w-4 text-emerald-700" /></div><p className="mt-3 text-xl font-black [color:var(--gs-foreground)]">{value}</p></div>;
}

function PageLoader({ text }: { text: string }) {
  return <div className="flex min-h-[45vh] items-center justify-center" dir="rtl"><div className="flex items-center gap-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] px-5 py-4 text-sm font-bold [color:var(--gs-foreground-secondary)]"><Loader2 className="h-5 w-5 animate-spin text-emerald-700" />{text}</div></div>;
}
