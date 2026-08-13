/* ============================================================
   GSDS v1.1 — Inventory Module Constants
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4
   ============================================================ */

import type {
  InventoryColumn,
  InventoryStatus,
  InventoryFilters,
  MovementType,
  MovementStatus,
} from '../types/inventory';

/**
 * Inventory status options for filtering.
 */
export const INVENTORY_STATUS_OPTIONS: { value: InventoryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'in_stock', label: 'in_stock' },
  { value: 'low_stock', label: 'low_stock' },
  { value: 'out_of_stock', label: 'out_of_stock' },
  { value: 'overstocked', label: 'overstocked' },
];

/**
 * Inventory status display configuration (badge class).
 */
export const INVENTORY_STATUS_CONFIG: Record<InventoryStatus, { label: string; className: string }> = {
  in_stock: { label: 'In Stock', className: 'gsd-badge--success' },
  low_stock: { label: 'Low Stock', className: 'gsd-badge--warning' },
  out_of_stock: { label: 'Out of Stock', className: 'gsd-badge--danger' },
  overstocked: { label: 'Overstocked', className: 'gsd-badge--neutral' },
};

/**
 * Inventory table columns definition.
 */
export const INVENTORY_TABLE_COLUMNS: InventoryColumn[] = [
  { id: 'product', label: 'Product', sortable: true, width: '220px' },
  { id: 'sku', label: 'SKU', sortable: true, width: '110px' },
  { id: 'barcode', label: 'Barcode', sortable: true, width: '130px' },
  { id: 'quantityOnHand', label: 'On Hand', sortable: true, width: '90px' },
  { id: 'quantityReserved', label: 'Reserved', sortable: true, width: '90px' },
  { id: 'quantityAvailable', label: 'Available', sortable: true, width: '90px' },
  { id: 'location', label: 'Location', sortable: true, width: '150px' },
  { id: 'status', label: 'Status', sortable: true, width: '120px' },
  { id: 'lastMovementAt', label: 'Last Movement', sortable: true, width: '140px' },
  { id: 'actions', label: 'Actions', sortable: false, width: '100px' },
];

/**
 * Default inventory filter state.
 */
export const DEFAULT_INVENTORY_FILTERS: InventoryFilters = {
  search: '',
  status: 'all',
  locationId: null,
  sortBy: 'quantityOnHand',
  sortDirection: 'desc',
  rowsPerPage: 10,
};

/**
 * Movement type display configuration.
 */
export const MOVEMENT_TYPE_CONFIG: Record<MovementType, { label: string; className: string }> = {
  stock_in: { label: 'Stock In', className: 'gsd-badge--success' },
  stock_out: { label: 'Stock Out', className: 'gsd-badge--danger' },
  adjustment: { label: 'Adjustment', className: 'gsd-badge--warning' },
  transfer: { label: 'Transfer', className: 'gsd-badge--info' },
  sale: { label: 'Sale', className: 'gsd-badge--neutral' },
  purchase: { label: 'Purchase', className: 'gsd-badge--neutral' },
};

/**
 * Movement type options for filtering.
 */
export const MOVEMENT_TYPE_OPTIONS: { value: MovementType | 'all'; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'stock_in', label: 'stock_in' },
  { value: 'stock_out', label: 'stock_out' },
  { value: 'adjustment', label: 'adjustment' },
  { value: 'transfer', label: 'transfer' },
  { value: 'sale', label: 'sale' },
  { value: 'purchase', label: 'purchase' },
];

/**
 * Movement status display configuration.
 */
export const MOVEMENT_STATUS_CONFIG: Record<MovementStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'gsd-badge--warning' },
  completed: { label: 'Completed', className: 'gsd-badge--success' },
  cancelled: { label: 'Cancelled', className: 'gsd-badge--danger' },
};

/**
 * Movement status options for filtering.
 */
export const MOVEMENT_STATUS_OPTIONS: { value: MovementStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'pending', label: 'pending' },
  { value: 'completed', label: 'completed' },
  { value: 'cancelled', label: 'cancelled' },
];

/**
 * Rows per page options.
 */
export const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

/**
 * Sort-by options for the inventory dropdown.
 */
export const INVENTORY_SORT_BY_OPTIONS: { value: string; label: string }[] = [
  { value: 'quantityOnHand', label: 'On Hand' },
  { value: 'quantityReserved', label: 'Reserved' },
  { value: 'quantityAvailable', label: 'Available' },
  { value: 'location', label: 'Location' },
  { value: 'status', label: 'Status' },
  { value: 'lastMovementAt', label: 'Last Movement' },
  { value: 'updatedAt', label: 'Updated Date' },
];

