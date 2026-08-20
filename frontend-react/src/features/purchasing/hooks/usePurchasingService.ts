 /* ============================================================
   GSDS v1.1 — usePurchasingService Hooks
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — React hooks for PurchasingService
   ============================================================
   Bridges the framework-agnostic PurchasingService with React.
   Manages state transitions (loading, success, empty, error).
   Pages use these hooks instead of accessing PurchasingService directly.
   ============================================================ */

import { useState, useCallback, useEffect, useRef } from 'react';
import { PurchasingService } from '../services/purchasingService';
import type { PurchaseDTO } from '../domain/purchaseDTO';
import type { PurchaseFilterModel } from '../domain/purchaseFilterModel';
import type { PurchaseTableModel } from '../domain/purchaseTableModel';
import type {
  PurchasingState,
  PurchaseListState,
  PurchaseDetailState,
  PurchaseDashboardState,
} from '../state/purchasingState';
import {
  loadingState,
  successState,
  emptyState,
  errorState,
  readyState,
} from '../state/purchasingState';

/* ─── usePurchaseTableData ─────────────────────────────────── */

/**
 * Hook for the purchase orders table.
 * Combines filter + sort + paginate via PurchasingService.
 */
export function usePurchaseTableData(
  filters: PurchaseFilterModel,
): {
  orders: PurchaseTableModel[];
  total: number;
  totalPages: number;
  isLoading: boolean;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<PurchaseTableModel[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const tableData = PurchasingService.getTableData(filters);
        setOrders(tableData.orders);
        setTotal(tableData.total);
        setTotalPages(tableData.totalPages);
      } catch {
        setOrders([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      setIsLoading(true);
    };
  }, [
    filters.search,
    filters.status,
    filters.supplierId,
    filters.sortBy,
    filters.sortDirection,
    filters.rowsPerPage,
  ]);

  return { orders, total, totalPages, isLoading };
}

/* ─── usePurchaseOrders ────────────────────────────────────── */

/**
 * Hook for the purchase orders list page using the state machine.
 */
