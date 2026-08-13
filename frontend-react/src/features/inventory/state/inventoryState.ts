/* ============================================================
   GSDS v1.1 — Inventory State Machine
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Clean state management for Inventory Module
   ============================================================
   Discriminated union type for all inventory states.
   States: Loading | Ready | Success | Empty | Error.
   Every state transition is explicit and type-safe.
   ============================================================ */

/**
 * Generic inventory state discriminated union.
 * T is the data type for success state.
 */
export type InventoryState<T> =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string };

/**
 * Helper to create a loading state.
 */
export function loadingState<T>(): InventoryState<T> {
  return { status: 'loading' };
}

/**
 * Helper to create a ready state (initialized, no data yet).
 */
export function readyState<T>(): InventoryState<T> {
  return { status: 'ready' };
}

/**
 * Helper to create a success state.
 */
export function successState<T>(data: T): InventoryState<T> {
  return { status: 'success', data };
}

/**
 * Helper to create an empty state.
 */
export function emptyState<T>(): InventoryState<T> {
  return { status: 'empty' };
}

/**
 * Helper to create an error state.
 */
export function errorState<T>(message: string): InventoryState<T> {
  return { status: 'error', message };
}

/**
 * Check if a state is in a specific status.
 */
export function isState<T>(
  state: InventoryState<T>,
  status: InventoryState<T>['status'],
): boolean {
  return state.status === status;
}

/**
 * Get data from a success state (undefined otherwise).
 */
export function getData<T>(state: InventoryState<T>): T | undefined {
  return state.status === 'success' ? state.data : undefined;
}

/**
 * Get the error message from an error state.
 */
export function getErrorMessage<T>(state: InventoryState<T>): string | undefined {
  return state.status === 'error' ? state.message : undefined;
}

/**
 * Inventory list state — specific to the stock overview page.
 */
export type InventoryListState = InventoryState<{
  inventory: import('../domain/inventoryTableModel').InventoryTableModel[];
  total: number;
  page: number;
  totalPages: number;
}>;

/**
 * Movement list state — specific to the stock movements page.
 */
export type MovementListState = InventoryState<{
  movements: import('../domain/movementDTO').MovementDTO[];
  total: number;
  page: number;
  totalPages: number;
}>;

/**
 * Inventory dashboard state — summary + recent movements.
 */
export type InventoryDashboardState = InventoryState<{
  summary: {
    totalProducts: number;
    totalUnits: number;
    lowStockCount: number;
    outOfStockCount: number;
    overstockedCount: number;
  };
  recentMovements: import('../domain/movementDTO').MovementDTO[];
  lowStockItems: import('../domain/inventoryTableModel').InventoryTableModel[];
}>;

