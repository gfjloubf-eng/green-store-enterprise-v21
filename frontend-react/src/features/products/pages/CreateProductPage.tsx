/* ============================================================
   GSDS v1.1 — CreateProductPage
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — Product form integration
   ============================================================ */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { ProductForm } from '../components/ProductForm';

export function CreateProductPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-9 w-9 p-0"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
            <PackagePlus className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
            {t('products.create')}
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
      </div>

      {/* Product Form */}
      <ProductForm />
    </div>
  );
}
