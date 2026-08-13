/* ============================================================
   GSDS v1.1 â€” PurchaseAnalytics
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Purchase analytics overview
   ============================================================
   Composition layer only:
   - Displays aggregate purchase analytics metrics.
   - All data accessed through usePurchasingService hooks.
   - No business logic inside the component.
   ============================================================ */

import { TrendingUp, PieChart, Activity } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { usePurchaseDashboard } from '../hooks/usePurchasingService';
import { isState, getData } from '../state/purchasingState';
import { PurchaseEmptyState } from '../components/PurchaseEmptyState';
import { PurchaseStatusBadge } from '../components/PurchaseStatusBadge';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'AED',
  maximumFractionDigits: 0,
});

export function PurchaseAnalytics() {
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
          title={t('purchasing.analytics.empty')}
          description={t('purchasing.analytics.emptyDesc')}
        />
      </div>
    );
  }

  const data = getData(state)!;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader />

      {/* Analytics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="gsd-card p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 [color:var(--gs-primary)]" aria-hidden="true" />
            <h3 className="text-sm font-semibold [color:var(--gs-foreground)]">
              {t('purchasing.analytics.totalSpend')}
            </h3>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums [color:var(--gs-foreground)]">
            {currencyFormatter.format(data.summary.totalSpend)}
          </p>
        </div>
        <div className="gsd-card p-5">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 [color:var(--gs-primary)]" aria-hidden="true" />
            <h3 className="text-sm font-semibold [color:var(--gs-foreground)]">
              {t('purchasing.analytics.statusDistribution')}
            </h3>
          </div>
          <ul className="mt-3 space-y-2">
            {data.statusBreakdown.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2"
              >
                <PurchaseStatusBadge status={item.id as never} />
                <span className="text-sm font-semibold tabular-nums [color:var(--gs-foreground)]">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="gsd-card p-5">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 [color:var(--gs-primary)]" aria-hidden="true" />
            <h3 className="text-sm font-semibold [color:var(--gs-foreground)]">
              {t('purchasing.analytics.activity')}
            </h3>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums [color:var(--gs-foreground)]">
            {data.summary.totalOrders}
          </p>
          <p className="mt-1 text-xs [color:var(--gs-foreground-muted)]">
            {t('purchasing.analytics.activityHint')}
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
        <TrendingUp className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
        {t('purchasing.analytics.title')}
      </h1>
      <BreadcrumbEngine className="mt-1" />
    </div>
  );
}
