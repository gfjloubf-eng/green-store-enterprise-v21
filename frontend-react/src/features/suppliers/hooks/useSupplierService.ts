/* ============================================================
   GSDS v1.1 — useSupplierService Hooks
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — React hooks for SupplierService
   ============================================================
   Bridges the framework-agnostic SupplierService with React.
   Manages state transitions (loading, success, empty, error).
   Pages use these hooks instead of accessing SupplierService directly.
   ============================================================ */

import { useState, useCallback, useEffect, useRef } from 'react';
import { SupplierService } from '../services/supplierService';
import type { SupplierDTO } from '../domain/supplierDTO';
import type { SupplierFilterModel } from '../domain/supplierFilterModel';
import type { SupplierTableModel } from '../domain/supplierTableModel';
import type {
  SupplierState,
  SupplierListState,
  SupplierDetailState,
  SupplierDashboardState,
} from '../state/supplierState';
import {
  loadingState,
  successState,
  emptyState,
  errorState,
  readyState,
} from '../state/supplierState';

/* ─── useSupplierTableData ─────────────────────────────────── */

/**
 * Hook for the suppliers list table.
 * Combines filter + sort + paginate via SupplierService.
 */
export function useSupplierTableData(
  filters: SupplierFilterModel,
): {
  suppliers: SupplierTableModel[];
  total: number;
  totalPages: number;
  isLoading: boolean;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<SupplierTableModel[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const tableData = SupplierService.getTableData(filters);
        setSuppliers(tableData.suppliers);
        setTotal(tableData.total);
        setTotalPages(tableData.totalPages);
      } catch {
        setSuppliers([]);
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
    filters.categoryId,
    filters.city,
    filters.sortBy,
    filters.sortDirection,
    filters.rowsPerPage,
  ]);

  return { suppliers, total, totalPages, isLoading };
}

/* ─── useSupplierList ──────────────────────────────────────── */

/**
 * Hook for the suppliers list page using the state machine.
 */
