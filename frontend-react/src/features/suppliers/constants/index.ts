/* ============================================================
   GSDS v1.1 — Supplier Module Constants
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5
   ============================================================ */

import type {
  SupplierColumn,
  SupplierStatus,
  SupplierFilters,
} from '../types/supplier';

/**
 * Supplier status options for filtering.
 */
export const SUPPLIER_STATUS_OPTIONS: { value: SupplierStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'active', label: 'active' },
  { value: 'inactive', label: 'inactive' },
  { value: 'suspended', label: 'suspended' },
  { value: 'pending', label: 'pending' },
];

/**
 * Supplier status display configuration (badge class).
 */
export const SUPPLIER_STATUS_CONFIG: Record<SupplierStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'gsd-badge--success' },
  inactive: { label: 'Inactive', className: 'gsd-badge--neutral' },
  suspended: { label: 'Suspended', className: 'gsd-badge--danger' },
  pending: { label: 'Pending', className: 'gsd-badge--warning' },
};

/**
 * Supplier table columns definition.
 */
export const SUPPLIER_TABLE_COLUMNS: SupplierColumn[] = [
  { id: 'code', label: 'Code', sortable: true, width: '100px' },
  { id: 'name', label: 'Name', sortable: true, width: '200px' },
  { id: 'category', label: 'Category', sortable: true, width: '140px' },
  { id: 'contact', label: 'Contact', sortable: true, width: '160px' },
  { id: 'email', label: 'Email', sortable: true, width: '180px' },
  { id: 'phone', label: 'Phone', sortable: true, width: '130px' },
  { id: 'city', label: 'City', sortable: true, width: '120px' },
  { id: 'status', label: 'Status', sortable: true, width: '110px' },
  { id: 'productCount', label: 'Products', sortable: true, width: '90px' },
  { id: 'totalPurchases', label: 'Total Purchases', sortable: true, width: '140px' },
  { id: 'lastOrderAt', label: 'Last Order', sortable: true, width: '130px' },
  { id: 'actions', label: 'Actions', sortable: false, width: '100px' },
];

/**
 * Default supplier filter state.
 */
export const DEFAULT_SUPPLIER_FILTERS: SupplierFilters = {
  search: '',
  status: 'all',
  categoryId: null,
  city: null,
  sortBy: 'name',
  sortDirection: 'asc',
  rowsPerPage: 10,
};

/**
 * Rows per page options.
 */
export const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

/**
 * Sort-by options for the supplier dropdown.
 */
export const SUPPLIER_SORT_BY_OPTIONS: { value: string; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'code', label: 'Code' },
  { value: 'category', label: 'Category' },
  { value: 'city', label: 'City' },
  { value: 'status', label: 'Status' },
  { value: 'productCount', label: 'Products' },
  { value: 'totalPurchases', label: 'Total Purchases' },
  { value: 'lastOrderAt', label: 'Last Order' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' },
];

