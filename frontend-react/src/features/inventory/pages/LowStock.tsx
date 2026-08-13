/* ============================================================
   GSDS v1.1 — LowStock
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Low stock items overview
   ============================================================
   Composition layer only:
   - Shows low-stock items as cards.
   - Data accessed through useLowStock hook.
   ============================================================ */

import { AlertTriangle } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { StockCard } from '../components/StockCard';
import { InventoryEmptyState } from '../components/InventoryEmptyState';
import { useLowStock } from '../hooks/useInventoryService';
import { isState, getData } from '../state/inventoryState';

export function LowStock() {
  const { t } = useI18n();
  const state = useLowStock();

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

  /* ── Error ─────────────────────────────────────────── */
  if (isState(state, 'error')) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader />
        <div className="gsd-card p-8 text-center">
          <p className="text-sm [color:var(--gs-danger)]">{t('common.error')}</p>
        </div>
      </div>
    );
  }

  const items = getData(state) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader />

      {items.length === 0 ? (
        <InventoryEmptyState
          title={t('inventory.lowStock.empty')}
          description={t('inventory.lowStock.emptyDesc')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {items.map((item) => (
            <StockCard key={item.id} item={item} />
          ))}
        </div>
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
        <AlertTriangle className="h-6 w-6 [color:var(--gs-warning)]" aria-hidden="true" />
        {t('inventory.lowStock.title')}
      </h1>
      <BreadcrumbEngine className="mt-1" />
    </div>
  );
}

