/* ============================================================
   GSDS v1.1 — useInventoryService Hooks
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — React hooks for InventoryService
   ============================================================
   Bridges the framework-agnostic InventoryService with React.
   Manages state transitions (loading, success, empty, error).
   Pages use these hooks instead of accessing InventoryService directly.
   ============================================================ */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { InventoryService } from '../services/inventoryService';
import type { InventoryDTO } from '../domain/inventoryDTO';
import type { MovementDTO } from '../domain/movementDTO';
import type { InventoryFilterModel } from '../domain/inventoryFilterModel';
import type { InventoryTableModel } from '../domain/inventoryTableModel';
import type {
  InventoryState,
  InventoryListState,
  MovementListState,
  InventoryDashboardState,
} from '../state/inventoryState';
import {
  loadingState,
  successState,
  emptyState,
  errorState,
  readyState,
} from '../state/inventoryState';

/* ─── useInventoryTableData ────────────────────────────────── */

/**
 * Hook for the stock overview table.
 * Combines filter + sort + paginate via InventoryService.
 */
export function useInventoryTableData(
  filters: InventoryFilterModel,
): {
  inventory: InventoryTableModel[];
  total: number;
  totalPages: number;
  isLoading: boolean;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryTableModel[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const tableData = InventoryService.getTableData(filters);
        setInventory(tableData.inventory);
        setTotal(tableData.total);
        setTotalPages(tableData.totalPages);
      } catch {
        setInventory([]);
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
    filters.locationId,
    filters.sortBy,
    filters.sortDirection,
    filters.rowsPerPage,
  ]);

  return { inventory, total, totalPages, isLoading };
}

/* ─── useInventoryList ─────────────────────────────────────── */

/**
 * Hook for the stock overview page using the state machine.
 */
