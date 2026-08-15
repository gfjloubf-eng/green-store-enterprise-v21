/* ============================================================
   GSDS v1.0 — HomePage Component
   Arabic customer marketplace experience.
   ============================================================ */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  MessageCircle,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Star,
  X,
  Plus,
  Check,
  RotateCcw,
} from 'lucide-react';
import { ProductService } from '@/features/products/services/productService';
import type { ProductDTO } from '@/features/products/domain/productDTO';
import { placeholderImage } from '@/assets/images/products/productImages';
import { buildWhatsAppUrl } from '@/config/whatsapp';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';
import { useProductSearch } from '@/features/products/hooks/useProductService';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { addItemToCart } from '@/services/cartClient';
import { useCart } from '@/features/marketplace/useCart';
import {
  getProductRating,
  getProductBadges,
  isFreshToday,
  isOrganic,
  isSeasonal,
  isYemeni,
} from '@/features/marketplace/utils/productTags';

const FAVORITES_KEY = 'qutoof-nature.favorites';
const RECENTLY_VIEWED_KEY = 'qutoof-nature.recentlyViewed';

const PRICE_FILTERS = [
  { id: 'all', label: 'كل الأسعار', min: 0, max: Number.POSITIVE_INFINITY },
  { id: 'under3', label: 'أقل من ٣ ر.س', min: 0, max: 3 },
  { id: '3to5', label: '٣ - ٥ ر.س', min: 3, max: 5 },
  { id: 'over5', label: 'أكثر من ٥ ر.س', min: 5, max: 999 },
] as const;

