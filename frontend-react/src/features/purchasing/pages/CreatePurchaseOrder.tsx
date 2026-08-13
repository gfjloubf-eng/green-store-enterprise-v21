/* ============================================================
   GSDS v1.1 â€” CreatePurchaseOrder
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Create purchase order
   ============================================================
   Composition layer only:
   - Assembles the PurchaseOrderForm.
   - Uses usePurchasingService for the create mutation.
   - No business logic inside the component.
   ============================================================ */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import {
  PurchaseOrderForm,
  type PurchaseOrderFormValues,
} from '../components/PurchaseOrderForm';
import { usePurchasingService } from '../hooks/usePurchasingService';
import { isState } from '../state/purchasingState';

export function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { create, createState, resetCreateState } = usePurchasingService();

  const handleSave = (values: PurchaseOrderFormValues) => {
    const supplier = values.supplierId;
    void supplier;

    create({
      code: `PO-${Date.now().toString().slice(-5)}`,
      supplier: { id: values.supplierId, name: '' },
      status: 'draft',
      items: [],
      subtotal: 0,
      taxTotal: 0,
      discountTotal: 0,
      total: 0,
      expectedAt: values.expectedAt || undefined,
      orderedAt: new Date().toISOString(),
      notes: values.notes,
    })
      .then((dto) => {
        navigate(`/purchasing/${dto.id}`);
      })
      .catch(() => {
        /* Error state is surfaced via createState. */
      });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/purchasing')}
          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-9 w-9 p-0"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
            <Plus className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
            {t('purchasing.create.title')}
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
      </div>

      {/* Success / Error feedback */}
      {isState(createState, 'error') && (
        <div className="gsd-card p-4 [background:var(--gs-danger-soft)]">
          <p className="text-sm [color:var(--gs-danger)]">
            {t('purchasing.create.error')}
          </p>
          <button
            type="button"
            onClick={resetCreateState}
            className="gsd-btn gsd-btn--ghost gsd-btn--sm mt-2"
          >
            {t('common.retry')}
          </button>
        </div>
      )}

      {/* Form */}
      <PurchaseOrderForm
        onSave={handleSave}
        onCancel={() => navigate('/purchasing')}
      />
    </div>
  );
}
