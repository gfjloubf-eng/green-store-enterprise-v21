/* ============================================================
   GSDS v1.1 â€” PurchaseFilters Component
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Reusable purchase filter bar
   ============================================================
   Pure presentation component.
   - No filtering logic.
   - No local business state.
   - Only exposes events/callbacks.
   ============================================================ */

import { Search, SlidersHorizontal, X, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import {
  PURCHASE_STATUS_OPTIONS,
  PURCHASE_SORT_BY_OPTIONS,
  ROWS_PER_PAGE_OPTIONS,
} from '../constants';
import { PurchasingService } from '../services/purchasingService';
import type { PurchaseFilters as PurchaseFiltersType } from '../types/purchasing';

/* â”€â”€â”€ Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

interface PurchaseFiltersProps {
  /** Current filter state */
  filters: PurchaseFiltersType;
  /** Called when any filter value changes */
  onFilterChange: (filters: PurchaseFiltersType) => void;
  /** Called when the user clears all filters */
  onClear: () => void;
  /** Optional class name override */
  className?: string;
}

/* â”€â”€â”€ PurchaseFilters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function PurchaseFilters({
  filters,
  onFilterChange,
  onClear,
  className,
}: PurchaseFiltersProps) {
  const { t } = useI18n();
  const suppliers = PurchasingService.getSuppliers();

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.supplierId !== null ||
    filters.sortBy !== 'code' ||
    filters.sortDirection !== 'asc' ||
    filters.rowsPerPage !== 10;

  const updateFilter = <K extends keyof PurchaseFiltersType>(
    key: K,
    value: PurchaseFiltersType[K],
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div
      className={cn(
        'gsd-purchase-filters flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap',
        className,
      )}
      role="search"
      aria-label={t('purchaseFilters.search')}
    >
      {/* Search input */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search
          className="absolute inset-y-0 start-3 my-auto h-4 w-4 [color:var(--gs-foreground-muted)] pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          placeholder={t('purchaseFilters.searchPlaceholder')}
          className="gsd-input ps-9 pe-3 h-9 text-sm"
          aria-label={t('purchaseFilters.search')}
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => updateFilter('search', '')}
            className="absolute inset-y-0 end-2 my-auto flex items-center justify-center [color:var(--gs-foreground-muted)] hover:[color:var(--gs-foreground-secondary)]"
            aria-label={t('common.clear')}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select
        value={filters.status}
        onChange={(e) =>
          updateFilter('status', e.target.value as PurchaseFiltersType['status'])
        }
        className="gsd-input h-9 text-sm min-w-[130px] max-w-[180px]"
        aria-label={t('purchaseFilters.allStatuses')}
      >
        {PURCHASE_STATUS_OPTIONS.map((opt) => {
          const statusKey =
            opt.value === 'all'
              ? 'purchaseFilters.allStatuses'
              : `purchaseStatus.${opt.value}`;
          return (
            <option key={opt.value} value={opt.value}>
              {t(statusKey as TranslationKey)}
            </option>
          );
        })}
      </select>

      {/* Supplier filter */}
      <select
        value={filters.supplierId ?? ''}
        onChange={(e) => updateFilter('supplierId', e.target.value || null)}
        className="gsd-input h-9 text-sm min-w-[150px] max-w-[200px]"
        aria-label={t('purchaseFilters.allSuppliers')}
      >
        <option value="">{t('purchaseFilters.allSuppliers')}</option>
        {suppliers.map((supplier) => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.name}
          </option>
        ))}
      </select>

      {/* Sort by */}
      <select
        value={filters.sortBy}
        onChange={(e) =>
          updateFilter('sortBy', e.target.value as PurchaseFiltersType['sortBy'])
        }
        className="gsd-input h-9 text-sm min-w-[130px] max-w-[180px]"
        aria-label={t('filters.sortBy')}
      >
        {PURCHASE_SORT_BY_OPTIONS.map((opt) => {
          const sortKey = `purchaseSort.${opt.value}`;
          return (
            <option key={opt.value} value={opt.value}>
              {t(sortKey as TranslationKey)}
            </option>
          );
        })}
      </select>

      {/* Sort direction toggle */}
      <button
        type="button"
        onClick={() =>
          updateFilter(
            'sortDirection',
            filters.sortDirection === 'asc' ? 'desc' : 'asc',
          )
        }
        className="gsd-btn gsd-btn--ghost gsd-btn--sm h-9 px-2"
        aria-label={
          filters.sortDirection === 'asc'
            ? t('filters.sortDescending')
            : t('filters.sortAscending')
        }
        title={
          filters.sortDirection === 'asc'
            ? t('filters.sortDescending')
            : t('filters.sortAscending')
        }
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs">
          {filters.sortDirection === 'asc' ? 'Aâ†’Z' : 'Zâ†’A'}
        </span>
      </button>

      {/* Rows per page */}
      <select
        value={filters.rowsPerPage}
        onChange={(e) => updateFilter('rowsPerPage', Number(e.target.value))}
        className="gsd-input h-9 text-sm min-w-[80px] max-w-[120px]"
        aria-label={t('filters.rowsPerPage')}
      >
        {ROWS_PER_PAGE_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n} {t('filters.rowsPerPage')}
          </option>
        ))}
      </select>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-9 text-xs [color:var(--gs-danger)] hover:[background:var(--gs-danger-soft)]"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          {t('filters.clear')}
        </button>
      )}

      {/* Supplier count indicator */}
      <span className="flex items-center gap-1.5 text-xs [color:var(--gs-foreground-muted)]">
        <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
        {suppliers.length} {t('purchaseFilters.suppliers')}
      </span>
    </div>
  );
}
