/* ============================================================
   GSDS v1.1 — InventoryReports
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Inventory reports placeholder
   ============================================================
   Placeholder page for future inventory reporting.
   ============================================================ */

import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { BarChart3 } from 'lucide-react';

export function InventoryReports() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
          <BarChart3 className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
          {t('inventory.inventoryReports.title')}
        </h1>
        <BreadcrumbEngine className="mt-1" />
      </div>

      {/* Placeholder card */}
      <div className="gsd-card p-8 text-center">
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full [background:var(--gs-muted)]">
            <BarChart3 className="h-8 w-8 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">
            {t('inventory.inventoryReports.management')}
          </h2>
          <p className="text-sm [color:var(--gs-foreground-secondary)] max-w-md">
            {t('inventory.inventoryReports.description')}
          </p>
        </div>
      </div>
    </div>
  );
}

