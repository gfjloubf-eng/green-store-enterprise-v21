/* ============================================================
   GSDS v1.1 — Purchasing Module Types
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — Lightweight type definitions
   ============================================================
   Purchasing types are purchasing-specific only.
   Product information is referenced by productId and resolved
   through the existing ProductService. Supplier information is
   referenced by supplierId and resolved through SupplierService.
   ============================================================ */

/**
 * Purchase order lifecycle status.
 */
export type PurchaseStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'partially_received'
  | 'received'
  | 'cancelled';

/**
 * Supplier reference (denormalised for convenience).
 */
export interface SupplierRef {
  /** Unique identifier */
  id: string;
  /** Supplier display name */
  name: string;
}

/**
 * Purchase item input — used when creating/editing line items.
 */
export interface PurchaseItemInput {
  /** Reference to the ProductEntity */
  productId: string;
  /** Quantity ordered */
  quantity: number;
  /** Unit cost per item */
  unitCost: number;
  /** Optional tax rate (0–100) */
  taxRate?: number;
  /** Optional discount per item */
  discount?: number;
}

/**
 * Purchase order summary — lightweight view model for the table.
 * Full entity is defined in the domain layer.
 */
export interface PurchaseOrderSummary {
  /** Unique identifier */
  id: string;
  /** Purchase order code (human readable reference) */
  code: string;
  /** Supplier reference */
  supplier: SupplierRef;
  /** Order status */
  status: PurchaseStatus;
  /** Number of line items */
  itemCount: number;
  /** Total quantity ordered */
  totalQuantity: number;
  /** Total order value (cost) */
  totalCost: number;
  /** Expected delivery date ISO string (optional) */
  expectedAt?: string;
  /** Order date ISO string */
  orderedAt: string;
  /** Created date ISO string */
  createdAt: string;
  /** Updated date ISO string */
  updatedAt: string;
}

/**
 * Purchase order column identifiers for the table.
 */
export type PurchaseColumnId =
  | 'code'
  | 'supplier'
  | 'status'
  | 'itemCount'
  | 'totalQuantity'
  | 'totalCost'
  | 'expectedAt'
  | 'orderedAt'
  | 'createdAt'
  | 'updatedAt'
  | 'actions';

/**
 * Purchase order table column definition.
 */
export interface PurchaseColumn {
  id: PurchaseColumnId;
  label: string;
  sortable?: boolean;
  width?: string;
}

/**
 * Filter state for the purchase order list.
 */
export interface PurchaseFilters {
  /** Search query (code, supplier name) */
  search: string;
  /** Selected purchase status */
  status: PurchaseStatus | 'all';
  /** Selected supplier ID */
  supplierId: string | null;
  /** Sort column */
  sortBy: PurchaseColumnId;
  /** Sort direction */
  sortDirection: 'asc' | 'desc';
  /** Rows per page */
  rowsPerPage: number;
}
