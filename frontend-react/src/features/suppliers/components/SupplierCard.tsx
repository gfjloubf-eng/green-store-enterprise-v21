/* ============================================================
   GSDS v1.1 — SupplierCard Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Individual supplier card
   ============================================================
   Pure presentation component.
   Displays a single supplier record's summary.
   ============================================================ */

import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import type { SupplierTableModel } from '../domain/supplierTableModel';
import { SupplierStatusBadge } from './SupplierStatusBadge';
import { SupplierBadge } from './SupplierBadge';

/* ─── Props ────────────────────────────────────────────────── */

interface SupplierCardProps {
  /** Supplier record to display */
  supplier: SupplierTableModel;
  /** Optional click handler */
  onClick?: (supplier: SupplierTableModel) => void;
  /** Optional class name override */
  className?: string;
}

/* ─── Currency Formatter ───────────────────────────────────── */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'AED',
  maximumFractionDigits: 0,
});

/* ─── SupplierCard ─────────────────────────────────────────── */

export function SupplierCard({ supplier, onClick, className }: SupplierCardProps) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => onClick?.(supplier)}
      className={cn(
        'gsd-card p-4 text-start transition-all duration-150 hover:shadow-md',
        onClick && 'cursor-pointer hover:[background:var(--gs-card-hover)]',
        className,
      )}
      aria-label={`${supplier.name} — ${t(
        `supplierStatus.${supplier.status}` as TranslationKey,
      )}`}
    >
      {/* Top row: icon + status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg [background:var(--gs-muted)]">
          <Building2 className="h-5 w-5 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
        </div>
        <SupplierStatusBadge status={supplier.status} />
      </div>

      {/* Supplier name */}
      <h3
        className="gsd-truncate mt-3 text-sm font-semibold [color:var(--gs-foreground)]"
        title={supplier.name}
      >
        {supplier.name}
      </h3>

      {/* Code + category */}
      <p className="mt-0.5 font-mono text-xs [color:var(--gs-foreground-muted)]">
        {supplier.code}
      </p>
      <div className="mt-1">
        <SupplierBadge category={supplier.category} />
      </div>

      {/* Contact + location */}
      <div className="mt-3 space-y-1.5">
        <p className="flex items-center gap-1.5 text-xs [color:var(--gs-foreground-secondary)]">
          <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="gsd-truncate">{supplier.email}</span>
        </p>
        <p className="flex items-center gap-1.5 text-xs [color:var(--gs-foreground-secondary)]">
          <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {supplier.phone}
        </p>
        <p className="flex items-center gap-1.5 text-xs [color:var(--gs-foreground-secondary)]">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {supplier.city}, {supplier.country}
        </p>
      </div>

      {/* Metrics */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg [background:var(--gs-muted)] py-2">
          <p className="text-[10px] uppercase tracking-wider [color:var(--gs-foreground-muted)]">
            {t('supplierCard.products')}
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums [color:var(--gs-foreground)]">
            {supplier.productCount}
          </p>
        </div>
        <div className="rounded-lg [background:var(--gs-muted)] py-2">
          <p className="text-[10px] uppercase tracking-wider [color:var(--gs-foreground-muted)]">
            {t('supplierCard.purchases')}
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums [color:var(--gs-foreground)]">
            {currencyFormatter.format(supplier.totalPurchases)}
          </p>
        </div>
      </div>
    </button>
  );
}

