/* ============================================================
   GSDS v1.2 — HomePage Component (Real Produce Marketplace)
   Green Store Enterprise v2 — Fresh Fruits & Vegetables Store
   ============================================================ */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Search,
  Sparkles,
  Check,
  RotateCcw,
  Leaf,
  PhoneCall,
  Award,
  Sun,
  ShieldCheck,
  Truck,
  Lightbulb,
} from 'lucide-react';
import { ProductService } from '@/features/products/services/productService';
import type { ProductDTO } from '@/features/products/domain/productDTO';
import { WhatsAppOrderAction } from '@/components/ui/WhatsAppOrderAction';
import { useI18n } from '@/i18n/useI18n';
import { useProductSearch } from '@/features/products/hooks/useProductService';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { useCart } from '@/features/marketplace/useCart';
import { StoreService } from '@/features/marketplace/services/storeService';
import {
  isFreshToday,
  isOrganic,
  isSeasonal,
  isYemeni,
} from '@/features/marketplace/utils/productTags';
import { getDailyTip } from '@/features/education/domain/dailyTips';

import { calculateEffectivePrice } from '@/features/products/services/offerService';
import { ProduceCard } from '@/features/marketplace/components/ProduceCard';

const FAVORITES_KEY = 'qutoof-nature.favorites';

