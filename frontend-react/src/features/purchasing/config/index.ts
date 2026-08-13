/* ============================================================
   GSDS v1.1 — Purchasing Module Configuration
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6
   ============================================================ */

/**
 * Purchasing module route paths.
 * Centralised to avoid hardcoded strings across the codebase.
 */
export const PURCHASING_ROUTES = {
  /** Purchase dashboard page */
  dashboard: '/purchasing',
  /** Purchase orders list page */
  orders: '/purchasing/orders',
  /** Create purchase order page */
  create: '/purchasing/create',
  /** Purchase order details page (requires :id) */
  details: '/purchasing/:id',
  /** Goods receiving page */
  goodsReceiving: '/purchasing/goods-receiving',
  /** Purchase returns page */
  returns: '/purchasing/returns',
  /** Purchase reports page */
  reports: '/purchasing/reports',
  /** Purchase analytics page */
  analytics: '/purchasing/analytics',
} as const;

/**
 * Helper to build a dynamic purchase route path.
 */
export const buildPurchaseRoute = {
  details: (id: string) => `/purchasing/${id}`,
};

/**
 * Module metadata.
 */
export const PURCHASING_MODULE = {
  name: 'Purchasing',
  description: 'Purchasing Management Module',
  version: '4.6.0',
  icon: 'ShoppingCart',
} as const;
