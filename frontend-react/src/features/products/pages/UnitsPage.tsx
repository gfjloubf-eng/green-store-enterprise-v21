/* ============================================================
   GSDS v1.1 — UnitsPage
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.1 — Placeholder page
   ============================================================ */

import { Scale } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';

export function UnitsPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
          <Scale className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
          {t('products.units')}
        </h1>
        <BreadcrumbEngine className="mt-1" />
      </div>

      {/* Placeholder card */}
      <div className="gsd-card p-8 text-center">
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full [background:var(--gs-muted)]">
            <Scale className="h-8 w-8 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">
            {t('products.units.management')}
          </h2>
          <p className="text-sm [color:var(--gs-foreground-secondary)] max-w-md">
            {t('products.units.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
