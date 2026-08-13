/* ============================================================
   GSDS v1.1 â€” PurchaseDetails
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Purchase order details view
   ============================================================
   Composition layer only:
   - Assembles items table, timeline, and totals.
   - All data accessed through usePurchaseDetails hook.
   - No business logic inside the component.
   ============================================================ */

import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Building2, Calendar, Package } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { usePurchaseDetails } from '../hooks/usePurchasingService';
import { getData, isState, getErrorMessage } from '../state/purchasingState';
import { PurchaseStatusBadge } from '../components/PurchaseStatusBadge';
import { PurchaseItemsTable } from '../components/PurchaseItemsTable';
import { PurchaseTimeline } from '../components/PurchaseTimeline';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'AED',
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export function PurchaseDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const state = usePurchaseDetails(id);
  const order = getData(state);
  const isLoading = isState(state, 'loading');
  const isError = isState(state, 'error');
  const errorMessage = getErrorMessage(state);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/purchasing')}
          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-9 w-9 p-0"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
            {order ? order.code : t('purchasing.details.title')}
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
      </div>

      {/* Content */}
      <div className="gsd-card p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2 text-sm [color:var(--gs-foreground-muted)]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {t('common.loading')}
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full [background:var(--gs-danger-soft)]">
              <ShoppingCart className="h-8 w-8 [color:var(--gs-danger)]" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">
              {t('errors.notFound')}
            </h2>
            <p className="text-sm [color:var(--gs-foreground-secondary)] max-w-md">
              {errorMessage || t('purchasing.details.notFoundDesc', { id: id || '' })}
            </p>
            <button
              type="button"
              onClick={() => navigate('/purchasing')}
              className="gsd-btn gsd-btn--primary gsd-btn--md mt-2"
            >
              {t('purchasing.backToList')}
            </button>
          </div>
        ) : order ? (
          <div className="flex flex-col gap-6">
            {/* Order info header */}
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl [background:var(--gs-primary-soft)]">
                <ShoppingCart className="h-8 w-8 [color:var(--gs-primary)]" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-semibold [color:var(--gs-foreground)]">
                    {order.code}
                  </h2>
                  <PurchaseStatusBadge status={order.status} />
                </div>
                <p className="flex items-center gap-1.5 text-sm [color:var(--gs-foreground-secondary)] mt-1">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  {order.supplier.name}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <PurchaseTimeline status={order.status} />

            {/* Details grid */}
            <div className="gsd-surface p-4 w-full text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 [color:var(--gs-primary)] shrink-0" aria-hidden="true" />
                  <span className="[color:var(--gs-foreground-muted)]">{t('purchasing.details.orderedAt')}:</span>
                  <span className="[color:var(--gs-foreground)]">{dateFormatter.format(new Date(order.orderedAt))}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 [color:var(--gs-primary)] shrink-0" aria-hidden="true" />
                  <span className="[color:var(--gs-foreground-muted)]">{t('purchasing.details.expectedAt')}:</span>
                  <span className="[color:var(--gs-foreground)]">
                    {order.expectedAt ? dateFormatter.format(new Date(order.expectedAt)) : 'â€”'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 [color:var(--gs-primary)] shrink-0" aria-hidden="true" />
                  <span className="[color:var(--gs-foreground-muted)]">{t('purchasing.details.items')}:</span>
                  <span className="[color:var(--gs-foreground)]">{order.items.length}</span>
                </div>
              </div>
            </div>

            {/* Items table */}
            <div>
              <h3 className="mb-3 text-sm font-semibold [color:var(--gs-foreground)]">
                {t('purchasing.details.lineItems')}
              </h3>
              <PurchaseItemsTable items={order.items} />
            </div>

            {/* Totals */}
            <div className="gsd-surface p-4 w-full text-sm">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="[color:var(--gs-foreground-muted)]">{t('purchasing.details.subtotal')}</span>
                  <span className="[color:var(--gs-foreground)]">{currencyFormatter.format(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="[color:var(--gs-foreground-muted)]">{t('purchasing.details.taxTotal')}</span>
                  <span className="[color:var(--gs-foreground)]">{currencyFormatter.format(order.taxTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="[color:var(--gs-foreground-muted)]">{t('purchasing.details.discountTotal')}</span>
                  <span className="[color:var(--gs-foreground)]">{currencyFormatter.format(order.discountTotal)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 [border-color:var(--gs-border-subtle)]">
                  <span className="font-semibold [color:var(--gs-foreground)]">{t('purchasing.details.total')}</span>
                  <span className="font-semibold [color:var(--gs-foreground)]">{currencyFormatter.format(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="gsd-surface p-4 w-full text-sm">
                <h3 className="text-sm font-semibold [color:var(--gs-foreground)] mb-2">
                  {t('purchasing.details.notes')}
                </h3>
                <p className="text-sm [color:var(--gs-foreground-secondary)]">{order.notes}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('/purchasing')}
                className="gsd-btn gsd-btn--secondary gsd-btn--md"
              >
                {t('purchasing.backToList')}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full [background:var(--gs-muted)]">
              <ShoppingCart className="h-8 w-8 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">
              {t('purchasing.details.notFound')}
            </h2>
            <p className="text-sm [color:var(--gs-foreground-secondary)] max-w-md">
              {t('purchasing.details.notFoundDesc', { id: id || '' })}
            </p>
            <button
              type="button"
              onClick={() => navigate('/purchasing')}
              className="gsd-btn gsd-btn--primary gsd-btn--md mt-2"
            >
              {t('purchasing.backToList')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
