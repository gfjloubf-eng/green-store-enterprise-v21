/* ============================================================
   GSDS v1.1 — Purchasing Module Constants
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6
   ============================================================ */

import type {
  PurchaseColumn,
  PurchaseStatus,
  PurchaseFilters,
} from '../types/purchasing';

/**
 * Purchase status options for filtering.
 */
export const PURCHASE_STATUS_OPTIONS: { value: PurchaseStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'draft', label: 'draft' },
  { value: 'pending', label: 'pending' },
  { value: 'approved', label: 'approved' },
  { value: 'partially_received', label: 'partially_received' },
  { value: 'received', label: 'received' },
  { value: 'cancelled', label: 'cancelled' },
];

/**
 * Purchase status display configuration (badge class).
 */
export const PURCHASE_STATUS_CONFIG: Record<PurchaseStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'gsd-badge--neutral' },
  pending: { label: 'Pending', className: 'gsd-badge--warning' },
  approved: { label: 'Approved', className: 'gsd-badge--info' },
  partially_received: { label: 'Partially Received', className: 'gsd-badge--accent' },
  received: { label: 'Received', className: 'gsd-badge--success' },
  cancelled: { label: 'Cancelled', className: 'gsd-badge--danger' },
};

/**
 * Purchase table columns definition.
 */
export const PURCHASE_TABLE_COLUMNS: PurchaseColumn[] = [
  { id: 'code', label: 'Code', sortable: true, width: '100px' },
  { id: 'supplier', label: 'Supplier', sortable: true, width: '200px' },
  { id: 'status', label: 'Status', sortable: true, width: '140px' },
  { id: 'itemCount', label: 'Items', sortable: true, width: '80px' },
  { id: 'totalQuantity', label: 'Qty', sortable: true, width: '80px' },
  { id: 'totalCost', label: 'Total', sortable: true, width: '130px' },
  { id: 'expectedAt', label: 'Expected', sortable: true, width: '130px' },
  { id: 'orderedAt', label: 'Ordered', sortable: true, width: '130px' },
  { id: 'actions', label: 'Actions', sortable: false, width: '100px' },
];

/**
 * Default purchase filter state.
 */
export const DEFAULT_PURCHASE_FILTERS: PurchaseFilters = {
  search: '',
  status: 'all',
  supplierId: null,
  sortBy: 'code',
  sortDirection: 'asc',
  rowsPerPage: 10,
};

/**
 * Rows per page options.
 */
export const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

/**
 * Sort-by options for the purchase dropdown.
 */
export const PURCHASE_SORT_BY_OPTIONS: { value: string; label: string }[] = [
  { value: 'code', label: 'Code' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'status', label: 'Status' },
  { value: 'itemCount', label: 'Items' },
  { value: 'totalQuantity', label: 'Quantity' },
  { value: 'totalCost', label: 'Total' },
  { value: 'expectedAt', label: 'Expected Date' },
  { value: 'orderedAt', label: 'Order Date' },
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' },
];
