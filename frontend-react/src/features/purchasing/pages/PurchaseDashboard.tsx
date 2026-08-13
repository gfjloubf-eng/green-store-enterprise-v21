/* ============================================================
   GSDS v1.1 â€” PurchaseDashboard
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Purchase overview dashboard
   ============================================================
   Composition layer only:
   - Assembles summary cards, recent orders, and status breakdown.
   - All data accessed through usePurchasingService hooks.
   - No business logic inside the component.
   ============================================================ */

import { ShoppingCart } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { PurchaseSummary } from '../components/PurchaseSummary';
import { PurchaseCard } from '../components/PurchaseCard';
import { PurchaseEmptyState } from '../components/PurchaseEmptyState';
import { PurchaseStatusBadge } from '../components/PurchaseStatusBadge';
import { usePurchaseDashboard } from '../hooks/usePurchasingService';
import { isState, getData } from '../state/purchasingState';

export function PurchaseDashboard() {
  const { t } = useI18n();
  const state = usePurchaseDashboard();

  /* â”€â”€ Loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€ Error â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (isState(state, 'error')) {
    return (
      <div className="gsd-card p-8 text-center">
        <p className="text-sm [color:var(--gs-danger)]">{t('common.error')}</p>
      </div>
    );
  }

  /* â”€â”€ Empty â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (isState(state, 'empty') || !getData(state)) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader />
        <PurchaseEmptyState
          title={t('purchasing.empty.title')}
          description={t('purchasing.empty.description')}
        />
      </div>
    );
  }

  const data = getData(state)!;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader />

      {/* â”€â”€ Summary Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <PurchaseSummary
        totalOrders={data.summary.totalOrders}
        pendingOrders={data.summary.pendingOrders}
        approvedOrders={data.summary.approvedOrders}
        receivedOrders={data.summary.receivedOrders}
        totalSpend={data.summary.totalSpend}
        itemsOrdered={data.summary.itemsOrdered}
      />

      {/* â”€â”€ Two-column layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="xl:col-span-2">
          <h2 className="mb-3 text-sm font-semibold [color:var(--gs-foreground)]">
            {t('purchasing.recentOrders')}
          </h2>
          {data.recentOrders.length === 0 ? (
            <PurchaseEmptyState
              title={t('purchasing.recentOrdersEmpty')}
              description={t('purchasing.recentOrdersEmptyDesc')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.recentOrders.slice(0, 4).map((order) => (
                <PurchaseCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        {/* Status breakdown */}
        <div>
          <h2 className="mb-3 text-sm font-semibold [color:var(--gs-foreground)]">
            {t('purchasing.statusBreakdown')}
          </h2>
          <div className="gsd-card p-4">
            {data.statusBreakdown.length === 0 ? (
              <p className="text-xs [color:var(--gs-foreground-muted)]">
                {t('purchasing.statusBreakdownEmpty')}
              </p>
            ) : (
              <ul className="space-y-2">
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
            )}
          </div>
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
        <ShoppingCart className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
        {t('purchasing.dashboard.title')}
      </h1>
      <BreadcrumbEngine className="mt-1" />
    </div>
  );
}
