/* ============================================================
   GSDS v1.1 — Supplier Module Types
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Lightweight type definitions
   ============================================================
   Supplier types are supplier-specific only.
   Product information is referenced by productId and resolved
   through the existing ProductService when needed.
   ============================================================ */

/**
 * Supplier lifecycle status.
 */
export type SupplierStatus = 'active' | 'inactive' | 'suspended' | 'pending';

/**
 * Supplier category reference.
 */
export interface SupplierCategoryRef {
  /** Unique identifier */
  id: string;
  /** Category display name */
  name: string;
}

/**
 * Supplier primary contact information.
 */
export interface SupplierContact {
  /** Contact person full name */
  name: string;
  /** Contact person role / title */
  role?: string;
  /** Contact email address */
  email: string;
  /** Contact phone number */
  phone: string;
  /** Optional secondary phone number */
  phoneAlt?: string;
}

/**
 * Supplier summary — lightweight view model for the suppliers table.
 * Full entity is defined in the domain layer.
 */
export interface SupplierSummary {
  /** Unique identifier */
  id: string;
  /** Supplier code (human readable reference) */
  code: string;
  /** Supplier display name */
  name: string;
  /** Supplier category reference */
  category: SupplierCategoryRef;
  /** Primary contact reference */
  contact: SupplierContact;
  /** Primary email address (denormalised for table) */
  email: string;
  /** Primary phone number (denormalised for table) */
  phone: string;
  /** Supplier city */
  city: string;
  /** Supplier country */
  country: string;
  /** Supplier status */
  status: SupplierStatus;
  /** Number of products supplied */
  productCount: number;
  /** Total purchase value (mock aggregate) */
  totalPurchases: number;
  /** Last order date ISO string (optional) */
  lastOrderAt?: string;
  /** Created date ISO string */
  createdAt: string;
  /** Updated date ISO string */
  updatedAt: string;
}

/**
 * Supplier column identifiers for the table.
 */
export type SupplierColumnId =
  | 'code'
  | 'name'
  | 'category'
  | 'contact'
  | 'email'
  | 'phone'
  | 'city'
  | 'status'
  | 'productCount'
  | 'totalPurchases'
  | 'lastOrderAt'
  | 'createdAt'
  | 'updatedAt'
  | 'actions';

/**
 * Supplier table column definition.
 */
export interface SupplierColumn {
  id: SupplierColumnId;
  label: string;
  sortable?: boolean;
  width?: string;
}

/**
 * Filter state for the suppliers list.
 */
export interface SupplierFilters {
  /** Search query (name, code, email, city) */
  search: string;
  /** Selected supplier status */
  status: SupplierStatus | 'all';
  /** Selected supplier category ID */
  categoryId: string | null;
  /** Selected supplier city */
  city: string | null;
  /** Sort column */
  sortBy: SupplierColumnId;
  /** Sort direction */
  sortDirection: 'asc' | 'desc';
  /** Rows per page */
  rowsPerPage: number;
}

/**
 * Supplier category — full category definition.
 */
export interface SupplierCategory {
  /** Unique identifier */
  id: string;
  /** Category display name */
  name: string;
  /** Optional category description */
  description?: string;
  /** Number of suppliers in this category (derived) */
  supplierCount: number;
  /** Total purchase value for the category (mock aggregate) */
  totalPurchases: number;
  /** Created date ISO string */
  createdAt: string;
  /** Updated date ISO string */
  updatedAt: string;
}

