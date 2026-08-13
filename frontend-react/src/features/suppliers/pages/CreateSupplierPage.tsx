/* ============================================================
   GSDS v1.1 — CreateSupplierPage
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Create supplier (placeholder)
   ============================================================
   Placeholder page for the create supplier workflow.
   Actual form implementation deferred to a future milestone.
   ============================================================ */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Plus } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';

export function CreateSupplierPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/suppliers')}
          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-9 w-9 p-0"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
            <Plus className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
            {t('suppliers.create.title')}
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
      </div>

      {/* Placeholder card */}
      <div className="gsd-card p-8 text-center">
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full [background:var(--gs-muted)]">
            <Building2 className="h-8 w-8 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">
            {t('suppliers.create.management')}
          </h2>
          <p className="text-sm [color:var(--gs-foreground-secondary)] max-w-md">
            {t('suppliers.create.description')}
          </p>
          <button
            type="button"
            onClick={() => navigate('/suppliers')}
            className="gsd-btn gsd-btn--primary gsd-btn--md mt-2"
          >
            {t('suppliers.backToList')}
          </button>
        </div>
      </div>
    </div>
  );
}
