/* ============================================================
   GSDS v1.1 — SupplierStatusBadge Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Reusable supplier status badge
   ============================================================
   Pure presentation component.
   - Displays a supplier lifecycle status as a GSDS badge.
   - No business logic.
   - Uses SUPPLIER_STATUS_CONFIG for tone classes.
   - Label resolved via t("supplierStatus.{status}").
   ============================================================ */

import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import { SUPPLIER_STATUS_CONFIG } from '../constants';
import type { SupplierStatus } from '../types/supplier';

/* ─── Props ────────────────────────────────────────────────── */

interface SupplierStatusBadgeProps {
  /** Supplier status to display */
  status: SupplierStatus;
  /** Optional class name override */
  className?: string;
}

/* ─── SupplierStatusBadge ──────────────────────────────────── */

export function SupplierStatusBadge({ status, className }: SupplierStatusBadgeProps) {
  const { t } = useI18n();
  const config =
    SUPPLIER_STATUS_CONFIG[status] ?? SUPPLIER_STATUS_CONFIG.active;

  return (
    <span className={cn('gsd-badge', config.className, className)}>
      {t(`supplierStatus.${status}` as TranslationKey)}
    </span>
  );
}

