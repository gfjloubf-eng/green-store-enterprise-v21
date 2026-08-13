/* ============================================================
   GSDS v1.1 — Product State Machine
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.3 — Clean state management for Product Module
   ============================================================
   Discriminated union type for all product states.
   Every state transition is explicit and type-safe.
   ============================================================ */

/**
 * Generic state discriminated union.
 * T is the data type for success state.
 */
export type ProductState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string }
  | { status: 'ready' };

/**
 * Helper to create a loading state.
 */
export function loadingState<T>(): ProductState<T> {
  return { status: 'loading' };
}

/**
 * Helper to create a success state.
 */
export function successState<T>(data: T): ProductState<T> {
  return { status: 'success', data };
}

/**
 * Helper to create an empty state.
 */
export function emptyState<T>(): ProductState<T> {
  return { status: 'empty' };
}

/**
 * Helper to create an error state.
 */
export function errorState<T>(message: string): ProductState<T> {
  return { status: 'error', message };
}

/**
 * Helper to create a ready state (initialized, no data yet).
 */
export function readyState<T>(): ProductState<T> {
  return { status: 'ready' };
}

/**
 * Check if a state is in a specific status.
 */
export function isState<T>(
  state: ProductState<T>,
  status: ProductState<T>['status'],
): boolean {
  return state.status === status;
}

/**
 * Get data from a success state (undefined otherwise).
 */
export function getData<T>(state: ProductState<T>): T | undefined {
  return state.status === 'success' ? state.data : undefined;
}

/**
 * Get the error message from an error state.
 */
export function getErrorMessage<T>(state: ProductState<T>): string | undefined {
  return state.status === 'error' ? state.message : undefined;
}

/**
 * Product list state — specific to the products list page.
 */
export type ProductListState = ProductState<{
  products: import('../domain/productTableModel').ProductTableModel[];
  total: number;
  page: number;
  totalPages: number;
}>;

/**
 * Product detail state — specific to the product details page.
 */
export type ProductDetailState = ProductState<import('../domain/productDTO').ProductDTO>;
