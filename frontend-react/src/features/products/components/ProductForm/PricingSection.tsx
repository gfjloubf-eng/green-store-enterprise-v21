/* ============================================================
   GSDS v1.1 — PricingSection Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — Pricing form section
   ============================================================ */

import { DollarSign } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { FormField } from './FormField';
import type { ProductFormData, FormErrors } from '../../types/productForm';

/* ─── Props ────────────────────────────────────────────────── */

interface PricingSectionProps {
  data: ProductFormData;
  errors: FormErrors;
  onChange: (field: keyof ProductFormData, value: string) => void;
}

/* ─── PricingSection ───────────────────────────────────────── */

export function PricingSection({ data, errors, onChange }: PricingSectionProps) {
  const { t } = useI18n();

  return (
    <fieldset className="gsd-card p-5">
      <legend className="flex items-center gap-2 text-base font-semibold [color:var(--gs-foreground)] mb-4">
        <DollarSign className="h-5 w-5 [color:var(--gs-primary)]" aria-hidden="true" />
        {t('form.pricing')}
      </legend>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Purchase Price */}
        <FormField
          labelKey="form.purchasePrice"
          placeholderKey="form.purchasePricePlaceholder"
          value={data.purchasePrice}
          onChange={(v) => onChange('purchasePrice', v)}
          error={errors.purchasePrice}
          type="number"
          min={0}
          step="0.01"
          required
        />

        {/* Selling Price */}
        <FormField
          labelKey="form.sellingPrice"
          placeholderKey="form.sellingPricePlaceholder"
          value={data.sellingPrice}
          onChange={(v) => onChange('sellingPrice', v)}
          error={errors.sellingPrice}
          type="number"
          min={0}
          step="0.01"
          required
        />

        {/* Tax (%) */}
        <FormField
          labelKey="form.tax"
          placeholderKey="form.taxPlaceholder"
          value={data.tax}
          onChange={(v) => onChange('tax', v)}
          error={errors.tax}
          type="number"
          min={0}
          max={100}
          step="0.1"
        />

        {/* Discount */}
        <FormField
          labelKey="form.discount"
          placeholderKey="form.discountPlaceholder"
          value={data.discount}
          onChange={(v) => onChange('discount', v)}
          error={errors.discount}
          type="number"
          min={0}
          step="0.01"
        />
      </div>
    </fieldset>
  );
}
