/* ============================================================
   GSDS v1.1 — StockTransfer
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Stock transfer form page
   ============================================================
   Presentational placeholder for the transfer workflow.
   Actual form implementation deferred to a future milestone.
   ============================================================ */

import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { ArrowRightLeft } from 'lucide-react';

export function StockTransfer() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
          <ArrowRightLeft className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
          {t('inventory.stockTransfer.title')}
        </h1>
        <BreadcrumbEngine className="mt-1" />
      </div>

      {/* Placeholder card */}
      <div className="gsd-card p-8 text-center">
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full [background:var(--gs-muted)]">
            <ArrowRightLeft className="h-8 w-8 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">
            {t('inventory.stockTransfer.management')}
          </h2>
          <p className="text-sm [color:var(--gs-foreground-secondary)] max-w-md">
            {t('inventory.stockTransfer.description')}
          </p>
        </div>
      </div>
    </div>
  );
}

