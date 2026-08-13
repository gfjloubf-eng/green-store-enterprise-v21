/* ============================================================
   GSDS v1.1 — SupplierBadge Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Reusable supplier category badge
   ============================================================
   Pure presentation component.
   - Displays a supplier category as a GSDS neutral badge.
   - No business logic.
   - Uses GSDS badge classes.
   ============================================================ */

import { cn } from '@/lib/utils';
import type { SupplierCategoryRef } from '../types/supplier';

/* ─── Props ────────────────────────────────────────────────── */

interface SupplierBadgeProps {
  /** Supplier category reference to display */
  category: SupplierCategoryRef;
  /** Optional class name override */
  className?: string;
}

/* ─── SupplierBadge ────────────────────────────────────────── */

export function SupplierBadge({ category, className }: SupplierBadgeProps) {
  return (
    <span className={cn('gsd-badge gsd-badge--neutral', className)}>
      {category.name}
    </span>
  );
}

