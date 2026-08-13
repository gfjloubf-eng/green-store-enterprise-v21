/* ============================================================
   GSDS v1.1 — EditProductPage
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.3 — Uses ProductService via useProductDetail hook
   ============================================================ */

import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { ProductForm } from '../components/ProductForm';
import { useProductDetail } from '../hooks/useProductService';
import { getData, isState } from '../state/productState';
import { entityToFormData } from '../domain/productFormModel';

export function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();

  const state = useProductDetail(id);
  const product = getData(state);
  const isLoading = isState(state, 'loading');

  const initialData = product ? entityToFormData(product) : undefined;

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
            <Pencil className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
            {t('products.edit')}
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-2 text-sm [color:var(--gs-foreground-muted)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {t('common.loading')}
          </div>
        </div>
      ) : (
        <ProductForm isEdit initialData={initialData} />
      )}
    </div>
  );
}
