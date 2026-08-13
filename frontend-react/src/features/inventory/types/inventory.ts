/* ============================================================
   GSDS v1.1 — Inventory Module Types
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Lightweight type definitions
   ============================================================
   Inventory types are inventory-specific only.
   Product information is referenced by productId and resolved
   through the existing ProductService.
   ============================================================ */

/**
 * Inventory stock status derived from current quantity vs thresholds.
 */
export type InventoryStatus =
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock'
  | 'overstocked';

/**
 * Stock movement types.
 * Designed to support future Sales, Purchases and Adjustments
 * without breaking changes.
 */
export type MovementType =
  | 'stock_in'
  | 'stock_out'
  | 'adjustment'
  | 'transfer'
  | 'sale'
  | 'purchase';

/**
 * Stock movement lifecycle status.
 */
export type MovementStatus = 'pending' | 'completed' | 'cancelled';

/**
 * Physical location where stock is stored.
 */
export interface InventoryLocation {
  /** Unique identifier */
  id: string;
  /** Location display name */
  name: string;
  /** Location type */
  type: 'warehouse' | 'shelf' | 'display';
}

/**
 * Inventory summary — lightweight view model for the inventory table.
 * Full entity is defined in the domain layer.
 */
export interface InventorySummary {
  /** Inventory record ID */
  id: string;
  /** Reference to the ProductEntity */
  productId: string;
  /** Product display name (resolved via ProductService) */
  productName: string;
  /** Product SKU (resolved via ProductService) */
  sku: string;
  /** Product barcode (resolved via ProductService) */
  barcode: string;
  /** Current stock quantity on hand */
  quantityOnHand: number;
  /** Quantity committed to open orders (reserved) */
  quantityReserved: number;
  /** Quantity available (on-hand minus reserved) */
  quantityAvailable: number;
  /** Minimum stock threshold */
  minStock: number;
  /** Maximum stock threshold */
  maxStock: number;
  /** Current location reference */
  location: { id: string; name: string; type: InventoryLocation['type'] };
  /** Derived stock status */
  status: InventoryStatus;
  /** Last movement date ISO string */
  lastMovementAt: string;
  /** Updated date ISO string */
  updatedAt: string;
}

/**
 * Inventory column identifiers for the table.
 */
export type InventoryColumnId =
  | 'product'
  | 'sku'
  | 'barcode'
  | 'quantityOnHand'
  | 'quantityReserved'
  | 'quantityAvailable'
  | 'location'
  | 'status'
  | 'lastMovementAt'
  | 'actions'
  | 'updatedAt';

/**
 * Inventory table column definition.
 */
export interface InventoryColumn {
  id: InventoryColumnId;
  label: string;
  sortable?: boolean;
  width?: string;
}

/**
 * Filter state for the inventory list.
 */
export interface InventoryFilters {
  /** Search query (product name, SKU, barcode) */
  search: string;
  /** Selected status */
  status: InventoryStatus | 'all';
  /** Selected location ID */
  locationId: string | null;
  /** Sort column */
  sortBy: InventoryColumnId;
  /** Sort direction */
  sortDirection: 'asc' | 'desc';
  /** Rows per page */
  rowsPerPage: number;
}

/**
 * Movement filter state for the movements table.
 */
export interface MovementFilters {
  /** Search query (product name, reference, reason) */
  search: string;
  /** Selected movement type */
  type: MovementType | 'all';
  /** Selected movement status */
  status: MovementStatus | 'all';
  /** Sort column */
  sortBy: string;
  /** Sort direction */
  sortDirection: 'asc' | 'desc';
  /** Rows per page */
  rowsPerPage: number;
}

