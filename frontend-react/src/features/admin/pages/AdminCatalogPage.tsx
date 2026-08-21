import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpenCheck,
  Boxes,
  CheckCircle2,
  ImagePlus,
  PackagePlus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Upload,
} from 'lucide-react';
import { getInventory, type InventoryItem } from '@/services/inventoryClient';

function stockTone(item: InventoryItem): string {
  if (item.isOutOfStock || item.availableQuantity <= 0) return 'text-rose-700 bg-rose-500/10';
  if (item.isLowStock) return 'text-amber-700 bg-amber-500/10';
  return 'text-emerald-700 bg-emerald-500/10';
}

function stockLabel(item: InventoryItem): string {
  if (item.isOutOfStock || item.availableQuantity <= 0) return 'نفد المخزون';
  if (item.isLowStock) return 'مخزون منخفض';
  return 'متوفر';
}

export default function AdminCatalogPage() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const canCreateProducts = hasPermission('products:create');
  const canUpdateInventory = hasPermission('inventory:update');
  const canReadEducationAdmin = hasPermission('products:update');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadInventory = useCallback(async (refresh = false) => {
    setError('');
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      const result = await getInventory({ page: 1, limit: 100, search: search.trim() || undefined });
      setItems(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل المخزون الحقيقي');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadInventory(), 250);
    return () => window.clearTimeout(timer);
  }, [loadInventory]);

  const metrics = useMemo(() => ({
    total: items.length,
    available: items.filter((item) => !item.isOutOfStock && item.availableQuantity > 0).length,
    low: items.filter((item) => item.isLowStock && !item.isOutOfStock).length,
    out: items.filter((item) => item.isOutOfStock || item.availableQuantity <= 0).length,
  }), [items]);

  return (
    <main dir="rtl" className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-emerald-900/10 bg-white/90 p-5 shadow-sm dark:bg-slate-900/90 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> بيانات تشغيلية حقيقية
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">كتالوج المنتجات والمخزون</h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            هنا تدير المنتجات التي يبيعها المتجر وكمياتها الفعلية. أما الشروحات والفوائد والمصادر فتدار منفصلة في مركز الإرشادات.
          </p>
        </div>
        <button type="button" onClick={() => void loadInventory(true)} disabled={refreshing} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-60">
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> تحديث البيانات
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="ملخص المخزون">
        {[
          { label: 'أصناف مرتبطة بالمخزون', value: metrics.total, icon: Boxes, tone: 'text-slate-700 bg-slate-500/10' },
          { label: 'متوفر للبيع', value: metrics.available, icon: CheckCircle2, tone: 'text-emerald-700 bg-emerald-500/10' },
          { label: 'منخفض', value: metrics.low, icon: AlertTriangle, tone: 'text-amber-700 bg-amber-500/10' },
          { label: 'نافد', value: metrics.out, icon: PackagePlus, tone: 'text-rose-700 bg-rose-500/10' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-900/10 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <div className={`mb-3 inline-flex rounded-xl p-2 ${tone}`}><Icon className="h-5 w-5" /></div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.65fr]">
        <div className="rounded-3xl border border-slate-900/10 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">المنتجات والمخزون</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">القائمة مرتبطة بـ `/api/inventory` وليست بيانات تجريبية.</p>
            </div>
            <label className="relative block sm:w-64">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث باسم المنتج" className="min-h-11 w-full rounded-xl border border-slate-900/10 bg-slate-50 py-2 pl-3 pr-9 text-sm outline-none ring-emerald-500 focus:ring-2 dark:border-white/10 dark:bg-slate-800" />
            </label>
          </div>
          {error && <div className="mb-4 rounded-2xl bg-rose-500/10 p-3 text-sm font-semibold text-rose-700" role="alert">{error}</div>}
          {loading ? <div className="py-12 text-center text-sm font-semibold text-slate-500">جارٍ تحميل المخزون...</div> : items.length === 0 ? <div className="py-12 text-center text-sm font-semibold text-slate-500">لا توجد سجلات مخزون مطابقة.</div> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-right text-sm">
                <thead className="border-b border-slate-900/10 text-xs text-slate-500 dark:border-white/10"><tr><th className="px-3 py-3 font-bold">المنتج</th><th className="px-3 py-3 font-bold">المستودع</th><th className="px-3 py-3 font-bold">المتاح</th><th className="px-3 py-3 font-bold">الحالة</th><th className="px-3 py-3" /></tr></thead>
                <tbody>{items.map((item) => <tr key={item.id} className="border-b border-slate-900/5 last:border-0 dark:border-white/5"><td className="px-3 py-3 font-bold text-slate-800 dark:text-white">{item.product?.name || 'منتج غير مسمى'}<span className="mt-1 block text-xs font-normal text-slate-500">{item.product?.sku || 'بدون SKU'}</span></td><td className="px-3 py-3 text-slate-600 dark:text-slate-300">{item.warehouse?.name || 'المستودع الرئيسي'}</td><td className="px-3 py-3 font-black text-slate-800 dark:text-white">{item.availableQuantity}</td><td className="px-3 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${stockTone(item)}`}>{stockLabel(item)}</span></td><td className="px-3 py-3 text-left">{canUpdateInventory ? <button type="button" onClick={() => navigate(`/inventory/adjustment?productId=${encodeURIComponent(item.productId)}`)} className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-500/10">تعديل <ArrowLeft className="h-3 w-3" /></button> : <span className="text-xs text-slate-400">قراءة فقط</span>}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-emerald-950 p-5 text-white">
            <div className="mb-3 flex items-center gap-2"><Upload className="h-5 w-5 text-emerald-300" /><h2 className="font-black">إضافة منتج حقيقي</h2></div>
            <p className="mb-5 text-sm leading-6 text-emerald-100">أدخل الاسم العربي الصحيح، المفتاح الثابت، السعر، الوحدة، والصورة الخاصة بالصنف. الصورة تضغط داخل المتصفح قبل الإرسال.</p>
            {canCreateProducts ? <button type="button" onClick={() => navigate('/products/create')} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-black text-emerald-950 hover:bg-emerald-50"><ImagePlus className="h-4 w-4" /> رفع منتج وصورته</button> : <p className="rounded-2xl bg-white/10 px-3 py-3 text-xs font-bold text-emerald-100">تحتاج صلاحية إنشاء المنتجات لرفع صنف جديد.</p>}
          </div>
          <div className="rounded-3xl border border-slate-900/10 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
            <h2 className="mb-3 flex items-center gap-2 font-black text-slate-900 dark:text-white"><SlidersHorizontal className="h-5 w-5 text-emerald-700" /> مسارات الإدارة</h2>
            <div className="space-y-2"><button type="button" onClick={() => navigate('/inventory')} className="flex min-h-11 w-full items-center justify-between rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 hover:bg-emerald-500/10 dark:bg-slate-800 dark:text-slate-200">لوحة المخزون <ArrowLeft className="h-4 w-4" /></button>{canReadEducationAdmin && <button type="button" onClick={() => navigate('/admin/education/articles')} className="flex min-h-11 w-full items-center justify-between rounded-xl bg-slate-50 px-3 text-sm font-bold text-slate-700 hover:bg-emerald-500/10 dark:bg-slate-800 dark:text-slate-200">مقالات الإرشادات <BookOpenCheck className="h-4 w-4" /></button>}</div>
          </div>
        </aside>
      </section>
    </main>
  );
}
