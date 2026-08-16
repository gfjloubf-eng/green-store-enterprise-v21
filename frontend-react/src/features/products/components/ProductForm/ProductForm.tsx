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

import { ProductService } from '../../services/productService';

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
    const allKeys = Object.keys(DEFAULT_FORM_DATA) as (keyof ProductFormData)[];
    setTouched(new Set(allKeys));

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (isFormValid(validationErrors)) {
      try {
        if (isEdit && productId) {
          ProductService.update(productId, {
            name: formData.productName,
            sku: formData.sku,
            barcode: formData.barcode,
            description: formData.description,
            purchasePrice: parseFloat(formData.purchasePrice) || 0,
            sellingPrice: parseFloat(formData.sellingPrice) || 0,
            tax: parseFloat(formData.tax) || 0,
            discount: parseFloat(formData.discount) || 0,
            stock: parseInt(formData.initialStock, 10) || 0,
            minStock: parseInt(formData.minStock, 10) || 0,
            maxStock: parseInt(formData.maxStock, 10) || 0,
            trackInventory: formData.trackInventory,
            image: formData.imageUrl,
            status: formData.status,
          });
        } else {
          ProductService.create({
            name: formData.productName,
            sku: formData.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
            barcode: formData.barcode,
            category: { id: formData.categoryId || 'c1', name: 'General' },
            brand: { id: formData.brandId || 'b1', name: 'Generic' },
            unit: { id: formData.unitId || 'u1', name: 'Piece', abbreviation: 'pc' },
            description: formData.description,
            purchasePrice: parseFloat(formData.purchasePrice) || 0,
            sellingPrice: parseFloat(formData.sellingPrice) || 0,
            tax: parseFloat(formData.tax) || 0,
            discount: parseFloat(formData.discount) || 0,
            stock: parseInt(formData.initialStock, 10) || 0,
            minStock: parseInt(formData.minStock, 10) || 0,
            maxStock: parseInt(formData.maxStock, 10) || 0,
            trackInventory: formData.trackInventory,
            image: formData.imageUrl,
            status: formData.status,
          });
        }

        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/products');
        }
      } catch (err) {
        console.error('Error saving product:', err);
      }
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
      <FormActions
        onSave={handleSave}
        onCancel={handleCancel}
        onReset={handleReset}
        isValid={valid}
      />
    </div>
  );
}
