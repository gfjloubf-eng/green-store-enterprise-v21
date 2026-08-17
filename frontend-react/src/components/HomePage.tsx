/* ============================================================
   GSDS v1.2 — HomePage Component (Real Produce Marketplace)
   Green Store Enterprise v2 — Fresh Fruits & Vegetables Store
   ============================================================ */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  MessageCircle,
  Search,
  Sparkles,
  Star,
  X,
  Plus,
  Check,
  RotateCcw,
  Filter,
  Leaf,
  Award,
  Sun,
  ShieldCheck,
  Truck,
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
import { StoreService } from '@/features/marketplace/services/storeService';
import {
  getProductRating,
  isFreshToday,
  isOrganic,
  isSeasonal,
  isYemeni,
} from '@/features/marketplace/utils/productTags';

import { calculateEffectivePrice } from '@/features/products/services/offerService';

const FAVORITES_KEY = 'qutoof-nature.favorites';

const PRICE_FILTERS = [
  { id: 'all', label: 'كل الأسعار', min: 0, max: Number.POSITIVE_INFINITY },
  { id: 'under3', label: 'أقل من ٣ ر.س', min: 0, max: 3 },
  { id: '3to5', label: '٣ - ٥ ر.س', min: 3, max: 5 },
  { id: 'over5', label: 'أكثر من ٥ ر.س', min: 5, max: 999 },
] as const;

type PriceFilter = (typeof PRICE_FILTERS)[number]['id'];

