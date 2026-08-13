/* ============================================================
   GSDS v1.1 — SupplierFilters Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Reusable supplier filter bar
   ============================================================
   Pure presentation component.
   - No filtering logic.
   - No local business state.
   - Only exposes events/callbacks.
   ============================================================ */

import { Search, SlidersHorizontal, X, Building2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import {
  SUPPLIER_STATUS_OPTIONS,
  SUPPLIER_SORT_BY_OPTIONS,
  ROWS_PER_PAGE_OPTIONS,
} from '../constants';
import { SupplierService } from '../services/supplierService';
import type { SupplierFilters as SupplierFiltersType } from '../types/supplier';

/* ─── Props ────────────────────────────────────────────────── */

interface SupplierFiltersProps {
  /** Current filter state */
  filters: SupplierFiltersType;
  /** Called when any filter value changes */
  onFilterChange: (filters: SupplierFiltersType) => void;
  /** Called when the user clears all filters */
  onClear: () => void;
  /** Optional class name override */
  className?: string;
}

/* ─── SupplierFilters ──────────────────────────────────────── */

export function SupplierFilters({
  filters,
  onFilterChange,
  onClear,
  className,
}: SupplierFiltersProps) {
  const { t } = useI18n();
  const categories = SupplierService.getCategories();
  const cities = SupplierService.getCities();

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.categoryId !== null ||
    filters.city !== null ||
    filters.sortBy !== 'name' ||
    filters.sortDirection !== 'asc' ||
    filters.rowsPerPage !== 10;

  const updateFilter = <K extends keyof SupplierFiltersType>(
    key: K,
    value: SupplierFiltersType[K],
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div
      className={cn(
        'gsd-supplier-filters flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap',
        className,
      )}
      role="search"
      aria-label={t('supplierFilters.search')}
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
          placeholder={t('supplierFilters.searchPlaceholder')}
          className="gsd-input ps-9 pe-3 h-9 text-sm"
          aria-label={t('supplierFilters.search')}
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
          updateFilter('status', e.target.value as SupplierFiltersType['status'])
        }
        className="gsd-input h-9 text-sm min-w-[130px] max-w-[170px]"
        aria-label={t('supplierFilters.allStatuses')}
      >
        {SUPPLIER_STATUS_OPTIONS.map((opt) => {
          const statusKey =
            opt.value === 'all'
              ? 'supplierFilters.allStatuses'
              : `supplierStatus.${opt.value}`;
          return (
            <option key={opt.value} value={opt.value}>
              {t(statusKey as TranslationKey)}
            </option>
          );
        })}
      </select>

      {/* Category filter */}
      <select
        value={filters.categoryId ?? ''}
        onChange={(e) => updateFilter('categoryId', e.target.value || null)}
        className="gsd-input h-9 text-sm min-w-[150px] max-w-[200px]"
        aria-label={t('supplierFilters.allCategories')}
      >
        <option value="">{t('supplierFilters.allCategories')}</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* City filter */}
      <select
        value={filters.city ?? ''}
        onChange={(e) => updateFilter('city', e.target.value || null)}
        className="gsd-input h-9 text-sm min-w-[130px] max-w-[170px]"
        aria-label={t('supplierFilters.allCities')}
      >
        <option value="">{t('supplierFilters.allCities')}</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* Sort by */}
      <select
        value={filters.sortBy}
        onChange={(e) =>
          updateFilter('sortBy', e.target.value as SupplierFiltersType['sortBy'])
        }
        className="gsd-input h-9 text-sm min-w-[130px] max-w-[180px]"
        aria-label={t('filters.sortBy')}
      >
        {SUPPLIER_SORT_BY_OPTIONS.map((opt) => {
          const sortKey = `supplierSort.${opt.value}`;
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
          {filters.sortDirection === 'asc' ? 'A→Z' : 'Z→A'}
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

      {/* Category + city count indicator */}
      <span className="flex items-center gap-1.5 text-xs [color:var(--gs-foreground-muted)]">
        <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
        {categories.length} {t('supplierFilters.categories')}
      </span>
      <span className="flex items-center gap-1.5 text-xs [color:var(--gs-foreground-muted)]">
        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        {cities.length} {t('supplierFilters.cities')}
      </span>
    </div>
  );
}

