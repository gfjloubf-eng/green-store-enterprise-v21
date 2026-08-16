import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Plus, Minus, CheckCircle2, AlertCircle, ArrowLeft, Package } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { ProductService } from '@/features/products/services/productService';
import { InventoryService } from '../services/inventoryService';

export function StockAdjustment() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const products = ProductService.getAll();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [adjustmentType, setAdjustmentType] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState<string>('1');
  const [reason, setReason] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);
      setSuccessMsg(null);

      if (!selectedProductId) {
        setErrorMsg('يرجى اختيار المنتج المطلوب تعديل مخزونه');
        return;
      }

      const qtyNum = parseInt(quantity, 10);
      if (isNaN(qtyNum) || qtyNum <= 0) {
        setErrorMsg('يرجى إدخال كمية صحيحة أكبر من الصفر');
        return;
      }

      if (!reason.trim()) {
        setErrorMsg('يرجى إدخال سبب التعديل (مثل: استلام شحنة جديدة، تلف، عجز مخزني...)');
        return;
      }

      setSubmitting(true);
      try {
        const delta = adjustmentType === 'IN' ? qtyNum : -qtyNum;
        const updated = InventoryService.adjustStock(
          selectedProductId,
          delta,
          reason.trim(),
        );

        if (updated) {
          setSuccessMsg(
            `تم تعديل المخزون للمنتج "${selectedProduct?.name}" بنجاح. الكمية الحالية: ${updated.quantityOnHand}`,
          );
          setQuantity('1');
          setReason('');
        } else {
          setErrorMsg('فشل تعديل المخزون، يرجى المحاولة مرة أخرى.');
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'حدث خطأ غير متوقع أثناء تعديل المخزون');
      } finally {
        setSubmitting(false);
      }
    },
    [selectedProductId, adjustmentType, quantity, reason, selectedProduct],
  );

  return (
    <div className="flex flex-col gap-6 pb-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="gsd-btn gsd-btn--ghost gsd-btn--sm h-9 w-9 p-0 rounded-xl"
            aria-label={t('common.back')}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-2">
              <SlidersHorizontal className="h-6 w-6 text-emerald-600" aria-hidden="true" />
              {t('inventory.stockAdjustment.title')}
            </h1>
            <BreadcrumbEngine className="mt-1" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-600 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Adjustment Form */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="gsd-card rounded-3xl p-5 sm:p-6 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-5">
          <h2 className="text-base font-bold [color:var(--gs-foreground)] border-b border-[var(--gs-border-subtle)] pb-3">
            تفاصيل التسوية المخزنية
          </h2>

          {/* Product Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)]">
              اختر المنتج:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="gsd-input w-full rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] p-3 text-xs font-medium"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (SKU: {p.sku} | المخزون الحالي: {p.stock})
                </option>
              ))}
            </select>
          </div>

          {/* Adjustment Type: Stock IN (+) vs Stock OUT (-) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)]">
              نوع التعديل:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdjustmentType('IN')}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                  adjustmentType === 'IN'
                    ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'border-[var(--gs-border)] bg-[var(--gs-background)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>إضافة للمخزون (إدخال)</span>
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('OUT')}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                  adjustmentType === 'OUT'
                    ? 'border-rose-600 bg-rose-500/10 text-rose-600'
                    : 'border-[var(--gs-border)] bg-[var(--gs-background)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]'
                }`}
              >
                <Minus className="h-4 w-4" />
                <span>خصم من المخزون (صرف)</span>
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)]">
              الكمية:
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="gsd-input w-full rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] p-3 text-xs font-bold"
              placeholder="أدخل الكمية..."
            />
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)]">
              سبب التعديل / ملاحظات:
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="اكتب سبب التسوية المخزنية بالتفصيل..."
              className="gsd-input w-full rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] p-3 text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/inventory')}
              className="gsd-btn gsd-btn--secondary gsd-btn--md rounded-2xl px-5 py-2.5 text-xs font-semibold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="gsd-btn gsd-btn--primary gsd-btn--md rounded-2xl px-6 py-2.5 text-xs font-bold inline-flex items-center gap-2"
            >
              {submitting ? 'جاري الحفظ...' : 'تأكيد وحفظ التسوية'}
            </button>
          </div>
        </form>

        {/* Selected Product Summary Card */}
        {selectedProduct && (
          <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] h-fit space-y-4">
            <div className="flex items-center gap-3 border-b border-[var(--gs-border-subtle)] pb-3">
              {selectedProduct.image ? (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="h-12 w-12 rounded-xl object-cover border border-[var(--gs-border)]"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold">
                  <Package className="h-6 w-6" />
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold [color:var(--gs-foreground)]">
                  {selectedProduct.name}
                </h3>
                <span className="text-xs font-mono text-[var(--gs-foreground-secondary)]">
                  SKU: {selectedProduct.sku}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[var(--gs-foreground-secondary)]">
              <div className="flex justify-between">
                <span>المخزون الحالي:</span>
                <strong className="text-emerald-600 font-bold text-sm">
                  {selectedProduct.stock} قطعة
                </strong>
              </div>
              <div className="flex justify-between">
                <span>سعر التكلفة:</span>
                <strong className="[color:var(--gs-foreground)]">
                  ${selectedProduct.purchasePrice}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>سعر البيع:</span>
                <strong className="[color:var(--gs-foreground)]">
                  ${selectedProduct.sellingPrice}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockAdjustment;
