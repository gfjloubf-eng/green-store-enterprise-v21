/* ============================================================
   GSDS v1.1 — ProductForm Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — Main product form composition
   ============================================================
   Composes all section components into a single form.
   Manages form state, validation, and the remote catalog save flow.
   Pricing and inventory operations remain separate backend workflows.
   ============================================================ */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { GeneralSection } from './GeneralSection';
import { PricingSection } from './PricingSection';
import { InventorySection } from './InventorySection';
import { MediaSection } from './MediaSection';
import { StatusSection } from './StatusSection';
import { FormActions } from './FormActions';
import { validateForm, isFormValid } from './validation';
import {
  DEFAULT_FORM_DATA,
  type ProductFormData,
  type FormErrors,
} from '../../types/productForm';

/* ─── Props ────────────────────────────────────────────────── */

import { ProductService } from '../../services/productService';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const validReference = (value: string) => UUID_RE.test(value.trim()) ? value.trim() : undefined;

/**
 * Convert any user-typed produce key into a backend-safe ASCII slug.
 * The backend requires slug to match ^[a-z0-9]+(?:-[a-z0-9]+)*$,
 * so Arabic letters are stripped and separators become hyphens.
 * Falls back to a timestamp-based key when nothing safe remains.
 */
function toSafeSlug(value: string, fallback?: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback || `product-${Date.now().toString(36)}`;
}

interface ProductFormProps {
  /** Optional initial data for edit mode */
  initialData?: Partial<ProductFormData>;
  /** Product ID if editing */
  productId?: string;
  /** Whether this is an edit form */
  isEdit?: boolean;
  /** Success callback */
  onSuccess?: () => void;
  /** Cancel callback */
  onCancel?: () => void;
}

/* ─── ProductForm ──────────────────────────────────────────── */

export function ProductForm({ initialData, productId, isEdit = false, onSuccess, onCancel }: ProductFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductFormData>(() => ({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  }));

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<keyof ProductFormData>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  /* ── Field change handlers ──────────────────────────── */

  const handleFieldChange = useCallback(
    (field: keyof ProductFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setTouched((prev) => new Set(prev).add(field));
    },
    [],
  );

  const handleToggle = useCallback(
    (field: keyof ProductFormData, value: boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  /* ── Validation on change ───────────────────────────── */

  const currentErrors = useMemo(() => validateForm(formData), [formData]);

  useEffect(() => {
    if (isEdit || formData.barcode.trim() || !formData.sku.trim()) return;
    const digits = formData.sku.replace(/\D/g, '');
    const seed = (digits || String(Date.now()).slice(-9)).padStart(9, '0').slice(-9);
    const body = `200${seed}`;
    const checksum = body.split('').reduce((sum, digit, index) => sum + Number(digit) * (index % 2 === 0 ? 1 : 3), 0);
    setFormData((prev) => ({ ...prev, barcode: `${body}${(10 - (checksum % 10)) % 10}` }));
  }, [formData.sku, formData.barcode, isEdit]);

  useEffect(() => {
    setErrors(currentErrors);
  }, [currentErrors]);

  /* ── Display only touched field errors ──────────────── */

  const displayErrors = useMemo<FormErrors>(() => {
    const result: FormErrors = {};
    for (const key of Object.keys(errors) as (keyof ProductFormData)[]) {
      if (touched.has(key)) {
        result[key] = errors[key];
      }
    }
    return result;
  }, [errors, touched]);

  const valid = useMemo(() => isFormValid(errors), [errors]);

  /* ── Actions ────────────────────────────────────────── */

  const handleSave = useCallback(async () => {
    const allKeys = Object.keys(DEFAULT_FORM_DATA) as (keyof ProductFormData)[];
    setTouched(new Set(allKeys));

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    setSaveError('');

    if (!isFormValid(validationErrors)) return;
    if (isEdit && !productId) {
      setSaveError('تعذر التعديل: معرّف المنتج غير موجود.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.productName,
        produceKey: toSafeSlug(formData.produceKey, formData.sku),
        sku: formData.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
        description: formData.description,
        originCountry: formData.originCountry || undefined,
        harvestDate: formData.harvestDate || undefined,
        expiryDate: formData.expiryDate || undefined,
        storageInstructions: formData.storageInstructions || undefined,
        qualityGrade: formData.qualityGrade || undefined,
        weightValue: formData.weightValue ? Number(formData.weightValue) : undefined,
        weightUnit: formData.weightUnit || undefined,
        packageLength: formData.packageLength ? Number(formData.packageLength) : undefined,
        packageWidth: formData.packageWidth ? Number(formData.packageWidth) : undefined,
        packageHeight: formData.packageHeight ? Number(formData.packageHeight) : undefined,
        shippingWeight: formData.shippingWeight ? Number(formData.shippingWeight) : undefined,
        shippingClass: formData.shippingClass || undefined,
        imageUrl: formData.imageUrl || undefined,
        imageAltText: formData.imageAltText || formData.productName,
        categoryId: validReference(formData.categoryId),
        brandId: validReference(formData.brandId),
        unitId: validReference(formData.unitId),
        isPublished: formData.status === 'active',
      };

      if (isEdit && productId) {
        await ProductService.updateRemote(productId, payload);
      } else {
        await ProductService.createRemote(payload);
      }

      onSuccess?.();
      if (!onSuccess) navigate('/products');
    } catch (err) {
      console.error('Error saving product:', err);
      setSaveError(err instanceof Error ? err.message : 'تعذر حفظ المنتج.');
    } finally {
      setIsSaving(false);
    }
  }, [formData, isEdit, productId, onSuccess, navigate]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/products');
    }
  }, [onCancel, navigate]);

  const handleReset = useCallback(() => {
    setFormData({ ...DEFAULT_FORM_DATA, ...initialData });
    setErrors({});
    setTouched(new Set());
  }, [initialData]);

  /* ── Render ─────────────────────────────────────────── */

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Section: General Information */}
      <GeneralSection
        data={formData}
        errors={displayErrors}
        onChange={handleFieldChange}
      />

      {/* Section: Pricing */}
      <PricingSection
        data={formData}
        errors={displayErrors}
        onChange={handleFieldChange}
      />

      {/* Section: Inventory */}
      <InventorySection
        data={formData}
        errors={displayErrors}
        onChange={handleFieldChange}
        onToggle={handleToggle}
      />

      {/* Section: Media */}
      <MediaSection
        data={formData}
        onChange={handleFieldChange}
      />

      {/* Section: Status */}
      <StatusSection
        data={formData}
        onChange={(field, value) => handleFieldChange(field, value)}
      />

      {/* Action Buttons */}
      {saveError && (
        <p className="text-sm [color:var(--gs-danger)]" role="alert">{saveError}</p>
      )}
      {!valid && !isSaving && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm [color:var(--gs-foreground)]"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 [color:var(--gs-warning)]" aria-hidden="true" />
          <span>
            يرجى إكمال الحقول المطلوبة المميزة بعلامة * قبل الحفظ — الحقول الناقصة أو غير الصحيحة تظهر بحدود حمراء مع رسالة توضيحية.
          </span>
        </div>
      )}
      <FormActions
        onSave={handleSave}
        onCancel={handleCancel}
        onReset={handleReset}
        isSaving={isSaving}
        isValid={valid}
      />
    </div>
  );
}
