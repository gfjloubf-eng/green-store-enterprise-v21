/* ============================================================
   GSDS v1.1 — GeneralSection Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — General Information form section
   ============================================================ */

import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { fetchWithAuth } from '@/services/authClient';
import { FormField } from './FormField';
import type { ProductFormData, FormErrors } from '../../types/productForm';

/* ─── Props ────────────────────────────────────────────────── */

interface GeneralSectionProps {
  data: ProductFormData;
  errors: FormErrors;
  onChange: (field: keyof ProductFormData, value: string) => void;
}

/* ─── Category / Brand / Unit options ──────────────────────── */

const CATEGORY_OPTIONS = [
  { value: 'cat-1', labelKey: 'form.category.vegetables' as const },
  { value: 'cat-2', labelKey: 'form.category.fruits' as const },
  { value: 'cat-3', labelKey: 'form.category.herbs' as const },
  { value: 'cat-4', labelKey: 'form.category.dairy' as const },
  { value: 'cat-5', labelKey: 'form.category.beverages' as const },
];

const BRAND_OPTIONS = [
  { value: 'br-1', labelKey: 'form.brand.greenFarm' as const },
  { value: 'br-2', labelKey: 'form.brand.naturesBest' as const },
  { value: 'br-3', labelKey: 'form.brand.organicValley' as const },
  { value: 'br-4', labelKey: 'form.brand.freshHarvest' as const },
  { value: 'br-5', labelKey: 'form.brand.ecoGrow' as const },
];

const QUALITY_OPTIONS = [
  { value: 'PREMIUM', label: 'ممتاز / Premium' },
  { value: 'STANDARD', label: 'قياسي / Standard' },
  { value: 'ECONOMY', label: 'اقتصادي / Economy' },
];

const FALLBACK_UNIT_OPTIONS = [
  { value: 'unit-1', labelKey: 'form.unit.kilogram' as const },
  { value: 'unit-2', labelKey: 'form.unit.box' as const },
  { value: 'unit-3', labelKey: 'form.unit.bunch' as const },
  { value: 'unit-4', labelKey: 'form.unit.liter' as const },
  { value: 'unit-5', labelKey: 'form.unit.pack' as const },
  { value: 'unit-6', labelKey: 'form.unit.gram' as const },
];

/* ─── GeneralSection ───────────────────────────────────────── */

