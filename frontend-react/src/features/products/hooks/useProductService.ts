/* ============================================================
   GSDS v1.1 — useProductService Hook
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.3 — React hook for ProductService
   ============================================================
   Bridges the framework-agnostic ProductService with React.
   Manages state transitions (loading, success, empty, error).
   Pages use this hook instead of accessing ProductService directly.
   ============================================================ */

import { useState, useCallback, useEffect, useRef } from 'react';
import { ProductService } from '../services/productService';
import type { ProductDTO } from '../domain/productDTO';
import type { ProductFilterModel } from '../domain/productFilterModel';
import type { ProductTableModel } from '../domain/productTableModel';
import type {
  ProductState,
  ProductListState,
  ProductDetailState,
} from '../state/productState';
import { loadingState, successState, emptyState, errorState, readyState } from '../state/productState';

/* ─── useProductList ───────────────────────────────────────── */

/**
 * Hook for the products list page.
 * Manages the full lifecycle: loading → data | empty | error.
 */
export function useProductList(filters: ProductFilterModel): ProductListState {
  // Initialize as loading since we always fetch on mount
  const [state, setState] = useState<ProductListState>(loadingState);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const tableData = ProductService.getTableData(filters);
        if (tableData.products.length === 0) {
          setState(emptyState());
        } else {
          setState(
            successState({
              products: tableData.products,
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
    filters.categoryId,
    filters.brandId,
    filters.status,
    filters.sortBy,
    filters.sortDirection,
    filters.rowsPerPage,
  ]);

  return state;
}

/* ─── useProductDetail ─────────────────────────────────────── */

/**
 * Hook for the product details page.
 */
export function useProductDetail(id: string | undefined): ProductDetailState {
  const [state, setState] = useState<ProductDetailState>(() => {
    if (!id) return readyState();
    return loadingState();
  });

  useEffect(() => {
    if (!id) return;

    const timer = setTimeout(() => {
      try {
        const dto = ProductService.getById(id);
        if (dto) {
          setState(successState(dto));
        } else {
          setState(errorState(`Product with ID "${id}" was not found.`));
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

/* ─── useProductMutations ──────────────────────────────────── */

/**
 * Hook for product mutations (create, update, delete).
 * Returns mutation functions that can be called imperatively.
 */
export function useProductMutations() {
  const [createState, setCreateState] = useState<ProductState<ProductDTO>>(readyState);
  const [updateState, setUpdateState] = useState<ProductState<ProductDTO>>(readyState);
  const [deleteState, setDeleteState] = useState<ProductState<void>>(readyState);

  const create = (
    data: Parameters<typeof ProductService.create>[0],
  ): Promise<ProductDTO> => {
    return new Promise((resolve, reject) => {
      setCreateState(loadingState());
      try {
        const dto = ProductService.create(data);
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
    updates: Parameters<typeof ProductService.update>[1],
  ): Promise<ProductDTO> => {
    return new Promise((resolve, reject) => {
      setUpdateState(loadingState());
      try {
        const dto = ProductService.update(id, updates);
        if (dto) {
          setUpdateState(successState(dto));
          resolve(dto);
        } else {
          const msg = `Product with ID "${id}" not found for update`;
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
        const result = ProductService.delete(id);
        if (result) {
          setDeleteState(successState(undefined));
          resolve(true);
        } else {
          const msg = `Product with ID "${id}" not found for deletion`;
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

/* ─── useProductSearch ─────────────────────────────────────── */

/**
 * Hook for product search with debounce.
 */
export function useProductSearch(query: string) {
  const [results, setResults] = useState<ProductDTO[]>([]);
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
        const searchResults = ProductService.search(query);
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

/* ─── useProductFilter ─────────────────────────────────────── */

/**
 * Hook for filtering products.
 */
export function useProductFilter(criteria: ProductFilterModel) {
  const [filtered, setFiltered] = useState<ProductDTO[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const result = ProductService.filter(criteria);
        setFiltered(result);
      } catch {
        setFiltered([]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [
    criteria.search,
    criteria.categoryId,
    criteria.brandId,
    criteria.status,
  ]);

  return filtered;
}

/* ─── useProductTableData ──────────────────────────────────── */

/**
 * Hook for getting table-ready data.
 * Returns ProductTableModel[] directly with loading state.
 */
export function useProductTableData(
  filters: ProductFilterModel,
): {
  products: ProductTableModel[];
  total: number;
  totalPages: number;
  isLoading: boolean;
} {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductTableModel[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    ProductService.getApiTableData(filters)
      .then((tableData) => {
        if (cancelled) return;
        setProducts(tableData.products);
        setTotal(tableData.total);
        setTotalPages(tableData.totalPages);
      })
      .catch(() => {
        if (cancelled) return;
        try {
          const tableData = ProductService.getTableData(filters);
          setProducts(tableData.products);
          setTotal(tableData.total);
          setTotalPages(tableData.totalPages);
        } catch {
          setProducts([]);
          setTotal(0);
          setTotalPages(0);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    filters.search,
    filters.categoryId,
    filters.brandId,
    filters.status,
    filters.sortBy,
    filters.sortDirection,
    filters.rowsPerPage,
  ]);

  return { products, total, totalPages, isLoading };
}