export function useInventoryList(filters: InventoryFilterModel): InventoryListState {
  const [state, setState] = useState<InventoryListState>(loadingState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const tableData = InventoryService.getTableData(filters);
        if (tableData.inventory.length === 0) {
          setState(emptyState());
        } else {
          setState(
            successState({
              inventory: tableData.inventory,
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
    filters.locationId,
    filters.sortBy,
    filters.sortDirection,
    filters.rowsPerPage,
  ]);

  return state;
}

/* ─── useMovementHistory ───────────────────────────────────── */

/**
 * Hook for the stock movements page.
 */
export function useMovementHistory(): MovementListState {
  const [state, setState] = useState<MovementListState>(loadingState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const movements = InventoryService.getMovementHistory();
        if (movements.length === 0) {
          setState(emptyState());
        } else {
          setState(
            successState({
              movements,
              total: movements.length,
              page: 1,
              totalPages: 1,
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

/* ─── useInventoryDashboard ────────────────────────────────── */

/**
 * Hook for the inventory dashboard.
 * Returns summary + recent movements + low stock items.
 */
export function useInventoryDashboard(): InventoryDashboardState {
  const [state, setState] = useState<InventoryDashboardState>(loadingState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const summary = InventoryService.getSummary();
        const recentMovements = InventoryService.getRecentMovements(6);
        const lowStockItems = InventoryService.getLowStock();

        if (summary.totalProducts === 0 && recentMovements.length === 0) {
          setState(emptyState());
        } else {
          setState(
            successState({
              summary,
              recentMovements,
              lowStockItems,
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

/* ─── useLowStock / useOutOfStock ──────────────────────────── */

/**
 * Hook for the low-stock page.
 */
export function useLowStock(): InventoryState<InventoryTableModel[]> {
  const [state, setState] = useState<InventoryState<InventoryTableModel[]>>(
    loadingState,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const items = InventoryService.getLowStock();
        if (items.length === 0) {
          setState(emptyState());
        } else {
          setState(successState(items));
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

/**
 * Hook for the out-of-stock page.
 */
export function useOutOfStock(): InventoryState<InventoryTableModel[]> {
  const [state, setState] = useState<InventoryState<InventoryTableModel[]>>(
    loadingState,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const items = InventoryService.getOutOfStock();
        if (items.length === 0) {
          setState(emptyState());
        } else {
          setState(successState(items));
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

/* ─── useInventoryMutations ────────────────────────────────── */

/**
 * Hook for inventory mutations (adjust, transfer).
 * Returns mutation functions that can be called imperatively.
 */
export function useInventoryMutations() {
  const [adjustState, setAdjustState] = useState<InventoryState<InventoryDTO>>(
    readyState,
  );
  const [transferState, setTransferState] = useState<
    InventoryState<InventoryDTO>
  >(readyState);

  const adjustStock = (
    productId: string,
    delta: number,
    reason: string,
    locationId?: string,
  ): Promise<InventoryDTO> => {
    return new Promise((resolve, reject) => {
      setAdjustState(loadingState());
      try {
        const dto = InventoryService.adjustStock(
          productId,
          delta,
          reason,
          locationId,
        );
        if (dto) {
          setAdjustState(successState(dto));
          resolve(dto);
        } else {
          const msg = `Inventory for product "${productId}" not found`;
          setAdjustState(errorState(msg));
          reject(new Error(msg));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Adjustment failed';
        setAdjustState(errorState(message));
        reject(err);
      }
    });
  };

  const transferStock = (
    productId: string,
    quantity: number,
    fromLocation: { id: string; name: string },
    toLocation: { id: string; name: string },
  ): Promise<InventoryDTO> => {
    return new Promise((resolve, reject) => {
      setTransferState(loadingState());
      try {
        const dto = InventoryService.transferStock(
          productId,
          quantity,
          fromLocation,
          toLocation,
        );
        if (dto) {
          setTransferState(successState(dto));
          resolve(dto);
        } else {
          const msg =
            quantity <= 0
              ? 'Quantity must be positive'
              : `Insufficient stock for product "${productId}"`;
          setTransferState(errorState(msg));
          reject(new Error(msg));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Transfer failed';
        setTransferState(errorState(message));
        reject(err);
      }
    });
  };

  const resetAdjustState = useCallback(() => setAdjustState(readyState()), []);
  const resetTransferState = useCallback(
    () => setTransferState(readyState()),
    [],
  );

  return {
    adjustStock,
    transferStock,
    adjustState,
    transferState,
    resetAdjustState,
    resetTransferState,
  };
}

/* ─── useInventorySearch ───────────────────────────────────── */

/**
 * Hook for inventory search with debounce.
 */
export function useInventorySearch(query: string) {
  const [results, setResults] = useState<InventoryDTO[]>([]);
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
        const searchResults = InventoryService.search(query);
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

/* ─── useInventoryFilter ───────────────────────────────────── */

/**
 * Hook for filtering inventory.
 */
export function useInventoryFilter(criteria: InventoryFilterModel) {
  const [filtered, setFiltered] = useState<InventoryDTO[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const result = InventoryService.filter(criteria);
        setFiltered(result);
      } catch {
        setFiltered([]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [criteria.search, criteria.status, criteria.locationId]);

  return filtered;
}

/* ─── useMovementFilter ────────────────────────────────────── */

/**
 * Hook for filtering stock movements by type/status.
 * Pure client-side filtering over InventoryService.getMovementHistory().
 */
export function useMovementFilter(
  type: MovementDTO['type'] | 'all',
  status: MovementDTO['status'] | 'all',
) {
  const [movements, setMovements] = useState<MovementDTO[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let result = InventoryService.getMovementHistory();
        if (type !== 'all') {
          result = result.filter((m) => m.type === type);
        }
        if (status !== 'all') {
          result = result.filter((m) => m.status === status);
        }
        setMovements(result);
      } catch {
        setMovements([]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [type, status]);

  return movements;
}

/* ─── useInventoryService ──────────────────────────────────── */

/**
 * Facade hook exposing the InventoryService API through React.
 * Provides framework-agnostic access to the inventory domain while
 * keeping pages decoupled from the service implementation.
 *
 * All methods are stable callbacks backed by the singleton
 * InventoryService. Mutation helpers (adjustStock, transferStock)
 * return promises and expose per-action state transitions.
 */
export function useInventoryService() {
  const mutations = useInventoryMutations();

  const getInventory = useCallback((): InventoryDTO[] => {
    return InventoryService.getInventory();
  }, []);

  const getMovementHistory = useCallback((): MovementDTO[] => {
    return InventoryService.getMovementHistory();
  }, []);

  const getLowStock = useCallback(() => {
    return InventoryService.getLowStock();
  }, []);

  const getOutOfStock = useCallback(() => {
    return InventoryService.getOutOfStock();
  }, []);

  const search = useCallback((query: string): InventoryDTO[] => {
    return InventoryService.search(query);
  }, []);

  const filter = useCallback((criteria: InventoryFilterModel): InventoryDTO[] => {
    return InventoryService.filter(criteria);
  }, []);

  const sort = useCallback(
    (
      inventory: InventoryDTO[],
      sortBy: InventoryFilterModel['sortBy'],
      sortDirection: InventoryFilterModel['sortDirection'],
    ): InventoryDTO[] => {
      return InventoryService.sort(inventory, sortBy, sortDirection);
    },
    [],
  );

  const paginate = useCallback(
    <T>(items: T[], page: number, size: number) => {
      return InventoryService.paginate(items, page, size);
    },
    [],
  );

  return {
    getInventory,
    getMovementHistory,
    adjustStock: mutations.adjustStock,
    transferStock: mutations.transferStock,
    getLowStock,
    getOutOfStock,
    search,
    filter,
    sort,
    paginate,
    getLocations: InventoryService.getLocations,
    getMovementTypes: InventoryService.getMovementTypes,
    getMovementStatuses: InventoryService.getMovementStatuses,
    adjustState: mutations.adjustState,
    transferState: mutations.transferState,
    resetAdjustState: mutations.resetAdjustState,
    resetTransferState: mutations.resetTransferState,
  };
}

/* ─── useInventoryMovements ────────────────────────────────── */

/**
 * Hook for the stock movements page.
 * Combines the movement history state machine with optional
 * type/status filtering and column sorting.
 *
 * Returns:
 * - state: MovementListState (loading | success | empty | error)
 * - movements: MovementDTO[] (filtered + sorted, empty while loading)
 * - setTypeFilter / setStatusFilter / setSort — imperative controls
 */
export function useInventoryMovements() {
  const state = useMovementHistory();
  const [typeFilter, setTypeFilter] = useState<MovementDTO['type'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<MovementDTO['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState('performedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  /* Client-side type/status filtering over the full history. */
  const movements = useMemo(() => {
    if (state.status !== 'success') return [];
    let result = state.data.movements;
    if (typeFilter !== 'all') {
      result = result.filter((m) => m.type === typeFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter((m) => m.status === statusFilter);
    }
    /* Column sort (newest first default). */
    const sorted = [...result].sort((a, b) => {
      const aVal = a[sortBy as keyof MovementDTO];
      const bVal = b[sortBy as keyof MovementDTO];
      let cmp = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        cmp = new Date(aVal).getTime() - new Date(bVal).getTime();
        if (Number.isNaN(cmp)) cmp = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [state, typeFilter, statusFilter, sortBy, sortDirection]);

  const handleSort = useCallback((columnId: string) => {
    setSortBy((prev) => {
      if (prev === columnId) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDirection('desc');
      return columnId;
    });
  }, []);

  return {
    state,
    movements,
    typeFilter,
    statusFilter,
    sortBy,
    sortDirection,
    setTypeFilter,
    setStatusFilter,
    handleSort,
  };
}

