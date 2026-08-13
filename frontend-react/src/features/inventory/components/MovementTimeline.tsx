/* ============================================================
   GSDS v1.1 — MovementTimeline Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Vertical timeline of stock movements
   ============================================================
   Pure presentation component.
   - Displays a chronological list of movements.
   - No business logic.
   ============================================================ */

import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import type { MovementDTO } from '../domain/movementDTO';
import { ProductService } from '@/features/products/services/productService';

/* ─── Props ────────────────────────────────────────────────── */

interface MovementTimelineProps {
  /** Movements to display (newest first) */
  movements: MovementDTO[];
  /** Optional class name override */
  className?: string;
}

/* ─── Date Formatter ───────────────────────────────────────── */

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/* ─── MovementIcon ─────────────────────────────────────────── */

function MovementIcon({ type }: { type: MovementDTO['type'] }) {
  switch (type) {
    case 'stock_in':
    case 'purchase':
      return <ArrowDownLeft className="h-4 w-4 [color:var(--gs-success)]" aria-hidden="true" />;
    case 'stock_out':
    case 'sale':
      return <ArrowUpRight className="h-4 w-4 [color:var(--gs-danger)]" aria-hidden="true" />;
    case 'transfer':
      return <ArrowRightLeft className="h-4 w-4 [color:var(--gs-accent-blue)]" aria-hidden="true" />;
    case 'adjustment':
    default:
      return <RotateCcw className="h-4 w-4 [color:var(--gs-warning)]" aria-hidden="true" />;
  }
}

/* ─── MovementTimeline ─────────────────────────────────────── */

export function MovementTimeline({ movements, className }: MovementTimelineProps) {
  const { t } = useI18n();

  if (movements.length === 0) {
    return (
      <div className={cn('gsd-card p-6 text-center', className)}>
        <p className="text-sm [color:var(--gs-foreground-muted)]">
          {t('invTimeline.noMovements')}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('gsd-card p-4', className)}>
      <h3 className="mb-4 text-sm font-semibold [color:var(--gs-foreground)]">
        {t('invTimeline.title')}
      </h3>
      <ol className="relative space-y-4" role="list">
        {/* Vertical line */}
        <span
          className="absolute top-2 bottom-2 start-[13px] w-px [background:var(--gs-border-subtle)]"
          aria-hidden="true"
        />
        {movements.map((movement) => {
          const product = ProductService.getById(movement.productId);
          const productName = product?.name ?? movement.productId;
          return (
            <li key={movement.id} className="relative flex items-start gap-3 ps-0">
              {/* Icon dot */}
              <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full [background:var(--gs-muted)]">
                <MovementIcon type={movement.type} />
              </span>
              {/* Content */}
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="gsd-truncate text-sm font-medium [color:var(--gs-foreground)]">
                    {productName}
                  </p>
                  <span className="shrink-0 text-[10px] [color:var(--gs-foreground-muted)]">
                    {dateTimeFormatter.format(new Date(movement.performedAt))}
                  </span>
                </div>
                <p className="mt-0.5 text-xs [color:var(--gs-foreground-secondary)]">
                  {t(`movementType.${movement.type}` as TranslationKey)}
                  {' · '}
                  {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                  {movement.reason ? ` — ${movement.reason}` : ''}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

