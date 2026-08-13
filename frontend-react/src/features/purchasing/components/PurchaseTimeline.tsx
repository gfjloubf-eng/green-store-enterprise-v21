/* ============================================================
   GSDS v1.1 â€” PurchaseTimeline Component
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Purchase order lifecycle timeline
   ============================================================
   Pure presentation component.
   - Displays the lifecycle status progression of a purchase order.
   - No business logic.
   ============================================================ */

import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import type { PurchaseStatus } from '../types/purchasing';

/* â”€â”€â”€ Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

interface PurchaseTimelineProps {
  /** Current purchase order status */
  status: PurchaseStatus;
  /** Optional class name override */
  className?: string;
}

/* â”€â”€â”€ Status Order â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const STATUS_ORDER: PurchaseStatus[] = [
  'draft',
  'pending',
  'approved',
  'partially_received',
  'received',
];

/* â”€â”€â”€ PurchaseTimeline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function PurchaseTimeline({
  status,
  className,
}: PurchaseTimelineProps) {
  const { t } = useI18n();
  const isCancelled = status === 'cancelled';

  const currentIndex =
    isCancelled
      ? STATUS_ORDER.length - 1
      : STATUS_ORDER.indexOf(status);

  return (
    <div
      className={cn('flex w-full items-center', className)}
      role="list"
      aria-label={t('purchaseTimeline.label')}
    >
      {STATUS_ORDER.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            {/* Node */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold',
                  isCurrent && !isCancelled
                    ? 'border-[var(--gs-primary)] bg-[var(--gs-primary)] text-white'
                    : isCompleted
                      ? 'border-[var(--gs-success)] bg-[var(--gs-success-soft)] [color:var(--gs-success)]'
                      : 'border-[var(--gs-border)] [color:var(--gs-foreground-muted)]',
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  'mt-1.5 text-[10px]',
                  isCompleted
                    ? '[color:var(--gs-foreground)]'
                    : '[color:var(--gs-foreground-muted)]',
                )}
              >
                {t(`purchaseStatus.${step}` as TranslationKey)}
              </span>
            </div>

            {/* Connector */}
            {index < STATUS_ORDER.length - 1 && (
              <div
                className={cn(
                  'mx-1 h-0.5 flex-1 rounded',
                  index < currentIndex
                    ? '[background:var(--gs-success)]'
                    : '[background:var(--gs-border)]',
                )}
              />
            )}
          </div>
        );
      })}

      {/* Cancelled indicator */}
      {isCancelled && (
        <span className="ms-3 text-[10px] font-semibold [color:var(--gs-danger)]">
          {t('purchaseTimeline.cancelled')}
        </span>
      )}
    </div>
  );
}
