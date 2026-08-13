/* ============================================================
   GSDS v1.1 — PurchaseEmptyState Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — Professional empty state placeholder
   ============================================================
   Pure presentation component.
   Reuses the same GSDS pattern as the Product/Inventory/Supplier EmptyState.
   ============================================================ */

import { ShoppingCart, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Props ────────────────────────────────────────────────── */

interface PurchaseEmptyStateProps {
  /** Icon to display */
  icon?: LucideIcon;
  /** Empty state title */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional CTA text */
  actionLabel?: string;
  /** Optional CTA click handler */
  onAction?: () => void;
  /** Optional class name override */
  className?: string;
}

/* ─── PurchaseEmptyState ───────────────────────────────────── */

export function PurchaseEmptyState({
  icon: Icon = ShoppingCart,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: PurchaseEmptyStateProps) {
  return (
    <div
      className={cn(
        'gsd-empty-state flex flex-col items-center justify-center py-16 px-6 text-center',
        className,
      )}
      role="status"
    >
      {/* Icon container */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full [background:var(--gs-muted)] mb-5">
        <Icon className="h-8 w-8 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold [color:var(--gs-foreground)] mb-1">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm [color:var(--gs-foreground-secondary)] max-w-sm mb-6">
          {description}
        </p>
      )}

      {/* Optional CTA */}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="gsd-btn gsd-btn--primary gsd-btn--md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
