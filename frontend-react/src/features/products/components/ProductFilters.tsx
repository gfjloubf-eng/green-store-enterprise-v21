/* ============================================================
   GSDS v1.1 — ProductFilters Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.1 — Reusable filter bar
   ============================================================
   Pure presentation component.
   - No filtering logic.
   - No local business state.
   - Only exposes events/callbacks.
   ============================================================ */

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import {
  PRODUCT_STATUS_OPTIONS,
  ROWS_PER_PAGE_OPTIONS,
  SORT_BY_OPTIONS,
  MOCK_CATEGORIES,
  MOCK_BRANDS,
} from '../constants';
import type { ProductFilters as ProductFiltersType } from '../types/product';

/* ─── Props ────────────────────────────────────────────────── */

interface ProductFiltersProps {
  /** Current filter state */
  filters: ProductFiltersType;
  /** Called when any filter value changes */
  onFilterChange: (filters: ProductFiltersType) => void;
  /** Called when the user clears all filters */
  onClear: () => void;
  /** Optional class name override */
  className?: string;
}

/* ─── ProductFilters ───────────────────────────────────────── */

export function ProductFilters({
  filters,
  onFilterChange,
  onClear,
  className,
}: ProductFiltersProps) {
  const { t } = useI18n();
  const hasActiveFilters =
    filters.search !== '' ||
    filters.categoryId !== null ||
    filters.brandId !== null ||
    filters.status !== 'all' ||
    filters.sortBy !== 'createdAt' ||
    filters.sortDirection !== 'desc' ||
    filters.rowsPerPage !== 10;

  const updateFilter = <K extends keyof ProductFiltersType>(
    key: K,
    value: ProductFiltersType[K],
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div
      className={cn(
        'gsd-product-filters flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap',
        className,
      )}
      role="search"
      aria-label={t('filters.search')}
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
          placeholder={t('filters.searchPlaceholder')}
          className="gsd-input ps-9 pe-3 h-9 text-sm"
          aria-label={t('filters.search')}
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

      {/* Category filter */}
      <select
        value={filters.categoryId ?? ''}
        onChange={(e) => updateFilter('categoryId', e.target.value || null)}
        className="gsd-input h-9 text-sm min-w-[130px] max-w-[180px]"
        aria-label={t('filters.allCategories')}
      >
        <option value="">{t('filters.allCategories')}</option>
        {MOCK_CATEGORIES.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Brand filter */}
      <select
        value={filters.brandId ?? ''}
        onChange={(e) => updateFilter('brandId', e.target.value || null)}
        className="gsd-input h-9 text-sm min-w-[130px] max-w-[180px]"
        aria-label={t('filters.allBrands')}
      >
        <option value="">{t('filters.allBrands')}</option>
        {MOCK_BRANDS.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={filters.status}
        onChange={(e) =>
          updateFilter('status', e.target.value as ProductFiltersType['status'])
        }
        className="gsd-input h-9 text-sm min-w-[120px] max-w-[160px]"
        aria-label={t('filters.allStatuses')}
      >
        {PRODUCT_STATUS_OPTIONS.map((opt) => {
          const statusKey = opt.value === 'all' ? 'status.all' : `status.${opt.value}`;
          return (
            <option key={opt.value} value={opt.value}>
              {t(statusKey as TranslationKey)}
            </option>
          );
        })}
      </select>

      {/* Sort by */}
      <select
        value={filters.sortBy}
        onChange={(e) =>
          updateFilter('sortBy', e.target.value as ProductFiltersType['sortBy'])
        }
        className="gsd-input h-9 text-sm min-w-[130px] max-w-[180px]"
        aria-label={t('filters.sortBy')}
      >
        {SORT_BY_OPTIONS.map((opt) => {
          const sortKey = `filters.sortBy${opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}`;
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
        aria-label={filters.sortDirection === 'asc' ? t('filters.sortDescending') : t('filters.sortAscending')}
        title={filters.sortDirection === 'asc' ? t('filters.sortDescending') : t('filters.sortAscending')}
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs">{filters.sortDirection === 'asc' ? 'A→Z' : 'Z→A'}</span>
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
    </div>
  );
}
