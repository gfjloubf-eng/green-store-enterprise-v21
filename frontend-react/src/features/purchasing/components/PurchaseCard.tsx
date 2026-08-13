/* ============================================================
   GSDS v1.1 — PurchaseCard Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — Individual purchase order card
   ============================================================
   Pure presentation component.
   Displays a single purchase order record's summary.
   ============================================================ */

import { ShoppingCart, Building2, Calendar, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import type { PurchaseTableModel } from '../domain/purchaseTableModel';
import { PurchaseStatusBadge } from './PurchaseStatusBadge';

/* ─── Props ────────────────────────────────────────────────── */

interface PurchaseCardProps {
  /** Purchase order record to display */
  order: PurchaseTableModel;
  /** Optional click handler */
  onClick?: (order: PurchaseTableModel) => void;
  /** Optional class name override */
  className?: string;
}

/* ─── Currency Formatter ───────────────────────────────────── */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'AED',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

/* ─── PurchaseCard ─────────────────────────────────────────── */

export function PurchaseCard({ order, onClick, className }: PurchaseCardProps) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => onClick?.(order)}
      className={cn(
        'gsd-card p-4 text-start transition-all duration-150 hover:shadow-md',
        onClick && 'cursor-pointer hover:[background:var(--gs-card-hover)]',
        className,
      )}
      aria-label={`${order.code} — ${t(
        `purchaseStatus.${order.status}` as TranslationKey,
      )}`}
    >
      {/* Top row: icon + status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg [background:var(--gs-muted)]">
          <ShoppingCart className="h-5 w-5 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
        </div>
        <PurchaseStatusBadge status={order.status} />
      </div>

      {/* Order code */}
      <h3
        className="gsd-truncate mt-3 text-sm font-semibold [color:var(--gs-foreground)]"
        title={order.code}
      >
        {order.code}
      </h3>

      {/* Supplier */}
      <p className="mt-0.5 flex items-center gap-1.5 text-xs [color:var(--gs-foreground-secondary)]">
        <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="gsd-truncate">{order.supplier.name}</span>
      </p>

      {/* Metrics */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg [background:var(--gs-muted)] py-2">
          <p className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider [color:var(--gs-foreground-muted)]">
            <Package className="h-3 w-3" aria-hidden="true" />
            {t('purchaseCard.items')}
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums [color:var(--gs-foreground)]">
            {order.itemCount}
          </p>
        </div>
        <div className="rounded-lg [background:var(--gs-muted)] py-2">
          <p className="text-[10px] uppercase tracking-wider [color:var(--gs-foreground-muted)]">
            {t('purchaseCard.total')}
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums [color:var(--gs-foreground)]">
            {currencyFormatter.format(order.totalCost)}
          </p>
        </div>
      </div>

      {/* Expected date */}
      <p className="mt-3 flex items-center gap-1.5 text-xs [color:var(--gs-foreground-muted)]">
        <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {order.expectedAt
          ? dateFormatter.format(new Date(order.expectedAt))
          : t('purchaseCard.noExpectedDate')}
      </p>
    </button>
  );
}
