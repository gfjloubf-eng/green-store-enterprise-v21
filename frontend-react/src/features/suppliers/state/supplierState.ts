/* ============================================================
   GSDS v1.1 — Supplier State Machine
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Clean state management for Supplier Module
   ============================================================
   Discriminated union type for all supplier states.
   States: Loading | Ready | Success | Empty | Error.
   Every state transition is explicit and type-safe.
   ============================================================ */

/**
 * Generic supplier state discriminated union.
 * T is the data type for success state.
 */
export type SupplierState<T> =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string };

/**
 * Helper to create a loading state.
 */
export function loadingState<T>(): SupplierState<T> {
  return { status: 'loading' };
}

/**
 * Helper to create a ready state (initialized, no data yet).
 */
export function readyState<T>(): SupplierState<T> {
  return { status: 'ready' };
}

/**
 * Helper to create a success state.
 */
export function successState<T>(data: T): SupplierState<T> {
  return { status: 'success', data };
}

/**
 * Helper to create an empty state.
 */
export function emptyState<T>(): SupplierState<T> {
  return { status: 'empty' };
}

/**
 * Helper to create an error state.
 */
export function errorState<T>(message: string): SupplierState<T> {
  return { status: 'error', message };
}

/**
 * Check if a state is in a specific status.
 */
export function isState<T>(
  state: SupplierState<T>,
  status: SupplierState<T>['status'],
): boolean {
  return state.status === status;
}

/**
 * Get data from a success state (undefined otherwise).
 */
export function getData<T>(state: SupplierState<T>): T | undefined {
  return state.status === 'success' ? state.data : undefined;
}

/**
 * Get the error message from an error state.
 */
export function getErrorMessage<T>(state: SupplierState<T>): string | undefined {
  return state.status === 'error' ? state.message : undefined;
}

/**
 * Supplier list state — specific to the suppliers list page.
 */
export type SupplierListState = SupplierState<{
  suppliers: import('../domain/supplierTableModel').SupplierTableModel[];
  total: number;
  page: number;
  totalPages: number;
}>;

/**
 * Supplier detail state — specific to the supplier details page.
 */
export type SupplierDetailState = SupplierState<
  import('../domain/supplierDTO').SupplierDTO
>;

/**
 * Supplier dashboard state — summary + recent suppliers + top suppliers.
 */
export type SupplierDashboardState = SupplierState<{
  summary: {
    totalSuppliers: number;
    activeSuppliers: number;
    pendingSuppliers: number;
    totalPurchases: number;
    totalProducts: number;
    avgRating: number;
  };
  recentSuppliers: import('../domain/supplierTableModel').SupplierTableModel[];
  topSuppliers: import('../domain/supplierTableModel').SupplierTableModel[];
  categoryBreakdown: {
    id: string;
    name: string;
    count: number;
  }[];
}>;

