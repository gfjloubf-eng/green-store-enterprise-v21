/* ============================================================
   GSDS v1.1 â€” PurchaseOrders
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Full purchase orders list with filters
   ============================================================
   Composition layer only:
   - Assembles filters, table and empty state.
   - All business logic delegated to PurchasingService via hooks.
   - No direct mock data manipulation.
   ============================================================ */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingCart } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { DEFAULT_PURCHASE_FILTERS } from '../constants';
import type { PurchaseFilters, PurchaseColumnId } from '../types/purchasing';
import type { PurchaseTableModel } from '../domain';
import { PurchaseTable } from '../components/PurchaseTable';
import { PurchaseFilters as PurchaseFiltersBar } from '../components/PurchaseFilters';
import { PurchaseEmptyState } from '../components/PurchaseEmptyState';
import { usePurchaseTableData } from '../hooks/usePurchasingService';

export function PurchaseOrders() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [filters, setFilters] = useState<PurchaseFilters>(DEFAULT_PURCHASE_FILTERS);

  const { orders, isLoading } = usePurchaseTableData(filters);

  const handleFilterChange = useCallback((newFilters: PurchaseFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_PURCHASE_FILTERS);
  }, []);

  const handleSort = useCallback((columnId: PurchaseColumnId) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: columnId,
      sortDirection:
        prev.sortBy === columnId && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleView = useCallback(
    (order: PurchaseTableModel) => {
      navigate(`/purchasing/${order.id}`);
    },
    [navigate],
  );

  const hasOrders = orders.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* â”€â”€ Page Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
            {t('purchasing.orders.title')}
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
        <button
          type="button"
          onClick={() => navigate('/purchasing/create')}
          className="gsd-btn gsd-btn--primary gsd-btn--md"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('purchasing.add')}
        </button>
      </div>

      {/* â”€â”€ Filters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <PurchaseFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* â”€â”€ Content Area â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-2 text-sm [color:var(--gs-foreground-muted)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {t('common.loading')}
          </div>
        </div>
      ) : !hasOrders &&
        !filters.search &&
        filters.status === 'all' &&
        !filters.supplierId ? (
        <PurchaseEmptyState
          title={t('purchasing.orders.empty')}
          description={t('purchasing.orders.emptyDesc')}
          actionLabel={t('purchasing.orders.emptyAction')}
          onAction={() => navigate('/purchasing/create')}
        />
      ) : orders.length === 0 ? (
        <PurchaseEmptyState
          title={t('purchasing.noMatch.title')}
          description={t('purchasing.noMatch.description')}
          actionLabel={t('purchasing.noMatch.action')}
          onAction={handleClearFilters}
        />
      ) : (
        <PurchaseTable
          orders={orders}
          sortBy={filters.sortBy}
          sortDirection={filters.sortDirection}
          onSort={handleSort}
          onView={handleView}
        />
      )}
    </div>
  );
}
