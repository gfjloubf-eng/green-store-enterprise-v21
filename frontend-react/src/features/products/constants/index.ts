/* ============================================================
   GSDS v1.1 — Product Module Constants
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.1
   ============================================================ */

import type { ProductColumn, ProductStatus, ProductFilters } from '../types/product';

/**
 * Status options for filtering.
 */
export const PRODUCT_STATUS_OPTIONS: { value: ProductStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'active', label: 'active' },
  { value: 'inactive', label: 'inactive' },
  { value: 'draft', label: 'draft' },
  { value: 'discontinued', label: 'discontinued' },
];

/**
 * Status display configuration (label, color class).
 */
export const PRODUCT_STATUS_CONFIG: Record<ProductStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'gsd-badge--success' },
  inactive: { label: 'Inactive', className: 'gsd-badge--neutral' },
  draft: { label: 'Draft', className: 'gsd-badge--warning' },
  discontinued: { label: 'Discontinued', className: 'gsd-badge--danger' },
};

/**
 * Product table columns definition.
 */
export const PRODUCT_TABLE_COLUMNS: ProductColumn[] = [
  { id: 'image', label: 'Image', sortable: false, width: '64px' },
  { id: 'barcode', label: 'Barcode', sortable: true, width: '120px' },
  { id: 'sku', label: 'SKU', sortable: true, width: '120px' },
  { id: 'name', label: 'Product Name', sortable: true, width: '200px' },
  { id: 'category', label: 'Category', sortable: true, width: '130px' },
  { id: 'brand', label: 'Brand', sortable: true, width: '130px' },
  { id: 'unit', label: 'Unit', sortable: true, width: '80px' },
  { id: 'purchasePrice', label: 'Purchase Price', sortable: true, width: '130px' },
  { id: 'sellingPrice', label: 'Selling Price', sortable: true, width: '130px' },
  { id: 'stock', label: 'Stock', sortable: true, width: '80px' },
  { id: 'status', label: 'Status', sortable: true, width: '110px' },
  { id: 'createdAt', label: 'Created Date', sortable: true, width: '140px' },
  { id: 'updatedAt', label: 'Updated Date', sortable: true, width: '140px' },
  { id: 'actions', label: 'Actions', sortable: false, width: '100px' },
];

/**
 * Default filter state.
 */
export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  search: '',
  categoryId: null,
  brandId: null,
  status: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  rowsPerPage: 10,
};

/**
 * Rows per page options.
 */
export const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

/**
 * Sort-by options for the dropdown.
 */
export const SORT_BY_OPTIONS: { value: string; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'barcode', label: 'Barcode' },
  { value: 'sku', label: 'SKU' },
  { value: 'purchasePrice', label: 'Purchase Price' },
  { value: 'sellingPrice', label: 'Selling Price' },
  { value: 'stock', label: 'Stock' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' },
];

/**
 * Mock category options for filter dropdown.
 */
export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Vegetables' },
  { id: 'cat-2', name: 'Fruits' },
  { id: 'cat-3', name: 'Herbs' },
  { id: 'cat-4', name: 'Dairy' },
  { id: 'cat-5', name: 'Beverages' },
];

/**
 * Mock brand options for filter dropdown.
 */
export const MOCK_BRANDS = [
  { id: 'br-1', name: 'Green Farm' },
  { id: 'br-2', name: 'Nature\'s Best' },
  { id: 'br-3', name: 'Organic Valley' },
  { id: 'br-4', name: 'Fresh Harvest' },
  { id: 'br-5', name: 'EcoGrow' },
];