export function useSupplierList(filters: SupplierFilterModel): SupplierListState {
  const [state, setState] = useState<SupplierListState>(loadingState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const tableData = SupplierService.getTableData(filters);
        if (tableData.suppliers.length === 0) {
          setState(emptyState());
        } else {
          setState(
            successState({
              suppliers: tableData.suppliers,
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
    filters.categoryId,
    filters.city,
    filters.sortBy,
    filters.sortDirection,
    filters.rowsPerPage,
  ]);

  return state;
}

/* ─── useSupplierDetails ───────────────────────────────────── */

/**
 * Hook for the supplier details page.
 */
export function useSupplierDetails(id: string | undefined): SupplierDetailState {
  const [state, setState] = useState<SupplierDetailState>(() => {
    if (!id) return readyState();
    return loadingState();
  });

  useEffect(() => {
    if (!id) return;

    const timer = setTimeout(() => {
      try {
        const dto = SupplierService.getById(id);
        if (dto) {
          setState(successState(dto));
        } else {
          setState(errorState(`Supplier with ID "${id}" was not found.`));
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

/* ─── useSupplierMutations ─────────────────────────────────── */

/**
 * Hook for supplier mutations (create, update, delete).
 * Returns mutation functions that can be called imperatively.
 */
export function useSupplierMutations() {
  const [createState, setCreateState] = useState<SupplierState<SupplierDTO>>(
    readyState,
  );
  const [updateState, setUpdateState] = useState<SupplierState<SupplierDTO>>(
    readyState,
  );
  const [deleteState, setDeleteState] = useState<SupplierState<void>>(
    readyState,
  );

  const create = (
    data: Parameters<typeof SupplierService.create>[0],
  ): Promise<SupplierDTO> => {
    return new Promise((resolve, reject) => {
      setCreateState(loadingState());
      try {
        const dto = SupplierService.create(data);
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
    updates: Parameters<typeof SupplierService.update>[1],
  ): Promise<SupplierDTO> => {
    return new Promise((resolve, reject) => {
      setUpdateState(loadingState());
      try {
        const dto = SupplierService.update(id, updates);
        if (dto) {
          setUpdateState(successState(dto));
          resolve(dto);
        } else {
          const msg = `Supplier with ID "${id}" not found for update`;
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

  const remove = (id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setDeleteState(loadingState());
      try {
        const result = SupplierService.delete(id);
        if (result) {
          setDeleteState(successState(undefined));
          resolve(true);
        } else {
          const msg = `Supplier with ID "${id}" not found for deletion`;
          setDeleteState(errorState(msg));
          reject(new Error(msg));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Delete failed';
        setDeleteState(errorState(message));
        reject(err);
      }
    });
  };

  const resetCreateState = useCallback(() => setCreateState(readyState()), []);
  const resetUpdateState = useCallback(() => setUpdateState(readyState()), []);
  const resetDeleteState = useCallback(() => setDeleteState(readyState()), []);

  return {
    create,
    update,
    delete: remove,
    createState,
    updateState,
    deleteState,
    resetCreateState,
    resetUpdateState,
    resetDeleteState,
  };
}

/* ─── useSupplierSearch ────────────────────────────────────── */

/**
 * Hook for supplier search with debounce.
 */
export function useSupplierSearch(query: string) {
  const [results, setResults] = useState<SupplierDTO[]>([]);
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
        const searchResults = SupplierService.search(query);
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

/* ─── useSupplierFilter ────────────────────────────────────── */

/**
 * Hook for filtering suppliers.
 */
export function useSupplierFilter(criteria: SupplierFilterModel) {
  const [filtered, setFiltered] = useState<SupplierDTO[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const result = SupplierService.filter(criteria);
        setFiltered(result);
      } catch {
        setFiltered([]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [criteria.search, criteria.status, criteria.categoryId, criteria.city]);

  return filtered;
}

/* ─── useSupplierDashboard ─────────────────────────────────── */

/**
 * Hook for the supplier dashboard.
 * Returns summary + recent suppliers + top suppliers + category breakdown.
 */
export function useSupplierDashboard(): SupplierDashboardState {
  const [state, setState] = useState<SupplierDashboardState>(loadingState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const summary = SupplierService.getSummary();
        const recentSuppliers = SupplierService.getRecentSuppliers(4);
        const topSuppliers = SupplierService.getTopSuppliers(4);
        const categoryBreakdown = SupplierService.getCategoryBreakdown();

        if (summary.totalSuppliers === 0) {
          setState(emptyState());
        } else {
          setState(
            successState({
              summary,
              recentSuppliers,
              topSuppliers,
              categoryBreakdown,
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

/* ─── useSupplierService ───────────────────────────────────── */

/**
 * Facade hook exposing the SupplierService API through React.
 * Provides framework-agnostic access to the supplier domain while
 * keeping pages decoupled from the service implementation.
 *
 * All methods are stable callbacks backed by the singleton
 * SupplierService. Mutation helpers (create, update, delete)
 * return promises and expose per-action state transitions.
 */
export function useSupplierService() {
  const mutations = useSupplierMutations();

  const getAll = useCallback((): SupplierDTO[] => {
    return SupplierService.getAll();
  }, []);

  const getById = useCallback((id: string): SupplierDTO | undefined => {
    return SupplierService.getById(id);
  }, []);

  const search = useCallback((query: string): SupplierDTO[] => {
    return SupplierService.search(query);
  }, []);

  const filter = useCallback(
    (criteria: SupplierFilterModel): SupplierDTO[] => {
      return SupplierService.filter(criteria);
    },
    [],
  );

  const sort = useCallback(
    (
      suppliers: SupplierDTO[],
      sortBy: SupplierFilterModel['sortBy'],
      sortDirection: SupplierFilterModel['sortDirection'],
    ): SupplierDTO[] => {
      return SupplierService.sort(suppliers, sortBy, sortDirection);
    },
    [],
  );

  const paginate = useCallback(
    <T>(items: T[], page: number, size: number) => {
      return SupplierService.paginate(items, page, size);
    },
    [],
  );

  return {
    getAll,
    getById,
    create: mutations.create,
    update: mutations.update,
    delete: mutations.delete,
    search,
    filter,
    sort,
    paginate,
    getCategories: SupplierService.getCategories,
    getCities: SupplierService.getCities,
    getDefaultFilter: SupplierService.getDefaultFilter,
    createState: mutations.createState,
    updateState: mutations.updateState,
    deleteState: mutations.deleteState,
    resetCreateState: mutations.resetCreateState,
    resetUpdateState: mutations.resetUpdateState,
    resetDeleteState: mutations.resetDeleteState,
  };
}

