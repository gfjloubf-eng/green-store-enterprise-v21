/* ============================================================
   GSDS v1.1 — Product Module Configuration
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.1
   ============================================================ */

/**
 * Product module route paths.
 * Centralised to avoid hardcoded strings across the codebase.
 */
export const PRODUCT_ROUTES = {
  /** Products list page */
  list: '/products',
  /** Create product page */
  create: '/products/create',
  /** Edit product page (requires :id) */
  edit: '/products/:id/edit',
  /** Product details page (requires :id) */
  details: '/products/:id',
  /** Categories management page */
  categories: '/products/categories',
  /** Brands management page */
  brands: '/products/brands',
  /** Units management page */
  units: '/products/units',
  /** Barcode management page */
  barcode: '/products/barcode',
} as const;

/**
 * Helper to build a dynamic route path.
 */
export const buildProductRoute = {
  edit: (id: string) => `/products/${id}/edit`,
  details: (id: string) => `/products/${id}`,
};

/**
 * Module metadata.
 */
export const PRODUCT_MODULE = {
  name: 'Products',
  description: 'Product Management Module',
  version: '4.1.0',
  icon: 'Package',
} as const;