export function GeneralSection({ data, errors, onChange }: GeneralSectionProps) {
  const { t } = useI18n();
  const [unitOptions, setUnitOptions] = useState<{ value: string; label: string }[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    let active = true;
    void fetchWithAuth('/units').then(async (response) => {
      if (!response.ok) return;
      const payload = await response.json().catch(() => ({}));
      const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      if (active && rows.length) {
        setUnitOptions(rows.map((unit: { id: string; name: string; symbol?: string | null }) => ({ value: unit.id, label: unit.symbol ? `${unit.name} (${unit.symbol})` : unit.name })));
      }
    }).catch(() => undefined);
    // Load real categories from the backend so the selected categoryId is a
    // real UUID that the API accepts (hardcoded cat-* values are stripped by
    // validReference and products end up without a category, invisible in the
    // storefront sections).
    void fetchWithAuth('/categories').then(async (response) => {
      if (!response.ok) return;
      const payload = await response.json().catch(() => ({}));
      const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      if (active && rows.length) {
        setCategoryOptions(rows.map((cat: { id: string; name: string }) => ({ value: cat.id, label: cat.name })));
      }
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);
  const UNIT_OPTIONS = unitOptions.length ? unitOptions : FALLBACK_UNIT_OPTIONS;
  const CATEGORY_OPTIONS_REAL = categoryOptions.length ? categoryOptions : CATEGORY_OPTIONS;

  return (
    <fieldset className="gsd-card p-5">
      <legend className="flex items-center gap-2 text-base font-semibold [color:var(--gs-foreground)] mb-4">
        <Info className="h-5 w-5 [color:var(--gs-primary)]" aria-hidden="true" />
        {t('form.generalInfo')}
      </legend>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <FormField
          labelKey="form.productName"
          placeholderKey="form.productNamePlaceholder"
          value={data.productName}
          onChange={(v) => onChange('productName', v)}
          error={errors.productName}
          required
          className="md:col-span-2"
        />

        {/* Stable produce identity */}
        <FormField
          labelKey="form.produceKey"
          placeholderKey="form.produceKeyPlaceholder"
          value={data.produceKey}
          onChange={(v) => onChange('produceKey', v)}
          error={errors.produceKey}
          hintKey="form.produceKeyHint"
          required
          className="md:col-span-2"
        />

        {/* SKU */}
        <FormField
          labelKey="form.sku"
          placeholderKey="form.skuPlaceholder"
          value={data.sku}
          onChange={(v) => onChange('sku', v)}
          error={errors.sku}
          required
        />

        {/* Barcode */}
        <FormField
          labelKey="form.barcode"
          placeholderKey="form.barcodePlaceholder"
          value={data.barcode}
          onChange={(v) => onChange('barcode', v)}
          error={errors.barcode}
        />

        {/* Category */}
        <FormField
          labelKey="form.category"
          placeholderKey="form.selectCategory"
          value={data.categoryId}
          onChange={(v) => onChange('categoryId', v)}
          error={errors.categoryId}
          type="select"
          options={CATEGORY_OPTIONS_REAL}
          required
        />

        {/* Brand */}
        <FormField
          labelKey="form.brand"
          placeholderKey="form.selectBrand"
          value={data.brandId}
          onChange={(v) => onChange('brandId', v)}
          error={errors.brandId}
          type="select"
          options={BRAND_OPTIONS}
          required
        />

        {/* Unit */}
        <FormField
          labelKey="form.unit"
          placeholderKey="form.selectUnit"
          value={data.unitId}
          onChange={(v) => onChange('unitId', v)}
          error={errors.unitId}
          type="select"
          options={UNIT_OPTIONS}
          required
        />

        {/* Origin country */}
        <FormField
          labelKey="form.originCountry"
          placeholderKey="form.originCountryPlaceholder"
          value={data.originCountry}
          onChange={(v) => onChange('originCountry', v)}
        />

        {/* Quality grade */}
        <FormField
          labelKey="form.qualityGrade"
          placeholderKey="form.selectQualityGrade"
          value={data.qualityGrade}
          onChange={(v) => onChange('qualityGrade', v)}
          type="select"
          options={QUALITY_OPTIONS}
        />

        {/* Harvest and expiry dates */}
        <FormField
          labelKey="form.harvestDate"
          value={data.harvestDate}
          onChange={(v) => onChange('harvestDate', v)}
          type="date"
        />
        <FormField
          labelKey="form.expiryDate"
          value={data.expiryDate}
          onChange={(v) => onChange('expiryDate', v)}
          type="date"
        />

        {/* Storage instructions */}
        <FormField
          labelKey="form.storageInstructions"
          placeholderKey="form.storageInstructionsPlaceholder"
          value={data.storageInstructions}
          onChange={(v) => onChange('storageInstructions', v)}
          type="textarea"
          className="md:col-span-2"
        />

        {/* Logistics: weight and dimensions */}
        <FormField labelKey="form.weightValue" value={data.weightValue} onChange={(v) => onChange('weightValue', v)} type="number" min={0} step="0.001" />
        <FormField labelKey="form.weightUnit" value={data.weightUnit} onChange={(v) => onChange('weightUnit', v)} type="select" options={[{ value: 'kg', label: 'كيلوغرام (kg)' }, { value: 'g', label: 'غرام (g)' }, { value: 'l', label: 'لتر (L)' }]} />
        <FormField labelKey="form.packageLength" value={data.packageLength} onChange={(v) => onChange('packageLength', v)} type="number" min={0} step="0.1" />
        <FormField labelKey="form.packageWidth" value={data.packageWidth} onChange={(v) => onChange('packageWidth', v)} type="number" min={0} step="0.1" />
        <FormField labelKey="form.packageHeight" value={data.packageHeight} onChange={(v) => onChange('packageHeight', v)} type="number" min={0} step="0.1" />
        <FormField labelKey="form.shippingWeight" value={data.shippingWeight} onChange={(v) => onChange('shippingWeight', v)} type="number" min={0} step="0.001" />
        <FormField labelKey="form.shippingClass" value={data.shippingClass} onChange={(v) => onChange('shippingClass', v)} placeholderKey="form.shippingClassPlaceholder" />

        {/* Description */}
        <FormField
          labelKey="form.description"
          placeholderKey="form.descriptionPlaceholder"
          value={data.description}
          onChange={(v) => onChange('description', v)}
          type="textarea"
          className="md:col-span-2"
        />
      </div>
    </fieldset>
  );
}