export function HomePage() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [freshToday, setFreshToday] = useState(false);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [seasonalOnly, setSeasonalOnly] = useState(false);
  const [yemeniOnly, setYemeniOnly] = useState(false);
  const [favorites, setFavorites] = useLocalStorageState<string[]>(FAVORITES_KEY, []);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const { add } = useCart();
  const allStores = useMemo(() => StoreService.getAll(), []);

  const storeByProductIdMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const store of allStores) {
      for (const pid of store.productIds) {
        map.set(pid, store.id);
      }
    }
    return map;
  }, [allStores]);

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
      if (selectedStore && storeByProductIdMap.get(product.id) !== selectedStore) return false;
      if (hasPriceLimit && (product.sellingPrice < priceEntry.min || product.sellingPrice > priceEntry.max)) return false;
      if (freshToday && !isFreshToday(product)) return false;
      if (organicOnly && !isOrganic(product)) return false;
      if (seasonalOnly && !isSeasonal(product)) return false;
      if (yemeniOnly && !isYemeni(product)) return false;
      return true;
    });
  }, [
    searchQuery,
    searchResults,
    products,
    selectedCategory,
    selectedStore,
    priceFilter,
    freshToday,
    organicOnly,
    seasonalOnly,
    yemeniOnly,
    storeByProductIdMap,
  ]);

  // Produce Section Groupings
  const { fruitsProducts, vegetablesProducts, yemeniProducts, todayOffers, seasonalProducts } = useMemo(() => {
    const fruits: ProductDTO[] = [];
    const vegetables: ProductDTO[] = [];
    const yemeni: ProductDTO[] = [];
    const offers: ProductDTO[] = [];
    const seasonal: ProductDTO[] = [];

    for (const product of products) {
      if (product.category.name === 'Fruits') fruits.push(product);
      if (product.category.name === 'Vegetables') vegetables.push(product);
      if (isYemeni(product)) yemeni.push(product);
      const priceInfo = calculateEffectivePrice(product);
      if (priceInfo.hasActiveOffer) offers.push(product);
      if (isSeasonal(product)) seasonal.push(product);
    }

    return {
      fruitsProducts: fruits,
      vegetablesProducts: vegetables,
      yemeniProducts: yemeni.slice(0, 8),
      todayOffers: offers.slice(0, 6),
      seasonalProducts: seasonal.slice(0, 6),
    };
  }, [products]);

  const handleQuickAdd = async (product: ProductDTO) => {
    setAddingId(product.id);
    try {
      await addItemToCart(product.id, 1).catch(() => null);
      add(product, 1);
      setAddedIds((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [product.id]: false }));
      }, 2000);
    } catch {
      add(product, 1);
      setAddedIds((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [product.id]: false }));
      }, 2000);
    } finally {
      setAddingId(null);
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [productId, ...current],
    );
  };

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto px-2 sm:px-4" dir="rtl">
      {/* 1. Hero / Store Welcome Banner */}
      <section className="gsd-card overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white relative shadow-xl">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400" />
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] items-center relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-800/80 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-200">
              <Leaf className="h-4 w-4 text-emerald-400" />
              سوق الخضروات والفواكه الطازجة — قطوف الطبيعة
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-emerald-50 sm:text-4xl lg:text-5xl">
              خضروات وفواكه طازجة يومياً من المزرعة إلى بيتك
            </h1>
            <p className="max-w-2xl text-sm text-emerald-100/90 sm:text-base leading-relaxed">
              استمتع بأجود المنتجات الزراعية اليمنية والإقليمية، المنتقاة بعناية لدعم صحتك وعائلتك بأفضل الأسعار وأسرع توصيل.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={buildWhatsAppUrl('مرحبًا، أرغب في طلب خضروات وفواكه طازجة من قطوف الطبيعة.')}
                target="_blank"
                rel="noreferrer"
                className="gsd-btn gsd-btn--primary gsd-btn--md inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl px-5 py-3 shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                طلب سريع عبر واتساب
              </a>
              <button
                type="button"
                onClick={() => navigate('/stores')}
                className="gsd-btn gsd-btn--ghost gsd-btn--md inline-flex items-center justify-center gap-2 border border-emerald-400/30 text-emerald-100 hover:bg-emerald-800/50 rounded-2xl px-5 py-3 font-semibold"
              >
                تصفح المحلات الموردة
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 space-y-1">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <div className="text-sm font-bold">نضارة مضمونة</div>
              <p className="text-xs text-emerald-200">قطاف يومي مباشر من المزارع المحلية</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 space-y-1">
              <Truck className="h-6 w-6 text-emerald-400" />
              <div className="text-sm font-bold">توصيل سريع</div>
              <p className="text-xs text-emerald-200">تغليف آمن ومحافظ على التبريد</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 space-y-1">
              <Award className="h-6 w-6 text-amber-400" />
              <div className="text-sm font-bold">منتجات بلدية</div>
              <p className="text-xs text-emerald-200">رمان صعدة وعنب الروضة ومانجو تهامة</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 space-y-1">
              <Sun className="h-6 w-6 text-amber-300" />
              <div className="text-sm font-bold">خيارات عضوية</div>
              <p className="text-xs text-emerald-200">بدون مخصبات اصطناعية أو مواد حافظة</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Today's Offers Presentation Banner */}
      {todayOffers.length > 0 && !searchQuery && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--gs-foreground)] flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500" />
              عروض اليوم المنتقاة
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300/40">
              أسعار خفيفة ونضارة مضمونة
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {todayOffers.map((product) => (
              <ProduceCard
                key={`offer-${product.id}`}
                product={product}
                isFavorite={favorites.includes(product.id)}
                isAdding={addingId === product.id}
                isAdded={addedIds[product.id]}
                onQuickAdd={() => handleQuickAdd(product)}
                onToggleFavorite={() => toggleFavorite(product.id)}
                badgeText="عرض اليوم"
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Search & Comprehensive Filter Controls */}
      <section className="gsd-card rounded-3xl p-4 sm:p-6 shadow-sm border border-[var(--gs-border-subtle)] space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--gs-foreground)]">تصفح كتالوج الخضروات والفواكه</h2>
            <p className="text-xs text-[var(--gs-foreground-secondary)] mt-0.5">ابحث عن الفواكه، الخضروات، والأعشاب الطازجة بسهولة.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:max-w-md">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gs-foreground-muted)]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن تفاح، طماطم، رمان، مانجو..."
                className="w-full rounded-2xl border border-[var(--gs-border-subtle)] bg-[var(--gs-surface)] py-2.5 pl-9 pr-9 text-sm outline-none text-[var(--gs-foreground)] focus:border-emerald-500 shadow-xs"
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
            </div>

            <button
              type="button"
              onClick={() => setShowMobileFilters((prev) => !prev)}
              className="sm:hidden gsd-btn gsd-btn--ghost gsd-btn--sm p-2.5 rounded-2xl border border-[var(--gs-border)] text-emerald-700 bg-emerald-50 font-bold shrink-0 flex items-center gap-1.5"
              aria-label="فلاتر البحث"
            >
              <Filter className="h-4 w-4" />
              <span className="text-xs">تصفية</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Selectors */}
        <div className={`space-y-3 ${showMobileFilters ? 'block' : 'hidden sm:block'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('');
                setYemeniOnly(false);
                setOrganicOnly(false);
                setSeasonalOnly(false);
                setFreshToday(false);
              }}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                !selectedCategory && !yemeniOnly && !organicOnly && !seasonalOnly && !freshToday
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--gs-muted)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-surface)]'
              }`}
            >
              الكل ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-[var(--gs-muted)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-surface)]'
                }`}
              >
                {cat === 'Fruits' ? '🍎 فواكه طازجة' : cat === 'Vegetables' ? '🥦 خضروات' : cat === 'Herbs' ? '🌿 أعشاب عطرية' : cat}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setYemeniOnly((v) => !v)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                yemeniOnly
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-[var(--gs-muted)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-surface)]'
              }`}
            >
              🇾🇪 بلدي يمني
            </button>

            <button
              type="button"
              onClick={() => setOrganicOnly((v) => !v)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                organicOnly
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-[var(--gs-muted)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-surface)]'
              }`}
            >
              🌱 عضوي
            </button>

            <button
              type="button"
              onClick={() => setSeasonalOnly((v) => !v)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                seasonalOnly
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-[var(--gs-muted)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-surface)]'
              }`}
            >
              ☀️ موسمي
            </button>

            {(selectedCategory || selectedStore || priceFilter !== 'all' || freshToday || organicOnly || seasonalOnly || yemeniOnly || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedStore('');
                  setPriceFilter('all');
                  setFreshToday(false);
                  setOrganicOnly(false);
                  setSeasonalOnly(false);
                  setYemeniOnly(false);
                }}
                className="rounded-full px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 inline-flex items-center gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                إعادة ضبط
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. Filtered Products Grid Result */}
      {searchQuery || selectedCategory || yemeniOnly || organicOnly || seasonalOnly || priceFilter !== 'all' ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--gs-foreground)]">نتائج التصفية والبحث ({filteredProducts.length})</h2>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="gsd-card rounded-3xl p-12 text-center space-y-3">
              <Leaf className="h-12 w-12 text-[var(--gs-foreground-muted)] mx-auto" />
              <div className="text-base font-bold text-[var(--gs-foreground)]">لا توجد منتجات مطابقة لخيارات التصفية الحالية</div>
              <p className="text-xs text-[var(--gs-foreground-secondary)]">جرب البحث بكلمة مختلفة أو اختر فئة أوسع.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProduceCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  isAdding={addingId === product.id}
                  isAdded={addedIds[product.id]}
                  onQuickAdd={() => handleQuickAdd(product)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Standard Categorized Produce Marketplace Sections */
        <div className="space-y-10">
          {/* Fruits Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--gs-border-subtle)] pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                🍎 الفواكه الطازجة
              </h2>
              <button
                type="button"
                onClick={() => setSelectedCategory('Fruits')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                عرض الكل ({fruitsProducts.length})
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {fruitsProducts.slice(0, 12).map((product) => (
                <ProduceCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  isAdding={addingId === product.id}
                  isAdded={addedIds[product.id]}
                  onQuickAdd={() => handleQuickAdd(product)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  locale={locale}
                />
              ))}
            </div>
          </section>

          {/* Vegetables Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--gs-border-subtle)] pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                🥦 الخضروات اليومية
              </h2>
              <button
                type="button"
                onClick={() => setSelectedCategory('Vegetables')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                عرض الكل ({vegetablesProducts.length})
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {vegetablesProducts.slice(0, 12).map((product) => (
                <ProduceCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  isAdding={addingId === product.id}
                  isAdded={addedIds[product.id]}
                  onQuickAdd={() => handleQuickAdd(product)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  locale={locale}
                />
              ))}
            </div>
          </section>

          {/* Yemeni Local Produce Section */}
          {yemeniProducts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--gs-border-subtle)] pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                  🇾🇪 المنتجات البلدية اليمنية
                </h2>
                <button
                  type="button"
                  onClick={() => setYemeniOnly(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  تصفح المنتجات المحلية
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {yemeniProducts.map((product) => (
                  <ProduceCard
                    key={`yemeni-${product.id}`}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    isAdding={addingId === product.id}
                    isAdded={addedIds[product.id]}
                    onQuickAdd={() => handleQuickAdd(product)}
                    onToggleFavorite={() => toggleFavorite(product.id)}
                    badgeText="محلي بلدي"
                    locale={locale}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Seasonal Produce Section */}
          {seasonalProducts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--gs-border-subtle)] pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                  ☀️ المحاصيل الموسمية
                </h2>
                <button
                  type="button"
                  onClick={() => setSeasonalOnly(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  تصفح محاصيل الموسم
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {seasonalProducts.map((product) => (
                  <ProduceCard
                    key={`seasonal-${product.id}`}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    isAdding={addingId === product.id}
                    isAdded={addedIds[product.id]}
                    onQuickAdd={() => handleQuickAdd(product)}
                    onToggleFavorite={() => toggleFavorite(product.id)}
                    badgeText="موسمي"
                    locale={locale}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

interface ProduceCardProps {
  product: ProductDTO;
  isFavorite: boolean;
  isAdding: boolean;
  isAdded?: boolean;
  onQuickAdd: () => void;
  onToggleFavorite: () => void;
  badgeText?: string;
  locale: string;
}

function ProduceCard({
  product,
  isFavorite,
  isAdding,
  isAdded,
  onQuickAdd,
  onToggleFavorite,
  badgeText,
  locale,
}: ProduceCardProps) {
  const navigate = useNavigate();
  const rating = getProductRating(product);
  const priceInfo = calculateEffectivePrice(product);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group gsd-card rounded-2xl p-3 border border-[var(--gs-border-subtle)] hover:border-emerald-500 transition duration-200 flex flex-col justify-between relative bg-[var(--gs-surface)] shadow-xs hover:shadow-md">
      {/* Top Badges & Favorite Heart */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            priceInfo.hasActiveOffer
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          }`}
        >
          {priceInfo.hasActiveOffer
            ? `${priceInfo.offerTitle || 'عرض'} (-${priceInfo.discountPercentage}%)`
            : badgeText || (isYemeni(product) ? 'محلي' : isOrganic(product) ? 'عضوي' : 'طازج')}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="p-1 rounded-full text-[var(--gs-foreground-muted)] hover:text-rose-500 transition"
          aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <div
        onClick={() => navigate(`/products/${product.id}`)}
        className="cursor-pointer overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900/40 mb-2 relative aspect-square"
      >
        <img
          src={product.image || placeholderImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-2 text-center text-[11px] font-bold text-white">
            🔴 نفد المخزون
          </div>
        )}
      </div>

      {/* Title & Category */}
      <div className="space-y-1 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
        <div className="text-xs font-extrabold text-[var(--gs-foreground)] line-clamp-2 min-h-[32px]">
          {product.name}
        </div>
        <div className="flex items-center justify-between text-[11px] text-[var(--gs-foreground-secondary)]">
          <span>{product.unit.name}</span>
          <span className="flex items-center gap-0.5 text-amber-600 font-bold">
            <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Price & 1-Click Add Button */}
      <div className="pt-2 mt-2 border-t border-[var(--gs-border-subtle)] flex items-center justify-between gap-1">
        <div>
          {priceInfo.hasActiveOffer && (
            <div className="text-[10px] text-gray-400 line-through">
              {formatPrice(priceInfo.originalPrice, locale)}
            </div>
          )}
          <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">
            {formatPrice(priceInfo.finalPrice, locale)}
          </div>
        </div>

        <button
          type="button"
          onClick={onQuickAdd}
          disabled={isAdding || isOutOfStock}
          className={`h-8 px-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-1 transition ${
            isOutOfStock
              ? 'bg-gray-400 text-white cursor-not-allowed opacity-60'
              : isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
          aria-label={`إضافة ${product.name} إلى السلة`}
        >
          {isOutOfStock ? (
            'نفد'
          ) : isAdded ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              أضف
            </>
          )}
        </button>
      </div>
    </div>
  );
}
