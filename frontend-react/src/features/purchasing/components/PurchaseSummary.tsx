/* ============================================================
   GSDS v1.1 — PurchaseSummary Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — Summary cards for purchase dashboard
   ============================================================
   Pure presentation component.
   - Displays aggregate purchase metrics.
   - No business logic.
   ============================================================ */

import {
  ShoppingCart,
  Clock,
  BadgeCheck,
  PackageCheck,
  Coins,
  Package,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';

/* ─── Types ────────────────────────────────────────────────── */

export interface PurchaseSummaryProps {
  /** Total number of purchase orders */
  totalOrders: number;
  /** Count of pending orders */
  pendingOrders: number;
  /** Count of approved orders */
  approvedOrders: number;
  /** Count of received orders */
  receivedOrders: number;
  /** Total purchase value (mock aggregate) */
  totalSpend: number;
  /** Total quantity of items ordered */
  itemsOrdered: number;
  /** Optional class name override */
  className?: string;
}

/* ─── Currency Formatter ───────────────────────────────────── */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'AED',
  maximumFractionDigits: 0,
});

/* ─── Summary Card ─────────────────────────────────────────── */

function SummaryCard({
  labelKey,
  value,
  icon: Icon,
  tone,
  hintKey,
}: {
  labelKey: TranslationKey;
  value: string;
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

/* ─── PurchaseSummary ──────────────────────────────────────── */

export function PurchaseSummary({
  totalOrders,
  pendingOrders,
  approvedOrders,
  receivedOrders,
  totalSpend,
  itemsOrdered,
  className,
}: PurchaseSummaryProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3',
        className,
      )}
    >
      <SummaryCard
        labelKey="purchaseSummary.totalOrders"
        value={String(totalOrders)}
        icon={ShoppingCart}
        tone="neutral"
        hintKey="purchaseSummary.allOrders"
      />
      <SummaryCard
        labelKey="purchaseSummary.pendingOrders"
        value={String(pendingOrders)}
        icon={Clock}
        tone="warning"
        hintKey="purchaseSummary.pendingHint"
      />
      <SummaryCard
        labelKey="purchaseSummary.approvedOrders"
        value={String(approvedOrders)}
        icon={BadgeCheck}
        tone="info"
        hintKey="purchaseSummary.approvedHint"
      />
      <SummaryCard
        labelKey="purchaseSummary.receivedOrders"
        value={String(receivedOrders)}
        icon={PackageCheck}
        tone="success"
        hintKey="purchaseSummary.receivedHint"
      />
      <SummaryCard
        labelKey="purchaseSummary.totalSpend"
        value={currencyFormatter.format(totalSpend)}
        icon={Coins}
        tone="info"
        hintKey="purchaseSummary.spendHint"
      />
      <SummaryCard
        labelKey="purchaseSummary.itemsOrdered"
        value={String(itemsOrdered)}
        icon={Package}
        tone="neutral"
        hintKey="purchaseSummary.itemsHint"
      />
    </div>
  );
}
