/* ============================================================
   GSDS v1.1 â€” PurchaseReturns
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Purchase returns workflow
   ============================================================
   Composition layer only:
   - Lists received/partially received orders eligible for returns.
   - All data accessed through usePurchasingService hooks.
   - No business logic inside the component.
   ============================================================ */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Undo2, PackageX } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { DEFAULT_PURCHASE_FILTERS } from '../constants';
import type { PurchaseFilters } from '../types/purchasing';
import { PurchaseTable } from '../components/PurchaseTable';
import { PurchaseEmptyState } from '../components/PurchaseEmptyState';
import { usePurchaseTableData } from '../hooks/usePurchasingService';

export function PurchaseReturns() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [filters] = useState<PurchaseFilters>({
    ...DEFAULT_PURCHASE_FILTERS,
    status: 'received',
  });

  const { orders, isLoading } = usePurchaseTableData(filters);

  const handleView = useCallback(
    (order: { id: string }) => {
      navigate(`/purchasing/${order.id}`);
    },
    [navigate],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Page Header */}
      <div>
        <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
          <Undo2 className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
          {t('purchasing.returns.title')}
        </h1>
        <BreadcrumbEngine className="mt-1" />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-2 text-sm [color:var(--gs-foreground-muted)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {t('common.loading')}
          </div>
        </div>
      ) : orders.length === 0 ? (
        <PurchaseEmptyState
          icon={PackageX}
          title={t('purchasing.returns.empty')}
          description={t('purchasing.returns.emptyDesc')}
        />
      ) : (
        <PurchaseTable
          orders={orders}
          sortBy={filters.sortBy}
          sortDirection={filters.sortDirection}
          onSort={() => {}}
          onView={handleView}
        />
      )}
    </div>
  );
}
