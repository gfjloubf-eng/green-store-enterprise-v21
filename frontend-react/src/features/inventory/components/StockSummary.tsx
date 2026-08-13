/* ============================================================
   GSDS v1.1 — StockSummary Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Summary cards for inventory dashboard
   ============================================================
   Pure presentation component.
   - Displays aggregate inventory metrics.
   - No business logic.
   ============================================================ */

import {
  Package,
  Boxes,
  AlertTriangle,
  AlertCircle,
  PackageOpen,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';

/* ─── Types ────────────────────────────────────────────────── */

interface StockSummaryProps {
  /** Total number of products tracked */
  totalProducts: number;
  /** Total units on hand */
  totalUnits: number;
  /** Count of low-stock items */
  lowStockCount: number;
  /** Count of out-of-stock items */
  outOfStockCount: number;
  /** Count of overstocked items */
  overstockedCount: number;
  /** Optional class name override */
  className?: string;
}

/* ─── Summary Card ─────────────────────────────────────────── */

function SummaryCard({
  labelKey,
  value,
  icon: Icon,
  tone,
  hintKey,
}: {
  labelKey: TranslationKey;
  value: number;
  icon: LucideIcon;
  tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  hintKey?: TranslationKey;
}) {
  const { t } = useI18n();

  const toneClasses: Record<typeof tone, string> = {
    neutral: '[color:var(--gs-foreground)] [background:var(--gs-muted)]',
    success: '[color:var(--gs-success)] [background:var(--gs-success-soft)]',
    warning: '[color:var(--gs-warning)] [background:var(--gs-warning-soft)]',
    danger: '[color:var(--gs-danger)] [background:var(--gs-danger-soft)]',
    info: '[color:var(--gs-accent-blue)] [background:var(--gs-accent-blue-soft)]',
  };

  return (
    <div className="gsd-card p-4 flex items-start gap-3">
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          toneClasses[tone],
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold leading-none tabular-nums [color:var(--gs-foreground)]">
          {value}
        </p>
        <p className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">
          {t(labelKey)}
        </p>
        {hintKey && (
          <p className="mt-0.5 text-[10px] [color:var(--gs-foreground-muted)]">
            {t(hintKey)}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── StockSummary ─────────────────────────────────────────── */

export function StockSummary({
  totalProducts,
  totalUnits,
  lowStockCount,
  outOfStockCount,
  overstockedCount,
  className,
}: StockSummaryProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3',
        className,
      )}
    >
      <SummaryCard
        labelKey="invSummary.totalProducts"
        value={totalProducts}
        icon={Package}
        tone="neutral"
        hintKey="invSummary.trackedProducts"
      />
      <SummaryCard
        labelKey="invSummary.totalUnits"
        value={totalUnits}
        icon={Boxes}
        tone="success"
        hintKey="invSummary.unitsOnHand"
      />
      <SummaryCard
        labelKey="invSummary.lowStock"
        value={lowStockCount}
        icon={AlertTriangle}
        tone="warning"
        hintKey="invSummary.needsAttention"
      />
      <SummaryCard
        labelKey="invSummary.outOfStock"
        value={outOfStockCount}
        icon={AlertCircle}
        tone="danger"
        hintKey="invSummary.urgent"
      />
      <SummaryCard
        labelKey="invSummary.overstocked"
        value={overstockedCount}
        icon={PackageOpen}
        tone="info"
        hintKey="invSummary.excessStock"
      />
    </div>
  );
}

