/* ============================================================
   GSDS v1.1 — Product Module Types
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.1 — Lightweight type definitions
   ============================================================ */

/**
 * Product status options.
 */
export type ProductStatus = 'active' | 'inactive' | 'draft' | 'discontinued';

/**
 * Product summary — lightweight view model for the products table.
 * Full product entity will be added in a later milestone.
 */
export interface ProductSummary {
  /** Unique identifier */
  id: string;
  /** Product image URL */
  image?: string;
  /** Barcode / SKU identifier */
  barcode: string;
  /** Stock Keeping Unit */
  sku: string;
  /** Product display name */
  name: string;
  /** Category reference */
  category: CategorySummary;
  /** Brand reference */
  brand: BrandSummary;
  /** Unit reference */
  unit: UnitSummary;
  /** Purchase price (cost) */
  purchasePrice: number;
  /** Selling price (retail) */
  sellingPrice: number;
  /** Current stock quantity */
  stock: number;
  /** Status */
  status: ProductStatus;
  /** Created date ISO string */
  createdAt: string;
  /** Updated date ISO string */
  updatedAt: string;
}

/**
 * Category summary.
 */
export interface CategorySummary {
  id: string;
  name: string;
}

/**
 * Brand summary.
 */
export interface BrandSummary {
  id: string;
  name: string;
}

/**
 * Unit summary.
 */
export interface UnitSummary {
  id: string;
  name: string;
  abbreviation: string;
}

/**
 * Table column identifier.
 */
export type ProductColumnId =
  | 'image'
  | 'barcode'
  | 'sku'
  | 'name'
  | 'category'
  | 'brand'
  | 'unit'
  | 'purchasePrice'
  | 'sellingPrice'
  | 'stock'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'actions';

/**
 * Table column definition.
 */
export interface ProductColumn {
  id: ProductColumnId;
  label: string;
  sortable?: boolean;
  width?: string;
}

/**
 * Filter state for the products list.
 */
export interface ProductFilters {
  /** Search query */
  search: string;
  /** Selected category ID */
  categoryId: string | null;
  /** Selected brand ID */
  brandId: string | null;
  /** Selected status */
  status: ProductStatus | 'all';
  /** Sort column */
  sortBy: ProductColumnId;
  /** Sort direction */
  sortDirection: 'asc' | 'desc';
  /** Rows per page */
  rowsPerPage: number;
}
