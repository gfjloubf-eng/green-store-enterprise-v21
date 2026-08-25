/* ============================================================
   GSDS v1.1 — PricingSection Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — Pricing form section
   ============================================================ */

import { DollarSign, TrendingUp } from 'lucide-react';
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
  const purchase = Number(data.purchasePrice) || 0;
  const selling = Number(data.sellingPrice) || 0;
  const tax = Math.min(100, Math.max(0, Number(data.tax) || 0));
  const discount = Math.max(0, Number(data.discount) || 0);
  const afterDiscount = Math.max(0, selling - discount);
  const customerPrice = afterDiscount * (1 + tax / 100);
  const profit = afterDiscount - purchase;
  const margin = afterDiscount > 0 ? (profit / afterDiscount) * 100 : 0;
  const formatMoney = (value: number) => `${value.toFixed(2)} ر.ي`;

  return (
    <fieldset className="gsd-card p-5">
      <legend className="flex items-center gap-2 text-base font-semibold [color:var(--gs-foreground)] mb-4">
        <DollarSign className="h-5 w-5 [color:var(--gs-primary)]" aria-hidden="true" />
        {t('form.pricing')}
      </legend>
      <p className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs leading-5 text-amber-800 [color:var(--gs-foreground)]">
        {t('form.pricingManagedSeparately')}
      </p>

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

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="ملخص التسعير">
        <div className="rounded-xl bg-[color:var(--gs-muted)] p-3">
          <div className="text-xs [color:var(--gs-muted-foreground)]">السعر المتوقع للعميل بعد الضريبة</div>
          <div className="mt-1 text-lg font-bold [color:var(--gs-foreground)]">{formatMoney(customerPrice)}</div>
        </div>
        <div className="rounded-xl bg-[color:var(--gs-muted)] p-3">
          <div className="text-xs [color:var(--gs-muted-foreground)]">الربح التقريبي لكل وحدة</div>
          <div className={`mt-1 text-lg font-bold ${profit >= 0 ? '[color:var(--gs-success)]' : '[color:var(--gs-danger)]'}`}>{formatMoney(profit)}</div>
        </div>
        <div className="rounded-xl bg-[color:var(--gs-muted)] p-3">
          <div className="flex items-center gap-1 text-xs [color:var(--gs-muted-foreground)]"><TrendingUp className="h-3.5 w-3.5" aria-hidden="true" /> هامش الربح</div>
          <div className={`mt-1 text-lg font-bold ${margin >= 0 ? '[color:var(--gs-success)]' : '[color:var(--gs-danger)]'}`}>{margin.toFixed(1)}%</div>
        </div>
      </div>
      {selling > 0 && selling < purchase && (
        <p className="mt-3 text-xs [color:var(--gs-danger)]" role="alert">تنبيه: سعر البيع أقل من سعر الشراء، وسيؤدي ذلك إلى خسارة تقريبية.</p>
      )}
    </fieldset>
  );
}
