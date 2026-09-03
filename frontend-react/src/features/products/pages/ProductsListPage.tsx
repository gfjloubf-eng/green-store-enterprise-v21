/* ============================================================
   GSDS v1.1 — ProductsListPage (customer catalog + management)
   Green Store Design System — Enterprise UI Foundation
   ============================================================
   Composition-only page with two surfaces sharing one route:

   1) CUSTOMER (public / guests / shoppers):
      - card catalog grid of REAL backend products
      - shows: image, name, category, selling price (YER), unit
      - NEVER shows purchasePrice/barcode/SKU/internal dates/status
      - details + add-to-cart buttons; unpriced/out-of-stock items are
        displayed as unavailable with a disabled add button
      - loading / error / empty states, mobile friendly

   2) MANAGEMENT (users with product permissions):
      - the full management table + filters + add/edit entry points
      - no customer cart columns inside the management table

   All business logic stays delegated to ProductService/cartClient.
   ============================================================ */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, Tag, Search, AlertCircle, Loader2, Check } from 'lucide-react';
import { DEFAULT_PRODUCT_FILTERS } from '../constants';
import type { ProductSummary, ProductColumnId, ProductFilters } from '../types/product';
import { useI18n } from '@/i18n/useI18n';
import { useAuth } from '@/hooks/useAuth';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { ProductTable } from '../components/ProductTable';
import { ProductFilters as ProductFiltersBar } from '../components/ProductFilters';
import { EmptyState } from '../components/EmptyState';
import { useProductTableData } from '../hooks/useProductService';
import { ProductService } from '../services/productService';
import type { ProductDTO } from '../domain/productDTO';
import { ProduceCard } from '@/features/marketplace/components/ProduceCard';
import { useCart } from '@/features/marketplace/useCart';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';

const CATALOG_FAVORITES_KEY = 'qutoof-nature.favorites';

/* ─── Customer card catalog (real products only) ──────────── */

