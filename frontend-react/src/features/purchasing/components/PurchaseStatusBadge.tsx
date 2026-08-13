/* ============================================================
   GSDS v1.1 — PurchaseStatusBadge Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — Reusable purchase status badge
   ============================================================
   Pure presentation component.
   - Displays a purchase order lifecycle status as a GSDS badge.
   - No business logic.
   - Uses PURCHASE_STATUS_CONFIG for tone classes.
   - Label resolved via t("purchaseStatus.{status}").
   ============================================================ */

import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import { PURCHASE_STATUS_CONFIG } from '../constants';
import type { PurchaseStatus } from '../types/purchasing';

/* ─── Props ────────────────────────────────────────────────── */

interface PurchaseStatusBadgeProps {
  /** Purchase status to display */
  status: PurchaseStatus;
  /** Optional class name override */
  className?: string;
}

/* ─── PurchaseStatusBadge ──────────────────────────────────── */

export function PurchaseStatusBadge({
  status,
  className,
}: PurchaseStatusBadgeProps) {
  const { t } = useI18n();
  const config = PURCHASE_STATUS_CONFIG[status] ?? PURCHASE_STATUS_CONFIG.draft;

  return (
    <span className={cn('gsd-badge', config.className, className)}>
      {t(`purchaseStatus.${status}` as TranslationKey)}
    </span>
  );
}
