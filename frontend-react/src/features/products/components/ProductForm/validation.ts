/* ============================================================
   GSDS v1.1 — Product Form Validation
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — Pure client-side validation functions
   ============================================================
   Pure functions — no side effects, no DOM, no React.
   Each function returns a translated error string or empty string.
   ============================================================ */

import type { ProductFormData, FormErrors, ValidationRule } from '../../types/productForm';

/**
 * Validate a single field value against its rules.
 * Returns a translation key (or empty string if valid).
 */
export function validateField(
  value: string | boolean,
  rules: ValidationRule,
): string {
  const strValue = String(value).trim();

  /* ── Required check ─────────────────────────────────── */
  if (rules.required && strValue === '') {
    return 'form.validation.required';
  }

  /* ── Skip further checks if empty and not required ───── */
  if (strValue === '') return '';

  /* ── Min length ──────────────────────────────────────── */
  if (rules.minLength !== undefined && strValue.length < rules.minLength) {
    return 'form.validation.minLength';
  }

  /* ── Pattern match ───────────────────────────────────── */
  if (rules.pattern && !rules.pattern.test(strValue)) {
    return rules.patternMessage || 'form.validation.invalidFormat';
  }

  /* ── Numeric checks ──────────────────────────────────── */
  if (rules.isNumber || rules.minZero || rules.isInteger || rules.min !== undefined || rules.max !== undefined) {
    const num = Number(strValue);

    if (rules.isNumber && isNaN(num)) {
      return 'form.validation.invalidNumber';
    }

    if (rules.isInteger && !Number.isInteger(num)) {
      return 'form.validation.integerRequired';
    }

    if (rules.minZero && num < 0) {
      return 'form.validation.positiveNumber';
    }

    if (rules.min !== undefined && num < rules.min) {
      return 'form.validation.minValue';
    }

    if (rules.max !== undefined && num > rules.max) {
      return 'form.validation.maxValue';
    }
  }

  return '';
}

/**
 * Validate the entire form.
 * Returns a FormErrors object with error translation keys for invalid fields.
 */
export function validateForm(data: ProductFormData): FormErrors {
  const errors: FormErrors = {};

  /* ── General Information ─────────────────────────────── */

  const nameErr = validateField(data.productName, {
    fieldName: 'form.productName',
    required: true,
    minLength: 2,
  });
  if (nameErr) errors.productName = nameErr;

  const produceKeyErr = validateField(data.produceKey, {
    fieldName: 'form.produceKey',
    required: true,
    minLength: 2,
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    patternMessage: 'form.validation.alphanumeric',
  });
  if (produceKeyErr) errors.produceKey = produceKeyErr;

  const skuErr = validateField(data.sku, {
    fieldName: 'form.sku',
    required: true,
    pattern: /^[a-zA-Z0-9_-]+$/,
    patternMessage: 'form.validation.alphanumeric',
  });
  if (skuErr) errors.sku = skuErr;

  const barcodeErr = validateField(data.barcode, {
    fieldName: 'form.barcode',
    required: false,
    pattern: /^[0-9]*$/,
    patternMessage: 'form.validation.numbersOnly',
  });
  if (barcodeErr) errors.barcode = barcodeErr;

  const catErr = validateField(data.categoryId, {
    fieldName: 'form.category',
    required: true,
  });
  if (catErr) errors.categoryId = catErr;

  const brandErr = validateField(data.brandId, {
    fieldName: 'form.brand',
    required: true,
  });
  if (brandErr) errors.brandId = brandErr;

  const unitErr = validateField(data.unitId, {
    fieldName: 'form.unit',
    required: true,
  });
  if (unitErr) errors.unitId = unitErr;

  /* ── Pricing ─────────────────────────────────────────── */

  const purchaseErr = validateField(data.purchasePrice, {
    fieldName: 'form.purchasePrice',
    required: true,
    isNumber: true,
    minZero: true,
  });
  if (purchaseErr) errors.purchasePrice = purchaseErr;

  const sellingErr = validateField(data.sellingPrice, {
    fieldName: 'form.sellingPrice',
    required: true,
    isNumber: true,
    minZero: true,
  });
  if (sellingErr) errors.sellingPrice = sellingErr;

  const taxErr = validateField(data.tax, {
    fieldName: 'form.tax',
    required: false,
    isNumber: true,
    minZero: true,
    max: 100,
  });
  if (taxErr) errors.tax = taxErr;

  const discountErr = validateField(data.discount, {
    fieldName: 'form.discount',
    required: false,
    isNumber: true,
    minZero: true,
  });
  if (discountErr) errors.discount = discountErr;

  /* ── Product dates ──────────────────────────────────── */
  if (data.harvestDate && Number.isNaN(Date.parse(data.harvestDate))) {
    errors.harvestDate = 'form.validation.invalidDate';
  }
  if (data.expiryDate && Number.isNaN(Date.parse(data.expiryDate))) {
    errors.expiryDate = 'form.validation.invalidDate';
  }
  if (data.harvestDate && data.expiryDate && !errors.harvestDate && !errors.expiryDate && Date.parse(data.expiryDate) < Date.parse(data.harvestDate)) {
    errors.expiryDate = 'form.validation.expiryBeforeHarvest';
  }

  /* ── Inventory ───────────────────────────────────────── */

  const stockErr = validateField(data.initialStock, {
    fieldName: 'form.initialStock',
    required: true,
    isNumber: true,
    isInteger: true,
    minZero: true,
  });
  if (stockErr) errors.initialStock = stockErr;

  const minStockErr = validateField(data.minStock, {
    fieldName: 'form.minStock',
    required: false,
    isNumber: true,
    isInteger: true,
    minZero: true,
  });
  if (minStockErr) errors.minStock = minStockErr;

  const maxStockErr = validateField(data.maxStock, {
    fieldName: 'form.maxStock',
    required: false,
    isNumber: true,
    isInteger: true,
    minZero: true,
  });
  if (maxStockErr) errors.maxStock = maxStockErr;

  /* ── Cross-field validation: minStock < maxStock ─────── */
  if (
    data.minStock !== '' &&
    data.maxStock !== '' &&
    !errors.minStock &&
    !errors.maxStock
  ) {
    const min = Number(data.minStock);
    const max = Number(data.maxStock);
    if (min >= max) {
      errors.maxStock = 'form.validation.minGtMax';
    }
  }

  return errors;
}

/**
 * Check if the entire form is valid.
 */
export function isFormValid(errors: FormErrors): boolean {
  return Object.values(errors).every((err) => err === '' || err === undefined);
}