const PRICE_FILTERS = [
  { id: 'all', label: 'كل الأسعار', min: 0, max: Number.POSITIVE_INFINITY },
  { id: 'under3', label: 'أقل من ٣ ر.ي', min: 0, max: 3 },
  { id: '3to5', label: '٣ - ٥ ر.ي', min: 3, max: 5 },
  { id: 'over5', label: 'أكثر من ٥ ر.ي', min: 5, max: 999 },
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

  // Do not paint the bundled demo catalog while the real public catalog is loading.
  // ProductService still provides its safe cache/mock fallback if the API is unavailable.
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [isPricesSyncing, setIsPricesSyncing] = useState(true);

  useEffect(() => {
    let isMounted = true;
    ProductService.syncAllFromBackend()
      .then((syncedProducts) => {
        if (!isMounted) return;
        setProducts(syncedProducts.filter((product) => product.status === 'active' && product.stock > 0));
      })
      .catch(() => {
        // ProductService keeps the safe local fallback when the API is unavailable.
      })
      .finally(() => {
        if (isMounted) setIsPricesSyncing(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
      if (selectedCategory) {
        const categorySlug = product.category.slug?.trim().toLowerCase();
        const categoryName = product.category.name.trim().toLowerCase();
        const matchesCategory = selectedCategory === 'fruits'
          ? categorySlug === 'fruits' || categoryName === 'fruits' || categoryName === 'فواكه'
          : selectedCategory === 'vegetables'
            ? categorySlug === 'vegetables' || categoryName === 'vegetables' || categoryName === 'خضروات'
            : categoryName === selectedCategory.toLowerCase();
        if (!matchesCategory) return false;
      }
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
  const { fruitsProducts, vegetablesProducts, otherProducts, yemeniProducts, todayOffers, seasonalProducts } = useMemo(() => {
    const fruits: ProductDTO[] = [];
    const vegetables: ProductDTO[] = [];
    const other: ProductDTO[] = [];
    const yemeni: ProductDTO[] = [];
    const offers: ProductDTO[] = [];
    const seasonal: ProductDTO[] = [];

    for (const product of products) {
      const categorySlug = product.category.slug?.trim().toLowerCase();
      const categoryName = product.category.name.trim().toLowerCase();

      const isFruit = categorySlug === 'fruits' || categoryName === 'fruits' || categoryName === 'فواكه';
      const isVegetable = categorySlug === 'vegetables' || categoryName === 'vegetables' || categoryName === 'خضروات';
      if (isFruit) fruits.push(product);
      if (isVegetable) vegetables.push(product);
      if (!isFruit && !isVegetable) other.push(product);
      if (isYemeni(product)) yemeni.push(product);
      const priceInfo = calculateEffectivePrice(product);
      if (priceInfo.hasActiveOffer) offers.push(product);
      if (isSeasonal(product)) seasonal.push(product);
    }

    return {
      fruitsProducts: fruits,
      vegetablesProducts: vegetables,
      otherProducts: other,
      yemeniProducts: yemeni.slice(0, 6),
      todayOffers: offers.slice(0, 4),
      seasonalProducts: seasonal.slice(0, 4),
    };
  }, [products]);

  const [toastMessage, setToastMessage] = useState<{ text: string; kind: 'success' | 'error' } | null>(null);
  const dailyTip = useMemo(() => getDailyTip(), []);

  const showToast = (text: string, kind: 'success' | 'error' = 'success') => {
    setToastMessage({ text, kind });
    setTimeout(() => setToastMessage(null), 3200);
  };

  /**
   * Single add path through the unified cart context:
   * - Success toast appears ONLY after the gateway confirmed the write.
   * - Failure shows a clear Arabic error (no fake success, no local fallback
   *   for signed-in users — that logic lives in cartClient).
   */
  const handleQuickAdd = async (product: ProductDTO) => {
    if (addingId) return;
    setAddingId(product.id);
    try {
      const result = await add(product, 1);
      if (result.ok) {
        setAddedIds((prev) => ({ ...prev, [product.id]: true }));
        showToast(`\u062a\u0645\u062a \u0625\u0636\u0627\u0641\u0629 "${product.name}" \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629 \u0628\u0646\u062c\u0627\u062d \u2713`);
        setTimeout(() => {
          setAddedIds((prev) => ({ ...prev, [product.id]: false }));
        }, 2200);
      } else {
        showToast(result.message || '\u062a\u0639\u0630\u0631\u062a \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u062a\u062c \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629.', 'error');
      }
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
    <div className="qutoof-storefront-page flex flex-col gap-6 sm:gap-8 pb-24 lg:pb-12 max-w-7xl mx-auto px-3 sm:px-4" dir="rtl">
      {isPricesSyncing && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-2 text-xs font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200" role="status">
          <RotateCcw className="h-3.5 w-3.5 animate-spin" />
          يتم تحديث الأسعار والمخزون من المتجر...
        </div>
      )}

      {/* 1. Hero / Store Welcome Banner */}
      <section className="qutoof-vegetable-hero gsd-card overflow-hidden rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white relative shadow-xl">
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
              <button
                type="button"
                onClick={() => document.getElementById('qutoof-shop-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="gsd-btn gsd-btn--primary gsd-btn--md inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-extrabold text-sm shadow-lg hover:shadow-emerald-500/25 transition"
              >
                ابدأ التسوق الآن
                <ArrowRight className="h-4 w-4" />
              </button>
              <WhatsAppOrderAction
                variant="modal"
                buttonText="مساعدة في الطلب عبر واتساب"
                className="w-auto min-w-[220px]"
                getMessage={() => 'أرغب في طلب خضروات وفواكه طازجة من قطوف الطبيعة.'}
              />
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

      {/* Category Navigation Bar - Mobile Horizontal Scrollable */}
      <section aria-label="أقسام المتجر الرئيسية" className="qutoof-category-bar py-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-1 scroll-smooth">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('fruits');
              document.getElementById('qutoof-fruits-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                selectedCategory === 'fruits'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-[var(--gs-surface)] text-[var(--gs-foreground)] border-[var(--gs-border-subtle)] hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <span className="text-base" aria-hidden="true">🍎</span>
            <span>الفواكه</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('vegetables');
              document.getElementById('qutoof-vegetables-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                selectedCategory === 'vegetables'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-[var(--gs-surface)] text-[var(--gs-foreground)] border-[var(--gs-border-subtle)] hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <span className="text-base" aria-hidden="true">🥦</span>
            <span>الخضروات</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPriceFilter('all');
              setSelectedCategory('');
              document.getElementById('qutoof-offers-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
          >
            <span className="text-base" aria-hidden="true">🔥</span>
            <span>العروض</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setYemeniOnly(true);
              document.getElementById('qutoof-yemeni-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              yemeniOnly
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                : 'bg-[var(--gs-surface)] text-[var(--gs-foreground)] border-[var(--gs-border-subtle)] hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <span className="text-base" aria-hidden="true">🇾🇪</span>
            <span>المنتجات اليمنية</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/education')}
            className="flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border bg-[var(--gs-surface)] text-[var(--gs-foreground)] border-[var(--gs-border-subtle)] hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
          >
            <BookOpen className="h-4 w-4 text-amber-600 shrink-0" />
            <span>مركز المعرفة</span>
          </button>
        </div>
      </section>

      {/* 2. Today's Offers Presentation Banner */}
      {todayOffers.length > 0 && !searchQuery && (
        <section id="qutoof-offers-section" className="scroll-mt-24 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--gs-border-subtle)] pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--gs-foreground)] flex items-center gap-2">
              🔥 عروض قطوف اليوم
            </h2>
            <button
              type="button"
              onClick={() => {
                setPriceFilter('all');
                setSelectedCategory('');
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              كل العروض
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            {todayOffers.map((product) => (
              <ProduceCard
                key={`offer-${product.id}`}
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
      )}

      {/* 3. Main Marketplace Browser / Search Results */}
      {searchQuery.trim() || selectedCategory || selectedStore || priceFilter !== 'all' || freshToday || organicOnly || seasonalOnly || yemeniOnly ? (
        <section id="qutoof-shop-section" className="scroll-mt-24 space-y-4 min-h-[40vh]">
          <div className="flex items-center justify-between border-b border-[var(--gs-border-subtle)] pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--gs-foreground)]">
              {searchQuery.trim() ? `نتائج البحث عن "${searchQuery}"` : 'تصفح المنتجات المختارة'}
            </h2>
            <span className="text-xs font-bold text-[var(--gs-foreground-muted)] bg-[var(--gs-surface-muted)] px-3 py-1 rounded-full">
              {filteredProducts.length} منتج
            </span>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white/50 rounded-3xl border border-dashed border-emerald-200">
              <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-emerald-200" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900">عذراً، لم نجد ما تبحث عنه</h3>
              <p className="mt-2 text-sm text-emerald-700/70 max-w-xs">
                جرب البحث بكلمات أخرى أو تصفح الأقسام الرئيسية للفواكه والخضروات.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setPriceFilter('all');
                  setFreshToday(false);
                  setOrganicOnly(false);
                  setSeasonalOnly(false);
                  setYemeniOnly(false);
                }}
                className="mt-6 gsd-btn gsd-btn--primary gsd-btn--md rounded-2xl"
              >
                مسح جميع الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
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
        <div id="qutoof-shop-section" className="scroll-mt-24 space-y-10">
          {/* Fruits Section */}
          <section id="qutoof-fruits-section" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--gs-border-subtle)] pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                🍎 الفواكه
              </h2>
              <button
                type="button"
                onClick={() => setSelectedCategory('fruits')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                عرض الكل ({fruitsProducts.length})
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {fruitsProducts.slice(0, 8).map((product) => (
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
          <section id="qutoof-vegetables-section" className="scroll-mt-24 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--gs-border-subtle)] pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                🥦 الخضروات
              </h2>
              <button
                type="button"
                onClick={() => setSelectedCategory('vegetables')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                عرض الكل ({vegetablesProducts.length})
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {vegetablesProducts.slice(0, 8).map((product) => (
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

          {otherProducts.length > 0 && (
            <section id="qutoof-other-section" className="scroll-mt-24 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--gs-border-subtle)] pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                  🛍️ منتجات أخرى
                </h2>
                <span className="text-xs font-bold text-[var(--gs-foreground-muted)]">{otherProducts.length} منتج</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
                {otherProducts.map((product) => (
                  <ProduceCard
                    key={`other-${product.id}`}
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
          )}

          {/* Yemeni Local Produce Section */}
          {yemeniProducts.length > 0 && (
            <section id="qutoof-yemeni-section" className="scroll-mt-24 space-y-4">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
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

      {/* Daily Tip / Educational Knowledge Banner - Positioned after products section */}
      <section aria-label="معلومة اليوم الإرشادية" className="rounded-3xl bg-emerald-900 p-5 text-white shadow-lg border border-emerald-700/50 relative overflow-hidden group my-4">
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-400/10 blur-3xl -translate-x-16 -translate-y-16 group-hover:bg-amber-400/20 transition-colors" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between relative z-10">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-emerald-950 shadow-inner">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-300">هل تعلم؟ · معلومة اليوم الإرشادية</p>
                <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
              </div>
              <h2 className="mt-1 text-lg font-black tracking-tight">{dailyTip.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-emerald-50/90 font-medium">
                {dailyTip.body}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Link to="/education" className="text-[10px] font-bold text-emerald-900 bg-amber-300 px-3.5 py-2 rounded-full hover:bg-amber-400 transition-colors">
              تصفح مركز المعرفة
            </Link>
            <a href={dailyTip.sourceUrl} target="_blank" rel="noreferrer" className="text-[9px] font-medium text-emerald-300/80 hover:text-emerald-200 transition-colors underline underline-offset-4">
              المصدر: {dailyTip.sourceLabel}
            </a>
          </div>
        </div>
      </section>

      {toastMessage && (
        <div
          role={toastMessage.kind === 'error' ? 'alert' : 'status'}
          aria-live={toastMessage.kind === 'error' ? 'assertive' : 'polite'}
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-2xl px-5 py-3 text-xs font-extrabold shadow-2xl flex items-center gap-2 border backdrop-blur-md transition-all ${
            toastMessage.kind === 'error'
              ? 'bg-rose-950/95 text-white border-rose-500/40'
              : 'bg-emerald-900/95 dark:bg-emerald-950/95 text-white border-emerald-500/40'
          }`}
        >
          <Check className={`h-4 w-4 shrink-0 ${toastMessage.kind === 'error' ? 'text-rose-300' : 'text-emerald-400'}`} />
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
