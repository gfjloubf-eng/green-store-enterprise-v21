/* ============================================================
   GSDS v1.1 — StockMovements
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Stock movement history page
   ============================================================
   Composition layer only:
   - Shows MovementTable with optional type/status filtering.
   - No business logic inside the component.
   ============================================================ */

import { useState, useCallback } from 'react';
import { History } from 'lucide-react';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { MovementTable } from '../components/MovementTable';
import { InventoryEmptyState } from '../components/InventoryEmptyState';
import { useMovementHistory, useMovementFilter } from '../hooks/useInventoryService';
import { isState } from '../state/inventoryState';
import { MOVEMENT_TYPE_OPTIONS, MOVEMENT_STATUS_OPTIONS } from '../constants';
import type { MovementDTO } from '../domain/movementDTO';

export function StockMovements() {
  const { t } = useI18n();
  const state = useMovementHistory();
  const [sortBy, setSortBy] = useState('performedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [typeFilter, setTypeFilter] = useState<MovementDTO['type'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<MovementDTO['status'] | 'all'>('all');

  const filteredMovements = useMovementFilter(typeFilter, statusFilter);

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

  /* ── Loading ───────────────────────────────────────── */
  if (isState(state, 'loading')) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader />
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-2 text-sm [color:var(--gs-foreground-muted)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {t('common.loading')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader />

      {/* ── Filters ──────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as MovementDTO['type'] | 'all')}
          className="gsd-input h-9 text-sm min-w-[150px] max-w-[200px]"
          aria-label={t('inventory.filterByType')}
        >
          <option value="all">{t('inventory.allTypes')}</option>
          {MOVEMENT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(`movementType.${opt.value}` as TranslationKey)}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as MovementDTO['status'] | 'all')}
          className="gsd-input h-9 text-sm min-w-[150px] max-w-[200px]"
          aria-label={t('inventory.filterByStatus')}
        >
          <option value="all">{t('inventory.allStatuses')}</option>
          {MOVEMENT_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(`movementStatus.${opt.value}` as TranslationKey)}
            </option>
          ))}
        </select>
      </div>

      {/* ── Content Area ─────────────────────────────── */}
      {filteredMovements.length === 0 ? (
        <InventoryEmptyState
          title={t('inventory.noMovements.title')}
          description={t('inventory.noMovements.description')}
        />
      ) : (
        <MovementTable
          movements={filteredMovements}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}
    </div>
  );
}

/* ─── Page Header ──────────────────────────────────────────── */

function PageHeader() {
  const { t } = useI18n();
  return (
    <div>
      <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
        <History className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
        {t('inventory.stockMovements.title')}
      </h1>
      <BreadcrumbEngine className="mt-1" />
    </div>
  );
}

