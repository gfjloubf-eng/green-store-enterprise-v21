import { useState, useEffect, useCallback } from 'react';
import { Warehouse, Search, AlertCircle, CheckCircle2, History, AlertTriangle, Layers } from 'lucide-react';
import { getInventory, adjustStock, getStockMovements, type InventoryItem, type StockMovement } from '@/services/inventoryClient';
import { useAuth } from '@/hooks/useAuth';

export function InventoryDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Adjustment Modal State
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT' | 'ADJUSTMENT'>('IN');
  const [adjustQty, setAdjustQty] = useState(10);
  const [adjustReason, setAdjustReason] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  // Movements Audit State
  const [showMovements, setShowMovements] = useState(false);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [movementsLoading, setMovementsLoading] = useState(false);

  const canUpdate =
    user?.role === 'admin' ||
    user?.role === 'ADMIN' ||
    user?.role === 'MANAGER' ||
    (Array.isArray(user?.roles) && user.roles.includes('admin')) ||
    user?.permissions?.some((p: any) => p === 'inventory:update' || p?.action === 'UPDATE' || p === '*');

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInventory({
        page,
        limit: 10,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (err: any) {
      setError(err?.message || 'تعذر تحميل بيانات المستودع والمخزون');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setAdjusting(true);
    setError(null);
    setSuccess(null);
    try {
      await adjustStock({
        productId: selectedItem.productId,
        type: adjustType,
        quantity: Number(adjustQty),
        reason: adjustReason.trim() || undefined,
      });
      setSuccess(`تم تحديث مخزون المنتج (${selectedItem.product?.name || selectedItem.productId}) بنجاح`);
      setSelectedItem(null);
      fetchInventory();
      setTimeout(() => setSuccess(null), 3500);
    } catch (err: any) {
      setError(err?.message || 'فشل تعديل الكمية المتاحة');
    } finally {
      setAdjusting(false);
    }
  };

  const handleViewMovements = async (invId?: string) => {
    setShowMovements(true);
    setMovementsLoading(true);
    try {
      const res = await getStockMovements(invId);
      setMovements(res.movements);
    } catch (err: any) {
      setError(err?.message || 'تعذر تحميل سجل حركة المخزون');
    } finally {
      setMovementsLoading(false);
    }
  };

  // Stats calculation
  const lowStockCount = items.filter((i) => i.isLowStock && !i.isOutOfStock).length;
  const outOfStockCount = items.filter((i) => i.isOutOfStock).length;
  const inStockCount = items.filter((i) => !i.isLowStock && !i.isOutOfStock).length;

  return (
    <div className="flex flex-col gap-6 pb-12" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-3">
            <Warehouse className="h-6 w-6 text-emerald-600" />
            لوحة إدارة المخزون والمستودع (Inventory & Stock)
          </h1>
          <p className="text-xs text-[var(--gs-foreground-secondary)] mt-1">
            متابعة مستويات المخزون الحقيقية، الحجوزات الناتجة عن الطلبات، وتعديل الكميات المتاحة.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleViewMovements()}
          className="gsd-btn gsd-btn--secondary gsd-btn--sm rounded-xl inline-flex items-center gap-2 px-4 py-2 text-xs"
        >
          <History className="h-4 w-4 text-emerald-600" />
          سجل حركات المخزون
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-[var(--gs-foreground-secondary)] block">إجمالي المنتجات بالمستودع</span>
            <strong className="text-lg font-bold [color:var(--gs-foreground)]">{total}</strong>
          </div>
        </div>

        <div className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-[var(--gs-foreground-secondary)] block">متوفر ومستقر (In Stock)</span>
            <strong className="text-lg font-bold text-emerald-600">{inStockCount}</strong>
          </div>
        </div>

        <div className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-[var(--gs-foreground-secondary)] block">مخزون منخفض (Low Stock)</span>
            <strong className="text-lg font-bold text-amber-600">{lowStockCount}</strong>
          </div>
        </div>

        <div className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-[var(--gs-foreground-secondary)] block">منتهي من السجلات (Out of Stock)</span>
            <strong className="text-lg font-bold text-rose-600">{outOfStockCount}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="gsd-card rounded-3xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { key: 'ALL', label: 'جميع السجلات' },
            { key: 'IN_STOCK', label: 'متوفر' },
            { key: 'LOW_STOCK', label: 'منخفض' },
            { key: 'OUT_OF_STOCK', label: 'نفد من المعرض' },
          ].map((st) => (
            <button
              key={st.key}
              type="button"
              onClick={() => {
                setStatusFilter(st.key);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                statusFilter === st.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--gs-background)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={(e) => { e.preventDefault(); fetchInventory(); }} className="relative w-full md:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم المنتج أو SKU..."
            className="gsd-input w-full pr-9 pl-3 py-2 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-xs"
          />
        </form>
      </div>

      {success && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
          <span className="text-sm font-medium text-[var(--gs-foreground-secondary)]">جاري تحميل سجلات المخزون...</span>
        </div>
      ) : (
        <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-[var(--gs-border)] text-[var(--gs-foreground-secondary)]">
                <th className="py-3 px-3">المنتج</th>
                <th className="py-3 px-3">الرمز (SKU)</th>
                <th className="py-3 px-3 text-center">إجمالي المخزون</th>
                <th className="py-3 px-3 text-center">المحجوز للطلبات</th>
                <th className="py-3 px-3 text-center">المتاح للبيع</th>
                <th className="py-3 px-3">الحالة</th>
                <th className="py-3 px-3 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gs-border-subtle)]">
              {items.map((inv) => {
                const avail = inv.availableQuantity ?? (inv.quantity - inv.reservedQuantity);
                return (
                  <tr key={inv.id} className="hover:bg-[var(--gs-background)]">
                    <td className="py-3 px-3 font-semibold text-[var(--gs-foreground)]">{inv.product?.name || inv.productId}</td>
                    <td className="py-3 px-3 font-mono text-[var(--gs-foreground-muted)]">{inv.product?.sku || '—'}</td>
                    <td className="py-3 px-3 text-center font-bold">{inv.quantity}</td>
                    <td className="py-3 px-3 text-center text-amber-600 font-bold">{inv.reservedQuantity}</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">{avail}</td>
                    <td className="py-3 px-3">
                      {avail <= 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 font-bold text-[11px]">
                          منتهي
                        </span>
                      ) : inv.isLowStock ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold text-[11px]">
                          منخفض جداً
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold text-[11px]">
                          متوفر
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-left space-x-2 space-x-reverse">
                      {canUpdate && (
                        <button
                          type="button"
                          onClick={() => setSelectedItem(inv)}
                          className="gsd-btn gsd-btn--secondary gsd-btn--sm rounded-xl px-3 py-1 text-[11px]"
                        >
                          تعديل الكمية
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjustment Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl">
          <div className="w-full max-w-md gsd-card rounded-3xl p-6 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4 shadow-2xl">
            <h3 className="text-base font-bold [color:var(--gs-foreground)] border-b border-[var(--gs-border)] pb-2">
              تعديل كمية المخزون — {selectedItem.product?.name}
            </h3>

            <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
              <div className="space-y-1 text-right">
                <label className="font-semibold text-[var(--gs-foreground-secondary)]">نوع التعديل *</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="gsd-input w-full p-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-xs"
                >
                  <option value="IN">إضافة للمخزون (Stock In)</option>
                  <option value="OUT">خصم من المخزون (Stock Out)</option>
                  <option value="ADJUSTMENT">تعيين كمية إجمالية جديدة (Set Exact Stock)</option>
                </select>
              </div>

              <div className="space-y-1 text-right">
                <label className="font-semibold text-[var(--gs-foreground-secondary)]">الكمية *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="gsd-input w-full p-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-xs font-bold"
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="font-semibold text-[var(--gs-foreground-secondary)]">سبب التعديل / ملاحظات</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="شراء جديدة / تلفيات / جرد دوري..."
                  className="gsd-input w-full p-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="gsd-btn gsd-btn--ghost gsd-btn--sm rounded-xl px-4"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="gsd-btn gsd-btn--primary gsd-btn--sm rounded-xl px-4 py-2"
                >
                  {adjusting ? 'جاري الحفظ...' : 'تأكيد التعديل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movements Audit Modal */}
      {showMovements && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl">
          <div className="w-full max-w-2xl gsd-card rounded-3xl p-6 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--gs-border)] pb-3">
              <h3 className="text-base font-bold [color:var(--gs-foreground)] flex items-center gap-2">
                <History className="h-5 w-5 text-emerald-600" />
                سجل حركة وتتبع المخزون (Stock Movements Audit)
              </h3>
              <button type="button" onClick={() => setShowMovements(false)} className="text-xs font-bold text-rose-600">
                إغلاق
              </button>
            </div>

            {movementsLoading ? (
              <div className="py-8 text-center text-xs">جاري تحميل السجلات...</div>
            ) : movements.length === 0 ? (
              <div className="py-8 text-center text-xs text-[var(--gs-foreground-secondary)]">لا توجد حركات مخزون سابقة مسجلة.</div>
            ) : (
              <div className="space-y-2 text-xs divide-y divide-[var(--gs-border-subtle)]">
                {movements.map((mv) => (
                  <div key={mv.id} className="pt-2 flex justify-between items-center">
                    <div>
                      <strong className="text-[var(--gs-foreground)] block">{mv.inventory?.product?.name || 'منتج'}</strong>
                      <span className="text-[var(--gs-foreground-muted)] font-mono text-[11px]">
                        {new Date(mv.createdAt).toLocaleString('ar-SA')} | المرجع: {mv.referenceId || 'تعديل يدوياً'}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-[11px]">
                        {mv.type}: {mv.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryDashboard;
