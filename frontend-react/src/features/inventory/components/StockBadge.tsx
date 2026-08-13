/* ============================================================
   GSDS v1.1 — StockBadge Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Reusable stock status badge
   ============================================================
   Pure presentation component.
   - Displays an inventory stock status as a GSDS badge.
   - No business logic.
   - Uses INVENTORY_STATUS_CONFIG for tone classes.
   - Label resolved via t("invStatus.{status}").
   ============================================================ */

import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import { INVENTORY_STATUS_CONFIG } from '../constants';
import type { InventoryStatus } from '../types/inventory';

/* ─── Props ────────────────────────────────────────────────── */

interface StockBadgeProps {
  /** Inventory stock status to display */
  status: InventoryStatus;
  /** Optional class name override */
  className?: string;
}

/* ─── StockBadge ───────────────────────────────────────────── */

export function StockBadge({ status, className }: StockBadgeProps) {
  const { t } = useI18n();
  const config =
    INVENTORY_STATUS_CONFIG[status] ?? INVENTORY_STATUS_CONFIG.in_stock;

  return (
    <span className={cn('gsd-badge', config.className, className)}>
      {t(`invStatus.${status}` as TranslationKey)}
    </span>
  );
}

