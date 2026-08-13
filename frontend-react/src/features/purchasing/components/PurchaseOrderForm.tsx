/* ============================================================
   GSDS v1.1 â€” PurchaseOrderForm Component
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Purchase order creation form
   ============================================================
   Pure presentation component.
   - Collects purchase order creation inputs.
   - No business logic; no service calls.
   - Exposes submission via onSave callback.
   ============================================================ */

import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/useI18n';
import { PurchasingService } from '../services/purchasingService';
import type { SupplierRef } from '../types/purchasing';

/* â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export interface PurchaseOrderFormItem {
  productId: string;
  quantity: number;
  unitCost: number;
  taxRate: number;
}

export interface PurchaseOrderFormValues {
  supplierId: string;
  expectedAt: string;
  notes: string;
  items: PurchaseOrderFormItem[];
}

interface PurchaseOrderFormProps {
  /** Initial form values */
  initialValues?: Partial<PurchaseOrderFormValues>;
  /** Called when the user submits the form */
  onSave: (values: PurchaseOrderFormValues) => void;
  /** Called when the user cancels */
  onCancel: () => void;
  /** Optional class name override */
  className?: string;
}

/* â”€â”€â”€ Defaults â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const DEFAULT_VALUES: PurchaseOrderFormValues = {
  supplierId: '',
  expectedAt: '',
  notes: '',
  items: [],
};

/* â”€â”€â”€ PurchaseOrderForm â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function PurchaseOrderForm({
  initialValues,
  onSave,
  onCancel,
  className,
}: PurchaseOrderFormProps) {
  const { t } = useI18n();
  const suppliers = PurchasingService.getSuppliers();
  const products = PurchasingService.getProducts();

  const [values, setValues] = useState<PurchaseOrderFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  });

  const updateField = <K extends keyof PurchaseOrderFormValues>(
    key: K,
    value: PurchaseOrderFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const addItem = () => {
    setValues((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: products[0]?.id ?? '',
          quantity: 1,
          unitCost: 0,
          taxRate: 0,
        },
      ],
    }));
  };

  const updateItem = (index: number, field: keyof PurchaseOrderFormItem, value: number | string) => {
    setValues((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeItem = (index: number) => {
    setValues((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const canSubmit =
    values.supplierId !== '' &&
    values.items.length > 0 &&
    values.items.every((i) => i.productId !== '' && i.quantity > 0);

  return (
    <div className={cn('gsd-card p-5', className)}>
      <div className="flex flex-col gap-5">
        {/* â”€â”€ Supplier + expected date â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium [color:var(--gs-foreground-secondary)]">
              {t('purchaseOrderForm.supplier')}
            </label>
            <select
              value={values.supplierId}
              onChange={(e) => updateField('supplierId', e.target.value)}
              className="gsd-input h-9 w-full text-sm"
            >
              <option value="">{t('purchaseOrderForm.selectSupplier')}</option>
              {suppliers.map((s: SupplierRef) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium [color:var(--gs-foreground-secondary)]">
              {t('purchaseOrderForm.expectedAt')}
            </label>
            <input
              type="date"
              value={values.expectedAt}
              onChange={(e) => updateField('expectedAt', e.target.value)}
              className="gsd-input h-9 w-full text-sm"
            />
          </div>
        </div>

        {/* â”€â”€ Items â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium [color:var(--gs-foreground-secondary)]">
              {t('purchaseOrderForm.items')}
            </label>
            <button
              type="button"
              onClick={addItem}
              className="gsd-btn gsd-btn--ghost gsd-btn--sm"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              {t('purchaseOrderForm.addItem')}
            </button>
          </div>

          {values.items.length === 0 ? (
            <p className="rounded-lg border border-dashed px-4 py-6 text-center text-xs [color:var(--gs-foreground-muted)] [border-color:var(--gs-border)]">
              {t('purchaseOrderForm.noItems')}
            </p>
          ) : (
            <div className="space-y-2">
              {values.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end"
                >
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-[10px] [color:var(--gs-foreground-muted)]">
                      {t('purchaseOrderForm.product')}
                    </label>
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      className="gsd-input h-9 w-full text-sm"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] [color:var(--gs-foreground-muted)]">
                      {t('purchaseOrderForm.quantity')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      className="gsd-input h-9 w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] [color:var(--gs-foreground-muted)]">
                      {t('purchaseOrderForm.unitCost')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={item.unitCost}
                      onChange={(e) => updateItem(index, 'unitCost', Number(e.target.value))}
                      className="gsd-input h-9 w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] [color:var(--gs-foreground-muted)]">
                      {t('purchaseOrderForm.taxRate')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.taxRate}
                      onChange={(e) => updateItem(index, 'taxRate', Number(e.target.value))}
                      className="gsd-input h-9 w-full text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="gsd-btn gsd-btn--ghost gsd-btn--sm h-9 w-9 p-0 [color:var(--gs-danger)] hover:[background:var(--gs-danger-soft)]"
                      aria-label={t('purchaseOrderForm.removeItem')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* â”€â”€ Notes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div>
          <label className="mb-1 block text-xs font-medium [color:var(--gs-foreground-secondary)]">
            {t('purchaseOrderForm.notes')}
          </label>
          <textarea
            value={values.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={3}
            className="gsd-input w-full text-sm"
            placeholder={t('purchaseOrderForm.notesPlaceholder')}
          />
        </div>

        {/* â”€â”€ Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="gsd-btn gsd-btn--secondary gsd-btn--md"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={() => onSave(values)}
            disabled={!canSubmit}
            className="gsd-btn gsd-btn--primary gsd-btn--md"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {t('purchaseOrderForm.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
