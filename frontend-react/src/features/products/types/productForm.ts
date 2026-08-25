/* ============================================================
   GSDS v1.1 — Product Form Types
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — Form data & validation types
   ============================================================ */

/**
 * Product form data model.
 * All fields are optional for create mode; required validation is
 * enforced client-side at submit time.
 */
export interface ProductFormData {
  /* ── General Information ──────────────────────────────── */
  productName: string;
  produceKey: string;
  sku: string;
  barcode: string;
  categoryId: string;
  brandId: string;
  unitId: string;
  description: string;
  originCountry: string;
  harvestDate: string;
  expiryDate: string;
  storageInstructions: string;
  qualityGrade: string;
  weightValue: string;
  weightUnit: string;
  packageLength: string;
  packageWidth: string;
  packageHeight: string;
  shippingWeight: string;
  shippingClass: string;

  /* ── Pricing ──────────────────────────────────────────── */
  purchasePrice: string;
  sellingPrice: string;
  tax: string;
  discount: string;

  /* ── Inventory ────────────────────────────────────────── */
  initialStock: string;
  minStock: string;
  maxStock: string;
  trackInventory: boolean;

  /* ── Media ────────────────────────────────────────────── */
  imageUrl: string;
  imageAltText: string;

  /* ── Status ───────────────────────────────────────────── */
  status: 'active' | 'inactive';
}

/**
 * Default / empty form data.
 */
export const DEFAULT_FORM_DATA: ProductFormData = {
  productName: '',
  produceKey: '',
  sku: '',
  barcode: '',
  categoryId: '',
  brandId: '',
  unitId: '',
  description: '',
  originCountry: '',
  harvestDate: '',
  expiryDate: '',
  storageInstructions: '',
  qualityGrade: '',
  weightValue: '',
  weightUnit: 'kg',
  packageLength: '',
  packageWidth: '',
  packageHeight: '',
  shippingWeight: '',
  shippingClass: '',
  purchasePrice: '',
  sellingPrice: '',
  tax: '',
  discount: '',
  initialStock: '',
  minStock: '',
  maxStock: '',
  trackInventory: true,
  imageUrl: '',
  imageAltText: '',
  status: 'active',
};

/**
 * Validation error map — keyed by form field name.
 * A field with no error has an empty string.
 */
export type FormErrors = Partial<Record<keyof ProductFormData, string>>;

/**
 * Validation rule definition.
 */
export interface ValidationRule {
  /** Human-readable field name for error messages */
  fieldName: string;
  /** Required field */
  required?: boolean;
  /** Must be a valid number */
  isNumber?: boolean;
  /** Must be >= 0 */
  minZero?: boolean;
  /** Must be an integer */
  isInteger?: boolean;
  /** Minimum string length */
  minLength?: number;
  /** Maximum value (numeric) */
  max?: number;
  /** Minimum value (numeric) */
  min?: number;
  /** Pattern match */
  pattern?: RegExp;
  /** Pattern error message key */
  patternMessage?: string;
}
