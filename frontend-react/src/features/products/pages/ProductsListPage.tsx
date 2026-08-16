/* ============================================================
   GSDS v1.1 — ProductsListPage
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.3 — Uses ProductService via useProductTableData hook
   ============================================================
   Composition layer only:
   - Assembles filters, table, dialogs and empty state.
   - All business logic delegated to ProductService.
   - No direct mock data manipulation.
   ============================================================ */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import { DEFAULT_PRODUCT_FILTERS } from '../constants';
import type { ProductSummary, ProductColumnId, ProductFilters } from '../types/product';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { ProductTable } from '../components/ProductTable';
import { ProductFilters as ProductFiltersBar } from '../components/ProductFilters';
import { EmptyState } from '../components/EmptyState';
import { CreateProductDialog } from '../components/dialogs/CreateProductDialog';
import { EditProductDialog } from '../components/dialogs/EditProductDialog';
import { DeleteConfirmDialog } from '../components/dialogs/DeleteConfirmDialog';
import { useProductTableData } from '../hooks/useProductService';

import { addItemToCart } from '@/services/cartClient';

/* ─── ProductsListPage ─────────────────────────────────────── */

export function ProductsListPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_PRODUCT_FILTERS);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cartSuccess, setCartSuccess] = useState<string | null>(null);

  /* ── Service Hook ──────────────────────────────────── */

  const { products, isLoading } = useProductTableData(filters);

  /* ── Filter handlers ────────────────────────────────── */

  const handleFilterChange = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_PRODUCT_FILTERS);
  }, []);

  const handleSort = useCallback((columnId: ProductColumnId) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: columnId,
      sortDirection:
        prev.sortBy === columnId && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  /* ── Action handlers ────────────────────────────────── */

  const handleAddToCart = useCallback(async (product: ProductSummary) => {
    try {
      await addItemToCart(product.id, 1, {
        name: product.name,
        sellingPrice: product.sellingPrice,
        image: product.image,
      });
      setCartSuccess(`تمت إضافة "${product.name}" إلى السلة بنجاح!`);
      setTimeout(() => setCartSuccess(null), 3000);
    } catch (e) {
      console.error('Failed to add to cart:', e);
    }
  }, []);

  const handleView = useCallback(
    (product: ProductSummary) => {
      navigate(`/products/${product.id}`);
    },
    [navigate],
  );

  const handleEdit = useCallback(() => {
    setEditOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    setDeleteOpen(true);
  }, []);

  const hasProducts = products.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
            <Package className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
            {t('products.title')}
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="gsd-btn gsd-btn--primary gsd-btn--md"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('products.add')}
        </button>
      </div>

      {cartSuccess && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700 font-semibold flex items-center justify-between">
          <span>{cartSuccess}</span>
          <button type="button" onClick={() => navigate('/cart')} className="underline font-bold">
            عرض السلة ➔
          </button>
        </div>
      )}

      {/* ── Filters ──────────────────────────────────── */}
      <ProductFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* ── Content Area ─────────────────────────────── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-2 text-sm [color:var(--gs-foreground-muted)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {t('common.loading')}
          </div>
        </div>
      ) : !hasProducts && !filters.search && !filters.categoryId && !filters.brandId && filters.status === 'all' ? (
        <EmptyState
          icon={Package}
          title={t('messages.noProducts.title')}
          description={t('messages.noProducts.description')}
          actionLabel={t('messages.noProducts.action')}
          onAction={() => setCreateOpen(true)}
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t('messages.noMatch.title')}
          description={t('messages.noMatch.description')}
          actionLabel={t('messages.noMatch.action')}
          onAction={handleClearFilters}
        />
      ) : (
        <ProductTable
          products={products}
          sortBy={filters.sortBy}
          sortDirection={filters.sortDirection}
          onSort={handleSort}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* ── Dialogs ──────────────────────────────────── */}
      <CreateProductDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditProductDialog open={editOpen} onClose={() => setEditOpen(false)} />
      <DeleteConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </div>
  );
}
