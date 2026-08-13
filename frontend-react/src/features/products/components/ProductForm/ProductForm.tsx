/* ============================================================
   GSDS v1.1 — ProductForm Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — Main product form composition
   ============================================================
   Composes all section components into a single form.
   Manages form state, validation, and interaction.
   No CRUD, no API, no backend — UI only.
   ============================================================ */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface ProductFormProps {
  /** Optional initial data for edit mode */
  initialData?: Partial<ProductFormData>;
  /** Whether this is an edit form */
  isEdit?: boolean;
}

/* ─── ProductForm ──────────────────────────────────────────── */

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductFormData>(() => ({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  }));

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<keyof ProductFormData>>(new Set());

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

  const handleSave = useCallback(() => {
    // Mark all fields as touched
    const allKeys = Object.keys(DEFAULT_FORM_DATA) as (keyof ProductFormData)[];
    setTouched(new Set(allKeys));

    // Re-validate
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (isFormValid(validationErrors)) {
      // No save logic — UI only
      // In a future milestone this will dispatch to an API
      // isEdit flag available for edit vs create distinction
      void isEdit;
    }
  }, [formData, isEdit]);

  const handleCancel = useCallback(() => {
    navigate('/products');
  }, [navigate]);

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
      <FormActions
        onSave={handleSave}
        onCancel={handleCancel}
        onReset={handleReset}
        isValid={valid}
      />
    </div>
  );
}
