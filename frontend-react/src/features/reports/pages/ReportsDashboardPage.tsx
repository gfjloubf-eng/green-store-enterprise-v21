import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ShoppingBag, Users, AlertTriangle, ShieldCheck, Download, Calendar, Search } from 'lucide-react';
import { getDashboardKpis, getSalesReport, getProductAnalytics, getInventoryAnalytics } from '@/services/reportsClient';
import type { DashboardKpis } from '@/services/reportsClient';
import { getAuditLogs } from '@/services/auditClient';
import type { AuditLogItem } from '@/services/auditClient';

export function ReportsDashboardPage() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [activeTab, setActiveTab] = useState<'SALES' | 'PRODUCTS' | 'INVENTORY' | 'AUDIT'>('SALES');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sales State
  const [salesData, setSalesData] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Products & Inventory State
  const [productData, setProductData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);

  // Audit State
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [auditSearch, setAuditSearch] = useState('');

  useEffect(() => {
    Promise.all([
      getDashboardKpis(),
      getSalesReport(),
      getProductAnalytics(),
      getInventoryAnalytics(),
      getAuditLogs(),
    ])
      .then(([kRes, sRes, pRes, iRes, aRes]) => {
        setKpis(kRes);
        setSalesData(sRes);
        setProductData(pRes);
        setInventoryData(iRes);
        setAuditLogs(aRes?.items || []);
      })
      .catch((err) => setError(err?.message || 'تعذر تحميل بيانات التقارير والتحليلات'))
      .finally(() => setLoading(false));
  }, []);

  const handleFilterSales = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await getSalesReport({ startDate, endDate });
      setSalesData(data);
    } catch (err: any) {
      setError(err?.message || 'فشل تصفية المبيعات');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (!salesData?.recentOrders) return;
    const headers = ['رقم الطلب', 'اسم العميل', 'الحالة', 'الإجمالي (ر.ي)', 'التاريخ'];
    const rows = salesData.recentOrders.map((o: any) => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.status,
      o.total,
      new Date(o.createdAt).toLocaleDateString('ar-YE'),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !kpis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3" dir="rtl">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
        <span className="text-sm font-medium text-[var(--gs-foreground-secondary)]">جاري جلب التقارير وسجلات التدقيق...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
            التقارير والتحليلات وسجل التدقيق (Reports, Analytics & Audit)
          </h1>
          <p className="text-xs text-[var(--gs-foreground-secondary)] mt-1">
            متابعة إحصائيات المبيعات، أداء المنتجات، المخزون، وسجلات أفعال المستخدمين في النظام.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="gsd-btn gsd-btn--primary gsd-btn--md rounded-2xl px-5 py-2.5 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          تصدير تقرير المبيعات (CSV)
        </button>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-600">
          {error}
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[var(--gs-foreground-secondary)] font-medium">إجمالي الإيرادات</span>
            <strong className="text-xl font-bold text-emerald-600 block mt-1">
              {(kpis?.totalRevenue ?? 0).toLocaleString()} <span className="text-xs font-normal">ر.ي</span>
            </strong>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[var(--gs-foreground-secondary)] font-medium">إجمالي الطلبات</span>
            <strong className="text-xl font-bold text-[var(--gs-foreground)] block mt-1">
              {kpis?.totalOrders ?? 0}
            </strong>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[var(--gs-foreground-secondary)] font-medium">العملاء المسجلون</span>
            <strong className="text-xl font-bold text-[var(--gs-foreground)] block mt-1">
              {kpis?.totalCustomers ?? 0}
            </strong>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[var(--gs-foreground-secondary)] font-medium">منتجات منخفضة المخزون</span>
            <strong className="text-xl font-bold text-amber-600 block mt-1">
              {kpis?.lowStockProducts ?? 0}
            </strong>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--gs-border)] pb-2 overflow-x-auto">
        {[
          { id: 'SALES', label: 'تقرير المبيعات والطلبات', icon: TrendingUp },
          { id: 'PRODUCTS', label: 'تحليلات أداء المنتجات', icon: ShoppingBag },
          { id: 'INVENTORY', label: 'تحليلات حركات المخزون', icon: AlertTriangle },
          { id: 'AUDIT', label: 'سجل التدقيق الأمني (Audit Logs)', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--gs-surface)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)] border border-[var(--gs-border)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sales Tab */}
      {activeTab === 'SALES' && (
        <div className="space-y-6">
          {/* Date Filter Bar */}
          <form onSubmit={handleFilterSales} className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <span className="font-bold">تصفية حسب التاريخ:</span>
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)]"
            />
            <span>إلى</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)]"
            />
            <button type="submit" className="gsd-btn gsd-btn--primary px-4 py-2 rounded-xl font-semibold">
              تطبيق التصفية
            </button>
          </form>

          {/* Sales Stats Summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] text-xs">
              <span className="text-[var(--gs-foreground-secondary)]">عدد الطلبات المنفذة</span>
              <strong className="text-lg font-bold block text-[var(--gs-foreground)] mt-1">{salesData?.totalOrders ?? 0}</strong>
            </div>
            <div className="p-4 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] text-xs">
              <span className="text-[var(--gs-foreground-secondary)]">إجمالي المبيعات</span>
              <strong className="text-lg font-bold block text-emerald-600 mt-1">{(salesData?.totalRevenue ?? 0).toLocaleString()} ر.ي</strong>
            </div>
            <div className="p-4 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] text-xs">
              <span className="text-[var(--gs-foreground-secondary)]">متوسط قيمة الطلب (AOV)</span>
              <strong className="text-lg font-bold block text-[var(--gs-foreground)] mt-1">{salesData?.averageOrderValue ?? 0} ر.ي</strong>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="gsd-card rounded-3xl p-6 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
            <h3 className="font-bold text-xs text-[var(--gs-foreground)]">قائمة أحدث الطلبات والعمليات</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-[var(--gs-border)] text-[var(--gs-foreground-secondary)]">
                    <th className="py-2.5 px-3">رقم الطلب</th>
                    <th className="py-2.5 px-3">العميل</th>
                    <th className="py-2.5 px-3">الحالة</th>
                    <th className="py-2.5 px-3">المبلغ</th>
                    <th className="py-2.5 px-3">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--gs-border)]">
                  {salesData?.recentOrders?.map((o: any) => (
                    <tr key={o.id} className="hover:bg-[var(--gs-muted)]">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600">{o.orderNumber}</td>
                      <td className="py-3 px-3">{o.customerName}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold">{o.total} ر.ي</td>
                      <td className="py-3 px-3 text-[var(--gs-foreground-secondary)]">{new Date(o.createdAt).toLocaleDateString('ar-YE')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product Analytics Tab */}
      {activeTab === 'PRODUCTS' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Best Sellers */}
          <div className="gsd-card rounded-3xl p-6 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
            <h3 className="font-bold text-xs text-[var(--gs-foreground)]">أكثر المنتجات مبيعاً (Best Sellers)</h3>
            <div className="space-y-3">
              {productData?.bestSellers?.map((p: any) => (
                <div key={p.id} className="p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] flex items-center justify-between text-xs">
                  <div>
                    <strong className="block text-[var(--gs-foreground)]">{p.name}</strong>
                    <span className="text-[10px] text-[var(--gs-foreground-secondary)] font-mono">{p.sku}</span>
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-emerald-600 block">{p.totalQuantitySold} وحدة</span>
                    <span className="text-[10px] text-[var(--gs-foreground-secondary)]">{p.totalRevenue} ر.ي</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Warning */}
          <div className="gsd-card rounded-3xl p-6 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
            <h3 className="font-bold text-xs text-amber-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              تنبيهات المخزون المنخفض ({productData?.lowStockCount ?? 0})
            </h3>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {productData?.lowStockList?.map((item: any) => (
                <div key={item.id} className="p-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-xs flex items-center justify-between">
                  <strong className="text-[var(--gs-foreground)]">{item.productName}</strong>
                  <span className="font-bold text-amber-600">المتبقي: {item.available} / الأمان: {item.safetyStock}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'INVENTORY' && (
        <div className="gsd-card rounded-3xl p-6 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[var(--gs-foreground)]">تحليلات وإجمالي قطع المخزون</h3>
            <span className="text-xs font-bold text-emerald-600">إجمالي الوحدات: {inventoryData?.totalUnits ?? 0}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b border-[var(--gs-border)] text-[var(--gs-foreground-secondary)]">
                  <th className="py-2.5 px-3">المنتج</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">الكمية الإجمالية</th>
                  <th className="py-2.5 px-3">المحجوز</th>
                  <th className="py-2.5 px-3">المتاح للبيع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gs-border)]">
                {inventoryData?.items?.map((i: any) => (
                  <tr key={i.id} className="hover:bg-[var(--gs-muted)]">
                    <td className="py-3 px-3 font-bold">{i.productName}</td>
                    <td className="py-3 px-3 font-mono text-[var(--gs-foreground-secondary)]">{i.sku}</td>
                    <td className="py-3 px-3">{i.quantity}</td>
                    <td className="py-3 px-3 text-amber-600 font-semibold">{i.reserved}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{i.available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'AUDIT' && (
        <div className="gsd-card rounded-3xl p-6 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-xs text-[var(--gs-foreground)] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              سجل التدقيق الأمني للأفعال (Append-Only Audit Trail)
            </h3>
            <div className="relative max-w-xs w-full">
              <Search className="h-3.5 w-3.5 text-[var(--gs-foreground-secondary)] absolute right-3 top-3" />
              <input
                type="text"
                placeholder="بحث في سجلات التدقيق..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pr-8 pl-3 py-2 text-xs rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b border-[var(--gs-border)] text-[var(--gs-foreground-secondary)]">
                  <th className="py-2.5 px-3">الفاعل (Actor)</th>
                  <th className="py-2.5 px-3">الحدث (Action)</th>
                  <th className="py-2.5 px-3">المورد (Resource)</th>
                  <th className="py-2.5 px-3">عنوان IP</th>
                  <th className="py-2.5 px-3">التاريخ والوقت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gs-border)]">
                {auditLogs
                  .filter((a) => !auditSearch || a.action.toLowerCase().includes(auditSearch.toLowerCase()) || a.resource.toLowerCase().includes(auditSearch.toLowerCase()))
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-[var(--gs-muted)]">
                      <td className="py-3 px-3 font-bold">{log.actorName}</td>
                      <td className="py-3 px-3 font-mono text-emerald-600 font-semibold">{log.action}</td>
                      <td className="py-3 px-3 font-mono">{log.resource}</td>
                      <td className="py-3 px-3 text-[var(--gs-foreground-secondary)] font-mono">{log.ipAddress || '127.0.0.1'}</td>
                      <td className="py-3 px-3 text-[var(--gs-foreground-secondary)]">{new Date(log.createdAt).toLocaleString('ar-YE')}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsDashboardPage;