export function usePurchaseOrders(
  filters: PurchaseFilterModel,
): PurchaseListState {
  const [state, setState] = useState<PurchaseListState>(loadingState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const tableData = PurchasingService.getTableData(filters);
        if (tableData.orders.length === 0) {
          setState(emptyState());
        } else {
          setState(
            successState({
              orders: tableData.orders,
              total: tableData.total,
              page: tableData.page,
              totalPages: tableData.totalPages,
            }),
          );
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setState(errorState(message));
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [
    filters.search,
    filters.status,
    filters.supplierId,
    filters.sortBy,
    filters.sortDirection,
    filters.rowsPerPage,
  ]);

  return state;
}

/* ─── usePurchaseDetails ───────────────────────────────────── */

/**
 * Hook for the purchase details page.
 */
export function usePurchaseDetails(
  id: string | undefined,
): PurchaseDetailState {
  const [state, setState] = useState<PurchaseDetailState>(() => {
    if (!id) return readyState();
    return loadingState();
  });

  useEffect(() => {
    if (!id) return;

    const timer = setTimeout(() => {
      try {
        const dto = PurchasingService.getById(id);
        if (dto) {
          setState(successState(dto));
        } else {
          setState(errorState(`Purchase order with ID "${id}" was not found.`));
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setState(errorState(message));
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [id]);

  return state;
}

/* ─── usePurchaseMutations ─────────────────────────────────── */

/**
 * Hook for purchase order mutations (create, update, cancel, receive, return).
 * Returns mutation functions that can be called imperatively.
 */
export function usePurchaseMutations() {
  const [createState, setCreateState] = useState<PurchasingState<PurchaseDTO>>(
    readyState,
  );
  const [updateState, setUpdateState] = useState<PurchasingState<PurchaseDTO>>(
    readyState,
  );
  const [actionState, setActionState] = useState<PurchasingState<PurchaseDTO>>(
    readyState,
  );

  const create = (
    data: Parameters<typeof PurchasingService.create>[0],
  ): Promise<PurchaseDTO> => {
    return new Promise((resolve, reject) => {
      setCreateState(loadingState());
      try {
        const dto = PurchasingService.create(data);
        setCreateState(successState(dto));
        resolve(dto);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Create failed';
        setCreateState(errorState(message));
        reject(err);
      }
    });
  };

  const update = (
    id: string,
    updates: Parameters<typeof PurchasingService.update>[1],
  ): Promise<PurchaseDTO> => {
    return new Promise((resolve, reject) => {
      setUpdateState(loadingState());
      try {
        const dto = PurchasingService.update(id, updates);
        if (dto) {
          setUpdateState(successState(dto));
          resolve(dto);
        } else {
          const msg = `Purchase order with ID "${id}" not found for update`;
          setUpdateState(errorState(msg));
          reject(new Error(msg));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Update failed';
        setUpdateState(errorState(message));
        reject(err);
      }
    });
  };

  const runAction = async (
    fn: () => PurchaseDTO | undefined | Promise<PurchaseDTO | undefined>,
    onErrorLabel: string,
  ): Promise<PurchaseDTO> => {
    setActionState(loadingState());
    try {
      const dto = await fn();
      if (dto) {
        setActionState(successState(dto));
        return dto;
      }
      const msg = onErrorLabel;
      setActionState(errorState(msg));
      throw new Error(msg);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Action failed';
      setActionState(errorState(message));
      throw err;
    }
  };

  const cancel = useCallback(
    (id: string) => runAction(() => PurchasingService.cancel(id), 'Cancel failed'),
    [],
  );

  const receive = useCallback(
    (id: string, receivedByProduct: Record<string, number>) =>
      runAction(
        () => PurchasingService.receive(id, receivedByProduct),
        'Receive failed',
      ),
    [],
  );

  const returnItems = useCallback(
    (id: string, returnedByProduct: Record<string, number>) =>
      runAction(
        () => PurchasingService.returnItems(id, returnedByProduct),
        'Return failed',
      ),
    [],
  );

  const resetCreateState = useCallback(() => setCreateState(readyState()), []);
  const resetUpdateState = useCallback(() => setUpdateState(readyState()), []);
  const resetActionState = useCallback(() => setActionState(readyState()), []);

  return {
    create,
    update,
    cancel,
    receive,
    returnItems,
    createState,
    updateState,
    actionState,
    resetCreateState,
    resetUpdateState,
    resetActionState,
  };
}

/* ─── usePurchaseSearch ────────────────────────────────────── */

/**
 * Hook for purchase order search with debounce.
 */
export function usePurchaseSearch(query: string) {
  const [results, setResults] = useState<PurchaseDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    debounceRef.current = setTimeout(() => {
      try {
        const searchResults = PurchasingService.search(query);
        setResults(searchResults);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  return { results, isSearching };
}

/* ─── usePurchaseFilters ───────────────────────────────────── */

/**
 * Hook for filtering purchase orders.
 */
export function usePurchaseFilters(criteria: PurchaseFilterModel) {
  const [filtered, setFiltered] = useState<PurchaseDTO[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const result = PurchasingService.filter(criteria);
        setFiltered(result);
      } catch {
        setFiltered([]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [criteria.search, criteria.status, criteria.supplierId]);

  return filtered;
}

/* ─── usePurchaseDashboard ─────────────────────────────────── */

/**
 * Hook for the purchase dashboard.
 * Returns summary + recent orders + status breakdown.
 */
export function usePurchaseDashboard(): PurchaseDashboardState {
  const [state, setState] = useState<PurchaseDashboardState>(loadingState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const summary = PurchasingService.getSummary();
        const recentOrders = PurchasingService.getRecentOrders(4);
        const statusBreakdown = PurchasingService.getStatusBreakdown();

        if (summary.totalOrders === 0) {
          setState(emptyState());
        } else {
          setState(
            successState({
              summary,
              recentOrders,
              statusBreakdown,
            }),
          );
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred';
        setState(errorState(message));
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return state;
}

/* ─── usePurchasingService ─────────────────────────────────── */

/**
 * Facade hook exposing the PurchasingService API through React.
 * Provides framework-agnostic access to the purchasing domain while
 * keeping pages decoupled from the service implementation.
 */
export function usePurchasingService() {
  const mutations = usePurchaseMutations();

  const getAll = useCallback((): PurchaseDTO[] => {
    return PurchasingService.getAll();
  }, []);

  const getById = useCallback((id: string): PurchaseDTO | undefined => {
    return PurchasingService.getById(id);
  }, []);

  const search = useCallback((query: string): PurchaseDTO[] => {
    return PurchasingService.search(query);
  }, []);

  const filter = useCallback(
    (criteria: PurchaseFilterModel): PurchaseDTO[] => {
      return PurchasingService.filter(criteria);
    },
    [],
  );

  const sort = useCallback(
    (
      orders: PurchaseDTO[],
      sortBy: PurchaseFilterModel['sortBy'],
      sortDirection: PurchaseFilterModel['sortDirection'],
    ): PurchaseDTO[] => {
      return PurchasingService.sort(orders, sortBy, sortDirection);
    },
    [],
  );

  const paginate = useCallback(
    <T>(items: T[], page: number, size: number) => {
      return PurchasingService.paginate(items, page, size);
    },
    [],
  );

  return {
    getAll,
    getById,
    create: mutations.create,
    update: mutations.update,
    cancel: mutations.cancel,
    receive: mutations.receive,
    returnItems: mutations.returnItems,
    search,
    filter,
    sort,
    paginate,
    getSuppliers: PurchasingService.getSuppliers,
    getProducts: PurchasingService.getProducts,
    getDefaultFilter: PurchasingService.getDefaultFilter,
    createItem: PurchasingService.createItem,
    computeTotals: PurchasingService.computeTotals,
    createState: mutations.createState,
    updateState: mutations.updateState,
    actionState: mutations.actionState,
    resetCreateState: mutations.resetCreateState,
    resetUpdateState: mutations.resetUpdateState,
    resetActionState: mutations.resetActionState,
  };
}
