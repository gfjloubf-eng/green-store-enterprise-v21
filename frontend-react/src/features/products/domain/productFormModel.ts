/* ============================================================
   GSDS v1.1 — Product Form Model (Domain)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.3 — Form ↔ Entity mapping logic
   ============================================================
   Maps between ProductFormData (UI layer) and ProductEntity
   (domain layer). No UI dependencies.
   ============================================================ */

import type { ProductEntity, UnitRef, EntityRef } from './productEntity';
import type { ProductDTO } from './productDTO';
import type { ProductFormData } from '../types/productForm';

/**
 * Map ProductFormData + metadata → ProductEntity.
 * Used when creating a new product from form submission.
 */
export function formDataToEntity(
  formData: ProductFormData,
  category: EntityRef,
  brand: EntityRef,
  unit: UnitRef,
): Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: formData.productName,
    sku: formData.sku,
    barcode: formData.barcode,
    category,
    brand,
    unit,
    description: formData.description,
    purchasePrice: Number(formData.purchasePrice) || 0,
    sellingPrice: Number(formData.sellingPrice) || 0,
    tax: Number(formData.tax) || 0,
    discount: Number(formData.discount) || 0,
    stock: Number(formData.initialStock) || 0,
    minStock: Number(formData.minStock) || 0,
    maxStock: Number(formData.maxStock) || 0,
    trackInventory: formData.trackInventory,
    image: formData.imageUrl || undefined,
    status: formData.status,
  };
}

/**
 * ProductFormModel — Domain alias for the UI form data type.
 * Reuses ProductFormData to avoid duplication.
 */
export type ProductFormModel = import('../types/productForm').ProductFormData;

/**
 * Map ProductDTO → Partial<ProductFormData> for edit mode.
 * The inverse of formDataToEntity.
 */
export function entityToFormData(
  dto: ProductDTO,
): Partial<ProductFormData> {
  return {
    productName: dto.name,
    // CRITICAL: without this, Edit mode leaves produceKey empty forever,
    // validation fails silently and the Save button stays disabled.
    produceKey: dto.produceKey || '',
    sku: dto.sku,
    barcode: dto.barcode,
    categoryId: dto.category.id,
    brandId: dto.brand.id,
    unitId: dto.unit.id,
    description: dto.description,
    purchasePrice: String(dto.purchasePrice),
    sellingPrice: String(dto.sellingPrice),
    tax: String(dto.tax),
    discount: String(dto.discount),
    initialStock: String(dto.stock),
    minStock: String(dto.minStock),
    maxStock: String(dto.maxStock),
    trackInventory: dto.trackInventory,
    imageUrl: dto.image || '',
    status: dto.status === 'inactive' ? 'inactive' : 'active',
  };
}