type PriceFilter = (typeof PRICE_FILTERS)[number]['id'];

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [freshToday, setFreshToday] = useState(false);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [seasonalOnly, setSeasonalOnly] = useState(false);
  const [favorites, setFavorites] = useLocalStorageState<string[]>(FAVORITES_KEY, []);
  const [recentlyViewed] = useLocalStorageState<string[]>(RECENTLY_VIEWED_KEY, []);

  const products = useMemo(
    () => ProductService.getAll().filter((product) => product.status === 'active' && product.stock > 0),
    [],
  );

  const categories = useMemo(
    () =>
      Array.from(new Map(products.map((product) => [product.category.id, product.category.name])).entries()).map(
        ([, name]) => name,
      ),
    [products],
  );

  const productSearch = useProductSearch(searchQuery);
  const searchResults = useMemo(
    () => productSearch.results.filter((product) => product.status === 'active'),
    [productSearch.results],
  );

  const filteredProducts = useMemo(() => {
    const base = searchQuery.trim() ? searchResults : products;
    const priceEntry = PRICE_FILTERS.find((entry) => entry.id === priceFilter);
    const hasPriceLimit = priceEntry && priceEntry.id !== 'all';

    return base.filter((product) => {
      if (selectedCategory && product.category.name !== selectedCategory) return false;
      if (hasPriceLimit && (product.sellingPrice < priceEntry.min || product.sellingPrice > priceEntry.max)) return false;
      if (freshToday && !isFreshToday(product)) return false;
      if (organicOnly && !isOrganic(product)) return false;
      if (seasonalOnly && !isSeasonal(product)) return false;
      return true;
    });
  }, [searchQuery, searchResults, products, selectedCategory, priceFilter, freshToday, organicOnly, seasonalOnly]);

  const {
    featuredProducts,
    todayOffers,
    seasonalProducts,
    healthyChoices,
    bestSellers,
    newArrivals,
    yemeniProducts,
    topRatedProducts,
  } = useMemo(() => {
    const featured: ProductDTO[] = products.slice(0, 4);
    const offers: ProductDTO[] = [];
    const seasonal: ProductDTO[] = [];
    const healthy: ProductDTO[] = [];
    const yemeni: ProductDTO[] = [];

    for (const product of products) {
      if (offers.length < 4 && product.sellingPrice <= 3) offers.push(product);
      if (seasonal.length < 4 && isSeasonal(product)) seasonal.push(product);
      if (healthy.length < 4 && (isOrganic(product) || ['Vegetables', 'Herbs'].includes(product.category.name))) healthy.push(product);
      if (yemeni.length < 4 && isYemeni(product)) yemeni.push(product);
    }

    const sortedByStock = [...products].sort((a, b) => b.stock - a.stock).slice(0, 4);
    const sortedByDate = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
    const sortedByRating = [...products].sort((a, b) => getProductRating(b) - getProductRating(a)).slice(0, 4);

    return {
      featuredProducts: featured,
      todayOffers: offers,
      seasonalProducts: seasonal,
      healthyChoices: healthy,
      bestSellers: sortedByStock,
      newArrivals: sortedByDate,
      yemeniProducts: yemeni,
      topRatedProducts: sortedByRating,
    };
  }, [products]);

  const favoriteProducts = useMemo(
    () => products.filter((product) => favorites.includes(product.id)),
    [favorites, products],
  );

  const recentlyViewedProducts = useMemo(
    () =>
      recentlyViewed
        .map((id) => ProductService.getById(id))
        .filter((product): product is ProductDTO => Boolean(product)),
    [recentlyViewed],
  );

  const toggleFavorite = (productId: string) => {
    setFavorites((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [productId, ...current],
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-8" dir="rtl">
      <section className="gsd-card overflow-hidden rounded-3xl p-4 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              قطوف الطبيعة
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-tight [color:var(--gs-foreground)] sm:text-4xl">
                خضار طازج، عناية يومية، وطلب سريع.
              </h1>
              <p className="max-w-2xl text-sm [color:var(--gs-foreground-secondary)] sm:text-base">
                تجربة عميل عربية احترافية مبنية على الخدمة الحالية والمنتجات الحالية.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-start">
              <a
                href={buildWhatsAppUrl('مرحبًا، أرغب في طلب منتجات من قطوف الطبيعة.')}
                target="_blank"
                rel="noreferrer"
                className="gsd-btn gsd-btn--primary gsd-btn--md inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                اطلب عبر واتساب
              </a>
              <button
                type="button"
                onClick={() => navigate('/stores')}
                className="gsd-btn gsd-btn--ghost gsd-btn--md inline-flex items-center justify-center gap-2"
              >
                تصفح المتاجر
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="gsd-surface rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-semibold [color:var(--gs-foreground)]">
                <Store className="h-4 w-4 [color:var(--gs-primary)]" />
                الفئات
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.slice(0, 6).map((category) => (
                  <span key={category} className="rounded-full bg-[var(--gs-muted)] px-3 py-1 text-xs [color:var(--gs-foreground-secondary)]">
                    {category}
                  </span>
                ))}
              </div>
            </div>
            <div className="gsd-surface rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-semibold [color:var(--gs-foreground)]">
                <ShoppingBag className="h-4 w-4 [color:var(--gs-primary)]" />
                اختيارات سريعة
              </div>
              <div className="mt-3 space-y-2 text-sm [color:var(--gs-foreground-secondary)]">
                <div>خضروات عضوية وأعشاب طازجة</div>
                <div>منتجات ألبان ومشروبات يومية</div>
                <div>طلب مريح عبر الهاتف المحمول</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gsd-card rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">البحث في المنتجات</h2>
            <p className="text-sm [color:var(--gs-foreground-secondary)]">ابحث في الكتالوج الحالي مباشرة.</p>
          </div>
          <label className="relative block w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 [color:var(--gs-foreground-muted)]" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ابحث عن منتج"
              className="w-full rounded-xl border border-[var(--gs-border-subtle)] bg-transparent py-2 pl-9 pr-8 text-sm outline-none [color:var(--gs-foreground)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--gs-foreground-muted)] hover:text-[var(--gs-foreground)]"
                aria-label="مسح البحث"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="gsd-input h-10 rounded-xl text-sm"
          >
            <option value="">كل الفئات</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={priceFilter}
            onChange={(event) => setPriceFilter(event.target.value as PriceFilter)}
            className="gsd-input h-10 rounded-xl text-sm"
          >
            {PRICE_FILTERS.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setFreshToday((value) => !value)}
            className={`gsd-btn gsd-btn--ghost gsd-btn--sm ${freshToday ? 'border-[var(--gs-primary)] text-[var(--gs-primary)] bg-[var(--gs-primary-soft)] font-bold' : ''}`}
          >
            طازج اليوم
          </button>

          <button
            type="button"
            onClick={() => setOrganicOnly((value) => !value)}
            className={`gsd-btn gsd-btn--ghost gsd-btn--sm ${organicOnly ? 'border-[var(--gs-primary)] text-[var(--gs-primary)] bg-[var(--gs-primary-soft)] font-bold' : ''}`}
          >
            عضوي
          </button>

          <button
            type="button"
            onClick={() => setSeasonalOnly((value) => !value)}
            className={`gsd-btn gsd-btn--ghost gsd-btn--sm ${seasonalOnly ? 'border-[var(--gs-primary)] text-[var(--gs-primary)] bg-[var(--gs-primary-soft)] font-bold' : ''}`}
          >
            موسمي
          </button>

          {(selectedCategory || priceFilter !== 'all' || freshToday || organicOnly || seasonalOnly || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setPriceFilter('all');
                setFreshToday(false);
                setOrganicOnly(false);
                setSeasonalOnly(false);
              }}
              className="gsd-btn gsd-btn--ghost gsd-btn--sm text-rose-500 hover:text-rose-600 flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>

        {searchQuery.trim() || selectedCategory || priceFilter !== 'all' || freshToday || organicOnly || seasonalOnly ? (
          <div className="mt-4">
            {productSearch.isSearching ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="gsd-surface animate-pulse rounded-2xl p-4 h-64 border border-[var(--gs-border-subtle)]" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => navigate(`/products/${product.id}`)}
                    onFavoriteToggle={() => toggleFavorite(product.id)}
                    isFavorited={favorites.includes(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--gs-border)] p-8 text-center bg-[var(--gs-background)] my-4 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--gs-foreground)]">لم نجد منتجات تطابق بحثك حالياً</h3>
                  <p className="text-xs text-[var(--gs-foreground-secondary)] mt-1">تأكد من كتابة اسم المنتج بشكل صحيح أو اختر فئة أخرى.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setPriceFilter('all');
                    setFreshToday(false);
                    setOrganicOnly(false);
                    setSeasonalOnly(false);
                  }}
                  className="gsd-btn gsd-btn--primary gsd-btn--sm rounded-xl px-4 py-2 text-xs flex items-center gap-2 mt-2"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  عرض جميع المنتجات
                </button>
              </div>
            )}
          </div>
        ) : null}
      </section>

      {favoriteProducts.length > 0 ? (
        <SectionShell title="المفضلة" description="منتجات أضفتها للمفضلة لتعود إليها بسرعة.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/products/${product.id}`)}
                onFavoriteToggle={() => toggleFavorite(product.id)}
                isFavorited={true}
              />
            ))}
          </div>
        </SectionShell>
      ) : null}

      {recentlyViewedProducts.length > 0 ? (
        <SectionShell title="وصل حديثاً" description="المنتجات التي شاهدتها مؤخرًا لتكملة عملية التسوق.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyViewedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/products/${product.id}`)}
                onFavoriteToggle={() => toggleFavorite(product.id)}
                isFavorited={favorites.includes(product.id)}
              />
            ))}
          </div>
        </SectionShell>
      ) : null}

      <SectionShell title="الفئات" description="تصفح أقسام المنتجات الطازجة والمنتقاة بعناية.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className="gsd-surface rounded-2xl p-4 text-right transition hover:-translate-y-0.5"
            >
              <div className="text-sm font-semibold [color:var(--gs-foreground)]">{category}</div>
              <div className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">اختيارات مخصصة لصحة يومية.</div>
            </button>
          ))}
        </div>
      </SectionShell>

      <SectionShell title="منتجات مقترحة" description="اقتراحات حصرية تناسب احتياجاتك اليومية.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
              onFavoriteToggle={() => toggleFavorite(product.id)}
              isFavorited={favorites.includes(product.id)}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell title="الأكثر مبيعاً" description="أفضل الاختيارات الحالية من الكتالوج.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
              onFavoriteToggle={() => toggleFavorite(product.id)}
              isFavorited={favorites.includes(product.id)}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell title="وصل حديثاً" description="إصدارات جديدة من أجود المنتجات الطازجة.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
              onFavoriteToggle={() => toggleFavorite(product.id)}
              isFavorited={favorites.includes(product.id)}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell title="عروض اليوم" description="منتجات موسمية وأسعار مميزة مباشرة من السوق.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {todayOffers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
              onFavoriteToggle={() => toggleFavorite(product.id)}
              isFavorited={favorites.includes(product.id)}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell title="منتجات موسمية" description="منتجات متوافقة مع الموسم الحالي وجودة طازجة.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {seasonalProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
              onFavoriteToggle={() => toggleFavorite(product.id)}
              isFavorited={favorites.includes(product.id)}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell title="منتجات يمنية" description="منتجات محلية مميزة توفر تجربة مريحة وصحية.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {yemeniProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
              onFavoriteToggle={() => toggleFavorite(product.id)}
              isFavorited={favorites.includes(product.id)}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell title="منتجات صحية" description="خيارات خفيفة ومغذية لتعزيز نمط حياة صحي.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {healthyChoices.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
              onFavoriteToggle={() => toggleFavorite(product.id)}
              isFavorited={favorites.includes(product.id)}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell title="الأكثر تقييماً" description="أفضل المنتجات بحسب تقييم الجودة المتوقعة.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topRatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
              onFavoriteToggle={() => toggleFavorite(product.id)}
              isFavorited={favorites.includes(product.id)}
            />
          ))}
        </div>
      </SectionShell>
    </div>
  );
}

function SectionShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="gsd-card rounded-2xl p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-1 text-right">
        <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">{title}</h2>
        <p className="text-sm [color:var(--gs-foreground-secondary)]">{description}</p>
      </div>
      {children}
    </section>
  );
}


function ProductCard({
  product,
  onClick,
  onFavoriteToggle,
  isFavorited,
}: {
  product: ProductDTO;
  onClick: () => void;
  onFavoriteToggle: () => void;
  isFavorited: boolean;
}) {
  const { locale } = useI18n();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const badges = getProductBadges(product);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      await addItemToCart(product.id, 1).catch(() => null);
      add(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      add(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
      className="gsd-surface w-full rounded-2xl p-3 text-right transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--gs-primary)] flex flex-col justify-between"
    >
      <div>
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={product.image || placeholderImage}
            alt={product.name}
            className="h-40 w-full rounded-xl object-cover"
            loading="lazy"
          />
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onFavoriteToggle();
            }}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--gs-foreground)] shadow-sm transition hover:scale-105"
            aria-label={isFavorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'text-rose-500' : 'text-slate-400'}`} />
          </button>
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold [color:var(--gs-foreground)]">{product.name}</div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
              {product.stock > 0 ? 'متوفر' : 'مخزون منخفض'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs [color:var(--gs-foreground-secondary)]">
            <span>{product.category.name}</span>
            {product.unit?.abbreviation && <span>• {product.unit.abbreviation}</span>}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold [color:var(--gs-primary)]">{formatPrice(product.sellingPrice, locale)}</div>
            <div className="inline-flex items-center gap-1 text-xs [color:var(--gs-foreground-secondary)]">
              <Star className="h-3.5 w-3.5 [color:var(--gs-primary)]" />
              {getProductRating(product).toFixed(1)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.slice(0, 2).map((badge) => (
              <span
                key={badge.label}
                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                  badge.active ? 'bg-emerald-50 text-emerald-700' : 'bg-[var(--gs-muted)] text-[var(--gs-foreground-secondary)]'
                }`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[var(--gs-border-subtle)]">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding || product.stock <= 0}
          className={`w-full rounded-xl py-2 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            added
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-600/20'
          }`}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5" />
              تمت الإضافة ✓
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              إضافة للسلة
            </>
          )}
        </button>
      </div>
    </div>
  );
}