function CustomerCatalog() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const { add } = useCart();

  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useLocalStorageState<string[]>(CATALOG_FAVORITES_KEY, []);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState<{ text: string; kind: 'success' | 'error' } | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoadError(null);
    setIsLoading(true);
    ProductService.syncAllFromBackend()
      .then((synced) => {
        if (!isMounted) return;
        // Real catalog only: customers never see demo products.
        const real = synced.filter(
          (product) => product.status === 'active' && product.stock > 0 && product.id.length > 0,
        );
        setProducts(real);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadError('تعذر تحميل المنتجات من المتجر. تحقق من اتصالك وحاول مجدداً.');
        setProducts([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        (product.category?.name || '').toLowerCase().includes(q),
    );
  }, [products, query]);

  const toggleFavorite = useCallback(
    (productId: string) => {
      setFavorites((current) =>
        current.includes(productId)
          ? current.filter((item) => item !== productId)
          : [productId, ...current],
      );
    },
    [setFavorites],
  );

  const handleQuickAdd = useCallback(
    async (product: ProductDTO) => {
      if (addingId) return;
      setAddingId(product.id);
      try {
        const result = await add(product, 1);
        if (result.ok) {
          setAddedIds((prev) => ({ ...prev, [product.id]: true }));
          setNotice({ text: `تمت إضافة "${product.name}" إلى السلة بنجاح ✓`, kind: 'success' });
          setTimeout(() => {
            setAddedIds((prev) => ({ ...prev, [product.id]: false }));
            setNotice(null);
          }, 2600);
        } else {
          setNotice({
            text: result.message || 'تعذرت إضافة المنتج إلى السلة.',
            kind: 'error',
          });
          setTimeout(() => setNotice(null), 4200);
        }
      } finally {
        setAddingId(null);
      }
    },
    [add, addingId],
  );

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-2">
            <Package className="h-6 w-6 text-emerald-600" aria-hidden="true" />
            منتجاتنا الطازجة
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
        <div className="relative sm:w-72">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gs-foreground-muted)]" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] py-2.5 pl-3 pr-9 text-xs text-[var(--gs-foreground)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 outline-none"
            aria-label="ابحث في المنتجات"
          />
        </div>
      </div>

      {notice && (
        <div
          role={notice.kind === 'error' ? 'alert' : 'status'}
          aria-live={notice.kind === 'error' ? 'assertive' : 'polite'}
          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold ${
            notice.kind === 'error'
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
          }`}
        >
          <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
          {notice.text}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-sm font-semibold text-[var(--gs-foreground-muted)]">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          جارٍ تحميل المنتجات...
        </div>
      ) : loadError ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-3xl border border-rose-500/20 bg-rose-500/5 px-6 py-14 text-center"
        >
          <AlertCircle className="h-10 w-10 text-rose-400" aria-hidden="true" />
          <p className="max-w-sm text-xs font-bold text-[var(--gs-foreground)]">{loadError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="gsd-btn gsd-btn--secondary gsd-btn--sm rounded-xl text-xs"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="gsd-card flex flex-col items-center gap-3 rounded-3xl px-6 py-16 text-center">
          <Search className="h-10 w-10 text-[var(--gs-foreground-muted)]" aria-hidden="true" />
          <h2 className="text-sm font-bold text-[var(--gs-foreground)]">
            {query.trim() ? 'لا توجد نتائج مطابقة لبحثك' : 'لا توجد منتجات متاحة حالياً'}
          </h2>
          <p className="max-w-xs text-xs text-[var(--gs-foreground-secondary)]">
            {query.trim()
              ? 'جرّب كلمات أخرى أو تصفح جميع المنتجات.'
              : 'سيتوفر الكتالوج قريباً — تابعنا!'}
          </p>
          {query.trim() && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="gsd-btn gsd-btn--primary gsd-btn--sm rounded-xl text-xs"
            >
              عرض جميع المنتجات
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-[11px] font-bold text-[var(--gs-foreground-secondary)]">
            {visibleProducts.length} منتج متاح
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {visibleProducts.map((product) => (
              <ProduceCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                isAdding={addingId === product.id}
                isAdded={addedIds[product.id]}
                onQuickAdd={() => void handleQuickAdd(product)}
                onToggleFavorite={() => toggleFavorite(product.id)}
                locale={locale}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mx-auto mt-2 gsd-btn gsd-btn--ghost gsd-btn--md rounded-2xl text-xs font-bold"
          >
            تصفح أقسام المتجر في الرئيسية
          </button>
        </>
      )}
    </div>
  );
}

/* ─── Management surface (table + tools) ──────────────────── */

function ManagementCatalog() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { hasPermission } = useAuth();
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_PRODUCT_FILTERS);

  const canCreate = hasPermission('products:create');

  const { products, isLoading } = useProductTableData(filters);

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

  const handleView = useCallback(
    (product: ProductSummary) => {
      navigate(`/products/${product.id}`);
    },
    [navigate],
  );

  const handleEdit = useCallback((product: ProductSummary) => {
    navigate(`/products/${encodeURIComponent(product.id)}/edit`);
  }, [navigate]);

  const hasProducts = products.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-2">
            <Package className="h-6 w-6 text-emerald-600" aria-hidden="true" />
            {t('products.title')}
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>

        {canCreate && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/products/offers')}
              className="gsd-btn gsd-btn--secondary gsd-btn--md"
            >
              <Tag className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              إدارة العروض
            </button>
            <button
              type="button"
              onClick={() => navigate('/products/create')}
              className="gsd-btn gsd-btn--primary gsd-btn--md"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t('products.add')}
            </button>
          </div>
        )}
      </div>

      <ProductFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

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
          actionLabel={canCreate ? t('messages.noProducts.action') : undefined}
          onAction={canCreate ? () => navigate('/products/create') : undefined}
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
        />
      )}
    </div>
  );
}

/* ─── Page entry — route /products ────────────────────────── */

export function ProductsListPage() {
  const { user, hasRole, hasPermission, isLoading: authLoading } = useAuth();

  // Management tools are only available to authorized staff; everyone else
  // (guests and customers) receives the clean card catalog.
  const canManage =
    user?.role === 'admin' ||
    user?.role === 'ADMIN' ||
    user?.role === 'MANAGER' ||
    hasRole('admin') ||
    hasPermission('products:read') ||
    hasPermission('products:update');

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--gs-foreground-muted)]">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          جارٍ التحميل...
        </div>
      </div>
    );
  }

  return canManage ? <ManagementCatalog /> : <CustomerCatalog />;
}

export default ProductsListPage;
