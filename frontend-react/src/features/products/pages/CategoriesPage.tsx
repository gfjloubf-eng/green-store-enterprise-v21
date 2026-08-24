import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Tags } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { ProductService } from '../services/productService';

interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export function CategoriesPage() {
  const { t } = useI18n();
  const categories = useMemo<CategorySummary[]>(() => {
    const grouped = new Map<string, CategorySummary>();
    for (const product of ProductService.getAll()) {
      const category = product.category;
      const id = String(category?.id || category?.slug || 'general');
      const name = String(category?.name || 'عام');
      const slug = String(category?.slug || id || 'general');
      const current = grouped.get(id);
      if (current) current.count += 1;
      else grouped.set(id, { id, name, slug, count: 1 });
    }
    return Array.from(grouped.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ar'));
  }, []);

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      <div>
        <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
          <Tags className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
          {t('products.categories')}
        </h1>
        <BreadcrumbEngine className="mt-1" />
        <p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">
          تصفّح منتجات قطوف حسب نوعها، وافتح القسم المناسب للوصول إلى المنتجات المتاحة.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="gsd-card p-8 text-center">
          <Package className="mx-auto h-10 w-10 [color:var(--gs-foreground-muted)]" />
          <h2 className="mt-4 text-lg font-semibold [color:var(--gs-foreground)]">لا توجد تصنيفات بعد</h2>
          <p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">
            أضف منتجاً مع تصنيف من شاشة إدارة المنتجات، وسيظهر القسم هنا تلقائياً.
          </p>
          <Link to="/products" className="gsd-btn gsd-btn--primary mt-5 inline-flex items-center gap-2">
            فتح المنتجات
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.slug)}`}
              className="gsd-card group flex min-h-[150px] flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:border-[var(--gs-primary)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl [background:var(--gs-muted)] [color:var(--gs-primary)]">
                  <Tags className="h-6 w-6" aria-hidden="true" />
                </div>
                <ArrowLeft className="h-5 w-5 [color:var(--gs-foreground-muted)] transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-bold [color:var(--gs-foreground)]">{category.name}</h2>
                <p className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">
                  {category.count} {category.count === 1 ? 'منتج' : 'منتجات'} متاحة
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
