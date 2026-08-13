/* ============================================================
   GSDS v1.1 — InventorySection Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — Inventory form section
   ============================================================ */

import { Package } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { FormField } from './FormField';
import type { ProductFormData, FormErrors } from '../../types/productForm';

/* ─── Props ────────────────────────────────────────────────── */

interface InventorySectionProps {
  data: ProductFormData;
  errors: FormErrors;
  onChange: (field: keyof ProductFormData, value: string) => void;
  onToggle: (field: keyof ProductFormData, value: boolean) => void;
}

/* ─── InventorySection ─────────────────────────────────────── */

export function InventorySection({ data, errors, onChange, onToggle }: InventorySectionProps) {
  const { t } = useI18n();

  return (
    <fieldset className="gsd-card p-5">
      <legend className="flex items-center gap-2 text-base font-semibold [color:var(--gs-foreground)] mb-4">
        <Package className="h-5 w-5 [color:var(--gs-primary)]" aria-hidden="true" />
        {t('form.inventory')}
      </legend>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Initial Stock */}
        <FormField
          labelKey="form.initialStock"
          placeholderKey="form.initialStockPlaceholder"
          value={data.initialStock}
          onChange={(v) => onChange('initialStock', v)}
          error={errors.initialStock}
          type="number"
          min={0}
          step="1"
          required
        />

        {/* Minimum Stock */}
        <FormField
          labelKey="form.minStock"
          placeholderKey="form.minStockPlaceholder"
          value={data.minStock}
          onChange={(v) => onChange('minStock', v)}
          error={errors.minStock}
          type="number"
          min={0}
          step="1"
        />

        {/* Maximum Stock */}
        <FormField
          labelKey="form.maxStock"
          placeholderKey="form.maxStockPlaceholder"
          value={data.maxStock}
          onChange={(v) => onChange('maxStock', v)}
          error={errors.maxStock}
          type="number"
          min={0}
          step="1"
        />

        {/* Track Inventory Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg [background:var(--gs-muted)] md:col-span-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium [color:var(--gs-foreground)]">
              {t('form.trackInventory')}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={data.trackInventory}
            onClick={() => onToggle('trackInventory', !data.trackInventory)}
            className={`
              relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out
              ${data.trackInventory ? '[background:var(--gs-primary)]' : '[background:var(--gs-border)]'}
            `}
            aria-label={t('form.trackInventory')}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 rounded-full [background:white] shadow
                transform ring-0 transition duration-200 ease-in-out
                ${data.trackInventory ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
        </div>
      </div>
    </fieldset>
  );
}
