/* ============================================================
   GSDS v1.1 — MovementBadge Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Reusable movement badge
   ============================================================
   Pure presentation component.
   - Displays a movement type OR movement status as a GSDS badge.
   - The `variant` prop selects which config map to use.
   - No business logic.
   - Labels resolved via t("movementType.*") / t("movementStatus.*").
   ============================================================ */

import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import {
  MOVEMENT_TYPE_CONFIG,
  MOVEMENT_STATUS_CONFIG,
} from '../constants';
import type { MovementType, MovementStatus } from '../types/inventory';

/* ─── Props ────────────────────────────────────────────────── */

interface MovementBadgeProps {
  /** Which kind of movement value to render */
  variant: 'type' | 'status';
  /** The movement type (required when variant="type") */
  type?: MovementType;
  /** The movement status (required when variant="status") */
  status?: MovementStatus;
  /** Optional class name override */
  className?: string;
}

/* ─── MovementBadge ────────────────────────────────────────── */

export function MovementBadge({
  variant,
  type,
  status,
  className,
}: MovementBadgeProps) {
  const { t } = useI18n();

  if (variant === 'type' && type) {
    const config = MOVEMENT_TYPE_CONFIG[type] ?? MOVEMENT_TYPE_CONFIG.adjustment;
    return (
      <span className={cn('gsd-badge', config.className, className)}>
        {t(`movementType.${type}` as TranslationKey)}
      </span>
    );
  }

  if (variant === 'status' && status) {
    const config =
      MOVEMENT_STATUS_CONFIG[status] ?? MOVEMENT_STATUS_CONFIG.pending;
    return (
      <span className={cn('gsd-badge', config.className, className)}>
        {t(`movementStatus.${status}` as TranslationKey)}
      </span>
    );
  }

  return null;
}

