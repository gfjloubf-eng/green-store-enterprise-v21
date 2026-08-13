/* ============================================================
   GSDS v1.1 — StockCard Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Individual stock status card
   ============================================================
   Pure presentation component.
   Displays a single inventory record's stock status.
   ============================================================ */

import { AlertTriangle, AlertCircle, PackageCheck, PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import type { InventorySummary } from '../types/inventory';
import { StockBadge } from './StockBadge';

/* ─── Props ────────────────────────────────────────────────── */

interface StockCardProps {
  /** Inventory record to display */
  item: InventorySummary;
  /** Optional click handler */
  onClick?: (item: InventorySummary) => void;
  /** Optional class name override */
  className?: string;
}

/* ─── Status Icon Helper ───────────────────────────────────── */

function StatusIcon({ status }: { status: InventorySummary['status'] }) {
  switch (status) {
    case 'low_stock':
      return <AlertTriangle className="h-5 w-5 [color:var(--gs-warning)]" aria-hidden="true" />;
    case 'out_of_stock':
      return <AlertCircle className="h-5 w-5 [color:var(--gs-danger)]" aria-hidden="true" />;
    case 'overstocked':
      return <PackageOpen className="h-5 w-5 [color:var(--gs-accent-blue)]" aria-hidden="true" />;
    case 'in_stock':
    default:
      return <PackageCheck className="h-5 w-5 [color:var(--gs-success)]" aria-hidden="true" />;
  }
}

/* ─── StockCard ────────────────────────────────────────────── */

export function StockCard({ item, onClick, className }: StockCardProps) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      className={cn(
        'gsd-card p-4 text-start transition-all duration-150 hover:shadow-md',
        onClick && 'cursor-pointer hover:[background:var(--gs-card-hover)]',
        className,
      )}
      aria-label={`${item.productName} — ${t(
        `invStatus.${item.status}` as TranslationKey,
      )}`}
    >
      {/* Top row: icon + status */}
      <div className="flex items-start justify-between gap-2">
        <StatusIcon status={item.status} />
        <StockBadge status={item.status} />
      </div>

      {/* Product name */}
      <h3
        className="gsd-truncate mt-3 text-sm font-semibold [color:var(--gs-foreground)]"
        title={item.productName}
      >
        {item.productName}
      </h3>

      {/* SKU */}
      <p className="mt-0.5 font-mono text-xs [color:var(--gs-foreground-muted)]">
        {item.sku}
      </p>

      {/* Quantities */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg [background:var(--gs-muted)] py-2">
          <p className="text-[10px] uppercase tracking-wider [color:var(--gs-foreground-muted)]">
            {t('invCard.onHand')}
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums [color:var(--gs-foreground)]">
            {item.quantityOnHand}
          </p>
        </div>
        <div className="rounded-lg [background:var(--gs-muted)] py-2">
          <p className="text-[10px] uppercase tracking-wider [color:var(--gs-foreground-muted)]">
            {t('invCard.reserved')}
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums [color:var(--gs-foreground-secondary)]">
            {item.quantityReserved}
          </p>
        </div>
        <div className="rounded-lg [background:var(--gs-muted)] py-2">
          <p className="text-[10px] uppercase tracking-wider [color:var(--gs-foreground-muted)]">
            {t('invCard.available')}
          </p>
          <p
            className={cn(
              'mt-0.5 text-sm font-semibold tabular-nums',
              item.quantityAvailable === 0
                ? '[color:var(--gs-danger)]'
                : item.quantityAvailable < item.minStock
                  ? '[color:var(--gs-warning)]'
                  : '[color:var(--gs-foreground)]',
            )}
          >
            {item.quantityAvailable}
          </p>
        </div>
      </div>

      {/* Location */}
      <p className="mt-3 text-xs [color:var(--gs-foreground-muted)]">
        {item.location.name}
      </p>
    </button>
  );
}

