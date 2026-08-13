/* ============================================================
   GSDS v1.1 — SupplierDashboard
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Supplier overview dashboard
   ============================================================
   Composition layer only:
   - Assembles summary cards, top suppliers, and recent orders.
   - All data accessed through useSupplierService hooks.
   - No business logic inside the component.
   ============================================================ */

import { Truck } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { SupplierSummary } from '../components/SupplierSummary';
import { SupplierCard } from '../components/SupplierCard';
import { SupplierEmptyState } from '../components/SupplierEmptyState';
import { useSupplierDashboard } from '../hooks/useSupplierService';
import { isState, getData } from '../state/supplierState';

export function SupplierDashboard() {
  const { t } = useI18n();
  const state = useSupplierDashboard();

  /* ── Loading ───────────────────────────────────────── */
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

  /* ── Error ─────────────────────────────────────────── */
  if (isState(state, 'error')) {
    return (
      <div className="gsd-card p-8 text-center">
        <p className="text-sm [color:var(--gs-danger)]">{t('common.error')}</p>
      </div>
    );
  }

  /* ── Empty ─────────────────────────────────────────── */
  if (isState(state, 'empty') || !getData(state)) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader />
        <SupplierEmptyState
          title={t('suppliers.empty.title')}
          description={t('suppliers.empty.description')}
        />
      </div>
    );
  }

  const data = getData(state)!;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader />

      {/* ── Summary Cards ────────────────────────────── */}
      <SupplierSummary
        totalSuppliers={data.summary.totalSuppliers}
        activeSuppliers={data.summary.activeSuppliers}
        pendingSuppliers={data.summary.pendingSuppliers}
        totalPurchases={data.summary.totalPurchases}
        totalProducts={data.summary.totalProducts}
        avgRating={data.summary.avgRating}
      />

      {/* ── Two-column layout ────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top suppliers */}
        <div className="xl:col-span-2">
          <h2 className="mb-3 text-sm font-semibold [color:var(--gs-foreground)]">
            {t('suppliers.topSuppliers')}
          </h2>
          {data.topSuppliers.length === 0 ? (
            <SupplierEmptyState
              title={t('suppliers.topSuppliersEmpty')}
              description={t('suppliers.topSuppliersEmptyDesc')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.topSuppliers.slice(0, 4).map((supplier) => (
                <SupplierCard key={supplier.id} supplier={supplier} />
              ))}
            </div>
          )}
        </div>

        {/* Recent orders - placeholder */}
        <div>
          <h2 className="mb-3 text-sm font-semibold [color:var(--gs-foreground)]">
            {t('suppliers.recentOrders')}
          </h2>
          <div className="gsd-card p-4 text-center">
            <p className="text-xs [color:var(--gs-foreground-muted)]">
              {t('suppliers.recentOrdersPlaceholder')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page Header ──────────────────────────────────────────── */

function PageHeader() {
  const { t } = useI18n();
  return (
    <div>
      <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
        <Truck className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
        {t('suppliers.dashboard.title')}
      </h1>
      <BreadcrumbEngine className="mt-1" />
    </div>
  );
}
