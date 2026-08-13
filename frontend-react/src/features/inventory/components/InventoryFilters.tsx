/* ============================================================
   GSDS v1.1 — InventoryFilters Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Reusable inventory filter bar
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
  INVENTORY_STATUS_OPTIONS,
  ROWS_PER_PAGE_OPTIONS,
  INVENTORY_SORT_BY_OPTIONS,
} from '../constants';
import { InventoryService } from '../services/inventoryService';
import type { InventoryFilters as InventoryFiltersType } from '../types/inventory';

/* ─── Props ────────────────────────────────────────────────── */

interface InventoryFiltersProps {
  /** Current filter state */
  filters: InventoryFiltersType;
  /** Called when any filter value changes */
  onFilterChange: (filters: InventoryFiltersType) => void;
  /** Called when the user clears all filters */
  onClear: () => void;
  /** Optional class name override */
  className?: string;
}

/* ─── InventoryFilters ─────────────────────────────────────── */

export function InventoryFilters({
  filters,
  onFilterChange,
  onClear,
  className,
}: InventoryFiltersProps) {
  const { t } = useI18n();
  const locations = InventoryService.getLocations();

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.locationId !== null ||
    filters.sortBy !== 'quantityOnHand' ||
    filters.sortDirection !== 'desc' ||
    filters.rowsPerPage !== 10;

  const updateFilter = <K extends keyof InventoryFiltersType>(
    key: K,
    value: InventoryFiltersType[K],
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div
      className={cn(
        'gsd-inventory-filters flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap',
        className,
      )}
      role="search"
      aria-label={t('inventoryFilters.search')}
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
          placeholder={t('inventoryFilters.searchPlaceholder')}
          className="gsd-input ps-9 pe-3 h-9 text-sm"
          aria-label={t('inventoryFilters.search')}
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
          updateFilter('status', e.target.value as InventoryFiltersType['status'])
        }
        className="gsd-input h-9 text-sm min-w-[130px] max-w-[170px]"
        aria-label={t('inventoryFilters.allStatuses')}
      >
        {INVENTORY_STATUS_OPTIONS.map((opt) => {
          const statusKey =
            opt.value === 'all'
              ? 'inventoryFilters.allStatuses'
              : `invStatus.${opt.value}`;
          return (
            <option key={opt.value} value={opt.value}>
              {t(statusKey as TranslationKey)}
            </option>
          );
        })}
      </select>

      {/* Location filter */}
      <select
        value={filters.locationId ?? ''}
        onChange={(e) => updateFilter('locationId', e.target.value || null)}
        className="gsd-input h-9 text-sm min-w-[150px] max-w-[200px]"
        aria-label={t('inventoryFilters.allLocations')}
      >
        <option value="">{t('inventoryFilters.allLocations')}</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.name}
          </option>
        ))}
      </select>

      {/* Sort by */}
      <select
        value={filters.sortBy}
        onChange={(e) =>
          updateFilter('sortBy', e.target.value as InventoryFiltersType['sortBy'])
        }
        className="gsd-input h-9 text-sm min-w-[130px] max-w-[180px]"
        aria-label={t('filters.sortBy')}
      >
        {INVENTORY_SORT_BY_OPTIONS.map((opt) => {
          const sortKey = `invSort.${opt.value}`;
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

      {/* Location count indicator */}
      <span className="flex items-center gap-1.5 text-xs [color:var(--gs-foreground-muted)]">
        <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
        {locations.length} {t('inventoryFilters.locations')}
      </span>
    </div>
  );
}

