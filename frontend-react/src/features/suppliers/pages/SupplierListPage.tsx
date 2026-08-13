/* ============================================================
   GSDS v1.1 — SupplierListPage
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Full supplier list with filters
   ============================================================
   Composition layer only:
   - Assembles filters, table and empty state.
   - All business logic delegated to SupplierService via hooks.
   - No direct mock data manipulation.
   ============================================================ */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Truck } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { DEFAULT_SUPPLIER_FILTERS } from '../constants';
import type { SupplierFilters, SupplierColumnId } from '../types/supplier';
import type { SupplierTableModel } from '../domain';
import { SupplierTable } from '../components/SupplierTable';
import { SupplierFilters as SupplierFiltersBar } from '../components/SupplierFilters';
import { SupplierEmptyState } from '../components/SupplierEmptyState';
import { useSupplierTableData } from '../hooks/useSupplierService';

export function SupplierListPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [filters, setFilters] = useState<SupplierFilters>(DEFAULT_SUPPLIER_FILTERS);

  const { suppliers, isLoading } = useSupplierTableData(filters);

  const handleFilterChange = useCallback((newFilters: SupplierFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_SUPPLIER_FILTERS);
  }, []);

  const handleSort = useCallback((columnId: SupplierColumnId) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: columnId,
      sortDirection:
        prev.sortBy === columnId && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleView = useCallback(
    (supplier: SupplierTableModel) => {
      navigate(`/suppliers/${supplier.id}`);
    },
    [navigate],
  );

  const handleEdit = useCallback(
    (supplier: SupplierTableModel) => {
      navigate(`/suppliers/${supplier.id}/edit`);
    },
    [navigate],
  );

  const handleDelete = useCallback(
    (_item: SupplierTableModel) => {
      /* Delete confirmation dialog to be implemented in a future milestone. */
      void _item;
    },
    [],
  );

  const hasSuppliers = suppliers.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
            <Truck className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
            {t('suppliers.list.title')}
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
        <button
          type="button"
          onClick={() => navigate('/suppliers/create')}
          className="gsd-btn gsd-btn--primary gsd-btn--md"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('suppliers.add')}
        </button>
      </div>

      {/* ── Filters ──────────────────────────────────── */}
      <SupplierFiltersBar
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
      ) : !hasSuppliers &&
        !filters.search &&
        filters.status === 'all' &&
        !filters.categoryId &&
        !filters.city ? (
        <SupplierEmptyState
          title={t('suppliers.list.empty')}
          description={t('suppliers.list.emptyDesc')}
          actionLabel={t('suppliers.list.emptyAction')}
          onAction={() => navigate('/suppliers/create')}
        />
      ) : suppliers.length === 0 ? (
        <SupplierEmptyState
          title={t('suppliers.noMatch.title')}
          description={t('suppliers.noMatch.description')}
          actionLabel={t('suppliers.noMatch.action')}
          onAction={handleClearFilters}
        />
      ) : (
        <SupplierTable
          suppliers={suppliers}
          sortBy={filters.sortBy}
          sortDirection={filters.sortDirection}
          onSort={handleSort}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
