/* ============================================================
   GSDS v1.1 — Inventory Module Configuration
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4
   ============================================================ */

/**
 * Inventory module route paths.
 * Centralised to avoid hardcoded strings across the codebase.
 */
export const INVENTORY_ROUTES = {
  /** Inventory dashboard page */
  dashboard: '/inventory',
  /** Stock overview (full list) */
  overview: '/inventory/overview',
  /** Stock movements history */
  movements: '/inventory/movements',
  /** Stock adjustment page */
  adjustment: '/inventory/adjustment',
  /** Stock transfer page */
  transfer: '/inventory/transfer',
  /** Low stock page */
  lowStock: '/inventory/low-stock',
  /** Out of stock page */
  outOfStock: '/inventory/out-of-stock',
  /** Inventory reports page */
  reports: '/inventory/reports',
} as const;

/**
 * Module metadata.
 */
export const INVENTORY_MODULE = {
  name: 'Inventory',
  description: 'Inventory Management Module',
  version: '4.4.0',
  icon: 'Warehouse',
} as const;

