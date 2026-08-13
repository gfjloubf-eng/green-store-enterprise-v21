/* ============================================================
   GSDS v1.1 — Purchasing State Machine
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — Clean state management for Purchasing Module
   ============================================================
   Discriminated union type for all purchasing states.
   States: Loading | Ready | Success | Empty | Error.
   Every state transition is explicit and type-safe.
   ============================================================ */

/**
 * Generic purchasing state discriminated union.
 * T is the data type for success state.
 */
export type PurchasingState<T> =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string };

/**
 * Helper to create a loading state.
 */
export function loadingState<T>(): PurchasingState<T> {
  return { status: 'loading' };
}

/**
 * Helper to create a ready state (initialized, no data yet).
 */
export function readyState<T>(): PurchasingState<T> {
  return { status: 'ready' };
}

/**
 * Helper to create a success state.
 */
export function successState<T>(data: T): PurchasingState<T> {
  return { status: 'success', data };
}

/**
 * Helper to create an empty state.
 */
export function emptyState<T>(): PurchasingState<T> {
  return { status: 'empty' };
}

/**
 * Helper to create an error state.
 */
export function errorState<T>(message: string): PurchasingState<T> {
  return { status: 'error', message };
}

/**
 * Check if a state is in a specific status.
 */
export function isState<T>(
  state: PurchasingState<T>,
  status: PurchasingState<T>['status'],
): boolean {
  return state.status === status;
}

/**
 * Get data from a success state (undefined otherwise).
 */
export function getData<T>(state: PurchasingState<T>): T | undefined {
  return state.status === 'success' ? state.data : undefined;
}

/**
 * Get the error message from an error state.
 */
export function getErrorMessage<T>(state: PurchasingState<T>): string | undefined {
  return state.status === 'error' ? state.message : undefined;
}

/**
 * Purchase orders list state — specific to the purchase orders page.
 */
export type PurchaseListState = PurchasingState<{
  orders: import('../domain/purchaseTableModel').PurchaseTableModel[];
  total: number;
  page: number;
  totalPages: number;
}>;

/**
 * Purchase order detail state — specific to the purchase details page.
 */
export type PurchaseDetailState = PurchasingState<
  import('../domain/purchaseDTO').PurchaseDTO
>;

/**
 * Purchase dashboard state — summary + recent orders.
 */
export type PurchaseDashboardState = PurchasingState<{
  summary: {
    totalOrders: number;
    pendingOrders: number;
    approvedOrders: number;
    receivedOrders: number;
    totalSpend: number;
    itemsOrdered: number;
  };
  recentOrders: import('../domain/purchaseTableModel').PurchaseTableModel[];
  statusBreakdown: {
    id: string;
    name: string;
    count: number;
  }[];
}>;
