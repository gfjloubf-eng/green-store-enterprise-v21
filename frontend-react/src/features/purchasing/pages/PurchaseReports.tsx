/* ============================================================
   GSDS v1.1 â€” PurchaseReports
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Purchase reports overview
   ============================================================
   Composition layer only:
   - Displays aggregate purchase reporting metrics.
   - All data accessed through usePurchasingService hooks.
   - No business logic inside the component.
   ============================================================ */

import { BarChart3 } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { usePurchaseDashboard } from '../hooks/usePurchasingService';
import { isState, getData } from '../state/purchasingState';
import { PurchaseSummary } from '../components/PurchaseSummary';
import { PurchaseEmptyState } from '../components/PurchaseEmptyState';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'AED',
  maximumFractionDigits: 0,
});

export function PurchaseReports() {
  const { t } = useI18n();
  const state = usePurchaseDashboard();

  if (isState(state, 'loading')) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-2 text-sm [color:var(--gs-foreground-muted)]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (isState(state, 'error')) {
    return (
      <div className="gsd-card p-8 text-center">
        <p className="text-sm [color:var(--gs-danger)]">{t('common.error')}</p>
      </div>
    );
  }

  if (isState(state, 'empty') || !getData(state)) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader />
        <PurchaseEmptyState
          title={t('purchasing.reports.empty')}
          description={t('purchasing.reports.emptyDesc')}
        />
      </div>
    );
  }

  const data = getData(state)!;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader />

      <PurchaseSummary
        totalOrders={data.summary.totalOrders}
        pendingOrders={data.summary.pendingOrders}
        approvedOrders={data.summary.approvedOrders}
        receivedOrders={data.summary.receivedOrders}
        totalSpend={data.summary.totalSpend}
        itemsOrdered={data.summary.itemsOrdered}
      />

      {/* Report placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="gsd-card p-5">
          <h3 className="text-sm font-semibold [color:var(--gs-foreground)]">
            {t('purchasing.reports.spendBySupplier')}
          </h3>
          <p className="mt-2 text-2xl font-semibold tabular-nums [color:var(--gs-foreground)]">
            {currencyFormatter.format(data.summary.totalSpend)}
          </p>
          <p className="mt-1 text-xs [color:var(--gs-foreground-muted)]">
            {t('purchasing.reports.spendBySupplierHint')}
          </p>
        </div>
        <div className="gsd-card p-5">
          <h3 className="text-sm font-semibold [color:var(--gs-foreground)]">
            {t('purchasing.reports.orderTrend')}
          </h3>
          <p className="mt-2 text-2xl font-semibold tabular-nums [color:var(--gs-foreground)]">
            {data.summary.totalOrders}
          </p>
          <p className="mt-1 text-xs [color:var(--gs-foreground-muted)]">
            {t('purchasing.reports.orderTrendHint')}
          </p>
        </div>
        <div className="gsd-card p-5">
          <h3 className="text-sm font-semibold [color:var(--gs-foreground)]">
            {t('purchasing.reports.statusBreakdown')}
          </h3>
          <p className="mt-2 text-2xl font-semibold tabular-nums [color:var(--gs-foreground)]">
            {data.statusBreakdown.length}
          </p>
          <p className="mt-1 text-xs [color:var(--gs-foreground-muted)]">
            {t('purchasing.reports.statusBreakdownHint')}
          </p>
        </div>
      </div>
    </div>
  );
}

/* â”€â”€â”€ Page Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function PageHeader() {
  const { t } = useI18n();
  return (
    <div>
      <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
        <BarChart3 className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
        {t('purchasing.reports.title')}
      </h1>
      <BreadcrumbEngine className="mt-1" />
    </div>
  );
}
