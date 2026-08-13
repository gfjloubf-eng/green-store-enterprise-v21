/* ============================================================
   GSDS v1.1 — Product Entity (Domain Model)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.3 — Pure domain model, no framework dependencies
   ============================================================
   ProductEntity is the canonical domain model.
   All other models (DTO, Form, Table, Filter) derive from this.
   ============================================================ */

import type { ProductStatus } from '../types/product';

/**
 * Reference to a related entity (category, brand, unit).
 */
export interface EntityRef {
  id: string;
  name: string;
}

/**
 * Unit reference with abbreviation.
 */
export interface UnitRef extends EntityRef {
  abbreviation: string;
}

/**
 * ProductEntity — Full domain model for a product.
 * This is the single source of truth for all product data.
 */
export interface ProductEntity {
  /** Unique identifier */
  id: string;
  /** Product display name */
  name: string;
  /** Stock Keeping Unit */
  sku: string;
  /** Barcode / SKU identifier */
  barcode: string;
  /** Category reference */
  category: EntityRef;
  /** Brand reference */
  brand: EntityRef;
  /** Unit reference */
  unit: UnitRef;
  /** Product description */
  description: string;
  /** Purchase price (cost) */
  purchasePrice: number;
  /** Selling price (retail) */
  sellingPrice: number;
  /** Tax percentage */
  tax: number;
  /** Discount value */
  discount: number;
  /** Current stock quantity */
  stock: number;
  /** Minimum stock threshold */
  minStock: number;
  /** Maximum stock threshold */
  maxStock: number;
  /** Whether inventory tracking is enabled */
  trackInventory: boolean;
  /** Product image URL */
  image?: string;
  /** Product status */
  status: ProductStatus;
  /** Created date ISO string */
  createdAt: string;
  /** Updated date ISO string */
  updatedAt: string;
}

/**
 * Create a new product entity with generated fields.
 * Used by the service layer to construct entities from form data.
 */
export function createProductEntity(
  data: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>,
): ProductEntity {
  const now = new Date().toISOString();
  return {
    ...data,
    id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update an existing product entity with partial data.
 * Automatically refreshes the updatedAt timestamp.
 */
export function updateProductEntity(
  entity: ProductEntity,
  updates: Partial<Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>>,
): ProductEntity {
  return {
    ...entity,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

