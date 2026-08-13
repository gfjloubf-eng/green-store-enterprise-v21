/* ============================================================
   GSDS v1.1 — SupplierSummary Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Summary cards for supplier dashboard
   ============================================================
   Pure presentation component.
   - Displays aggregate supplier metrics.
   - No business logic.
   ============================================================ */

import {
  Truck,
  BadgeCheck,
  Clock,
  Coins,
  Package,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';

/* ─── Types ────────────────────────────────────────────────── */

export interface SupplierSummaryProps {
  /** Total number of suppliers */
  totalSuppliers: number;
  /** Count of active suppliers */
  activeSuppliers: number;
  /** Count of pending suppliers */
  pendingSuppliers: number;
  /** Total purchase value (mock aggregate) */
  totalPurchases: number;
  /** Total number of products supplied */
  totalProducts: number;
  /** Average supplier rating (1–5) */
  avgRating: number;
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

/* ─── SupplierSummary ──────────────────────────────────────── */

export function SupplierSummary({
  totalSuppliers,
  activeSuppliers,
  pendingSuppliers,
  totalPurchases,
  totalProducts,
  avgRating,
  className,
}: SupplierSummaryProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3',
        className,
      )}
    >
      <SummaryCard
        labelKey="supplierSummary.totalSuppliers"
        value={String(totalSuppliers)}
        icon={Truck}
        tone="neutral"
        hintKey="supplierSummary.allSuppliers"
      />
      <SummaryCard
        labelKey="supplierSummary.activeSuppliers"
        value={String(activeSuppliers)}
        icon={BadgeCheck}
        tone="success"
        hintKey="supplierSummary.activeHint"
      />
      <SummaryCard
        labelKey="supplierSummary.pendingSuppliers"
        value={String(pendingSuppliers)}
        icon={Clock}
        tone="warning"
        hintKey="supplierSummary.pendingHint"
      />
      <SummaryCard
        labelKey="supplierSummary.totalPurchases"
        value={currencyFormatter.format(totalPurchases)}
        icon={Coins}
        tone="info"
        hintKey="supplierSummary.purchasesHint"
      />
      <SummaryCard
        labelKey="supplierSummary.totalProducts"
        value={String(totalProducts)}
        icon={Package}
        tone="neutral"
        hintKey="supplierSummary.productsHint"
      />
      <SummaryCard
        labelKey="supplierSummary.avgRating"
        value={avgRating > 0 ? avgRating.toFixed(1) : '—'}
        icon={Star}
        tone="success"
        hintKey="supplierSummary.ratingHint"
      />
    </div>
  );
}

