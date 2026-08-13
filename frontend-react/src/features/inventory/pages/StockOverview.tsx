/* ============================================================
   GSDS v1.1 — StockOverview
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Full inventory list with filters
   ============================================================
   Composition layer only:
   - Assembles filters, table and empty state.
   - All business logic delegated to InventoryService via hooks.
   - No direct mock data manipulation.
   ============================================================ */

import { useState, useCallback } from 'react';
import { Boxes } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { DEFAULT_INVENTORY_FILTERS } from '../constants';
import type { InventoryFilters, InventoryColumnId, InventorySummary } from '../types/inventory';
import { InventoryTable } from '../components/InventoryTable';
import { InventoryFilters as InventoryFiltersBar } from '../components/InventoryFilters';
import { InventoryEmptyState } from '../components/InventoryEmptyState';
import { useInventoryTableData } from '../hooks/useInventoryService';

export function StockOverview() {
  const { t } = useI18n();
  const [filters, setFilters] = useState<InventoryFilters>(DEFAULT_INVENTORY_FILTERS);

  const { inventory, isLoading } = useInventoryTableData(filters);

  const handleFilterChange = useCallback((newFilters: InventoryFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_INVENTORY_FILTERS);
  }, []);

  const handleSort = useCallback((columnId: InventoryColumnId) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: columnId,
      sortDirection:
        prev.sortBy === columnId && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

const handleView = useCallback((_item: InventorySummary) => {
    /* Navigation to product details handled in a future milestone. */
    void _item;
  }, []);

  const hasInventory = inventory.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Page Header ──────────────────────────────── */}
      <div>
        <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
          <Boxes className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
          {t('inventory.stockOverview.title')}
        </h1>
        <BreadcrumbEngine className="mt-1" />
      </div>

      {/* ── Filters ──────────────────────────────────── */}
      <InventoryFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* ── Content Area ─────────────────────────────── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-2 text-sm [color:var(--gs-foreground-muted)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {t('common.loading')}
          </div>
        </div>
      ) : !hasInventory &&
        !filters.search &&
        filters.status === 'all' &&
        !filters.locationId ? (
        <InventoryEmptyState
          title={t('inventory.stockOverview.empty')}
          description={t('inventory.stockOverview.emptyDesc')}
        />
      ) : inventory.length === 0 ? (
        <InventoryEmptyState
          title={t('inventory.noMatch.title')}
          description={t('inventory.noMatch.description')}
          actionLabel={t('inventory.noMatch.action')}
          onAction={handleClearFilters}
        />
      ) : (
        <InventoryTable
          inventory={inventory}
          sortBy={filters.sortBy}
          sortDirection={filters.sortDirection}
          onSort={handleSort}
          onView={handleView}
        />
      )}
    </div>
  );
}

