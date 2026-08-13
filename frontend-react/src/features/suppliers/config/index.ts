/* ============================================================
   GSDS v1.1 — Supplier Module Configuration
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5
   ============================================================ */

/**
 * Supplier module route paths.
 * Centralised to avoid hardcoded strings across the codebase.
 */
export const SUPPLIER_ROUTES = {
  /** Supplier dashboard page */
  dashboard: '/suppliers',
  /** Supplier list page */
  list: '/suppliers/list',
  /** Create supplier page */
  create: '/suppliers/create',
  /** Edit supplier page (requires :id) */
  edit: '/suppliers/:id/edit',
  /** Supplier details page (requires :id) */
  details: '/suppliers/:id',
  /** Supplier categories page */
  categories: '/suppliers/categories',
  /** Supplier contacts page */
  contacts: '/suppliers/contacts',
  /** Supplier reports page */
  reports: '/suppliers/reports',
} as const;

/**
 * Helper to build a dynamic supplier route path.
 */
export const buildSupplierRoute = {
  edit: (id: string) => `/suppliers/${id}/edit`,
  details: (id: string) => `/suppliers/${id}`,
};

/**
 * Module metadata.
 */
export const SUPPLIER_MODULE = {
  name: 'Suppliers',
  description: 'Supplier Management Module',
  version: '4.5.0',
  icon: 'Truck',
} as const;

