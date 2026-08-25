/* ============================================================
   GSDS v1.1 — StockTransfer
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Stock transfer form page
   ============================================================
   Presentational placeholder for the transfer workflow.
   Actual form implementation deferred to a future milestone.
   ============================================================ */

import { useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { ArrowRightLeft } from 'lucide-react';
import { ProductService } from '@/features/products/services/productService';
import { InventoryService } from '@/features/inventory/services/inventoryService';

export function StockTransfer() {
  const { t } = useI18n();
  const products = ProductService.getAll();
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState('1');
  const [from, setFrom] = useState('المخزن الرئيسي');
  const [to, setTo] = useState('فرع صنعاء');
  const [message, setMessage] = useState('');
  const submit = () => {
    const count = Number(quantity);
    if (!productId || !Number.isInteger(count) || count <= 0) { setMessage('أدخل المنتج والكمية الصحيحة'); return; }
    const result = InventoryService.transferStock(productId, count, { id: 'source', name: from }, { id: 'destination', name: to });
    setMessage(result ? 'تم تسجيل التحويل بنجاح' : 'تعذر التحويل: الكمية غير متوفرة أو المنتج غير موجود');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
          <ArrowRightLeft className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
          {t('inventory.stockTransfer.title')}
        </h1>
        <BreadcrumbEngine className="mt-1" />
      </div>

      <div className="gsd-card max-w-2xl space-y-4 p-5">
        <p className="text-sm [color:var(--gs-foreground-secondary)]">انقل كمية بين موقعين وسجّل الحركة للمراجعة.</p>
        <select value={productId} onChange={(e) => setProductId(e.target.value)} className="gsd-input w-full rounded-xl p-3"><option value="">اختر المنتج</option>{products.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.sku}</option>)}</select>
        <div className="grid gap-3 sm:grid-cols-3"><input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="من" className="gsd-input rounded-xl p-3" /><input value={to} onChange={(e) => setTo(e.target.value)} placeholder="إلى" className="gsd-input rounded-xl p-3" /><input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="الكمية" className="gsd-input rounded-xl p-3" /></div>
        <button onClick={submit} className="gsd-btn gsd-btn--primary inline-flex items-center gap-2 rounded-xl px-5"><ArrowRightLeft className="h-4 w-4" />تسجيل التحويل</button>
        {message && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
      </div>
    </div>
  );
}

