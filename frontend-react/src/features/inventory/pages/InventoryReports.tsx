/* ============================================================
   GSDS v1.1 — InventoryReports
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Inventory reports placeholder
   ============================================================
   Placeholder page for future inventory reporting.
   ============================================================ */

import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { BarChart3 } from 'lucide-react';
import { InventoryService } from '@/features/inventory/services/inventoryService';

export function InventoryReports() {
  const { t } = useI18n();
  const summary = InventoryService.getSummary();
  const lowStock = InventoryService.getLowStock();
  const outOfStock = InventoryService.getOutOfStock();

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
          <BarChart3 className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
          {t('inventory.inventoryReports.title')}
        </h1>
        <BreadcrumbEngine className="mt-1" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="gsd-card p-5"><p className="text-xs text-slate-500">إجمالي الأصناف</p><strong className="mt-2 block text-2xl">{summary.totalItems ?? 0}</strong></div><div className="gsd-card p-5"><p className="text-xs text-slate-500">إجمالي الكمية</p><strong className="mt-2 block text-2xl">{summary.totalQuantity ?? 0}</strong></div><div className="gsd-card p-5"><p className="text-xs text-amber-700">مخزون منخفض</p><strong className="mt-2 block text-2xl text-amber-700">{lowStock.length}</strong></div><div className="gsd-card p-5"><p className="text-xs text-red-700">نفد المخزون</p><strong className="mt-2 block text-2xl text-red-700">{outOfStock.length}</strong></div></div><div className="gsd-card p-5"><h2 className="font-bold">تنبيه الأصناف التي تحتاج متابعة</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{[...lowStock, ...outOfStock].slice(0, 20).map((item: any) => <div key={item.id} className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm"><span>{item.productName || item.name || item.productId}</span><b>{item.quantityOnHand ?? item.quantity ?? 0}</b></div>)}{lowStock.length + outOfStock.length === 0 && <p className="text-sm text-slate-500">لا توجد تنبيهات حالياً.</p>}</div></div>
    </div>
  );
}

