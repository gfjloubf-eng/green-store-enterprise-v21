/* ============================================================
   GSDS v1.1 — OutOfStock
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Out of stock items overview
   ============================================================
   Composition layer only:
   - Shows out-of-stock items as cards.
   - Data accessed through useOutOfStock hook.
   ============================================================ */

import { AlertCircle } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { StockCard } from '../components/StockCard';
import { InventoryEmptyState } from '../components/InventoryEmptyState';
import { useOutOfStock } from '../hooks/useInventoryService';
import { isState, getData } from '../state/inventoryState';

export function OutOfStock() {
  const { t } = useI18n();
  const state = useOutOfStock();

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
          title={t('inventory.outOfStock.empty')}
          description={t('inventory.outOfStock.emptyDesc')}
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
        <AlertCircle className="h-6 w-6 [color:var(--gs-danger)]" aria-hidden="true" />
        {t('inventory.outOfStock.title')}
      </h1>
      <BreadcrumbEngine className="mt-1" />
    </div>
  );
}

