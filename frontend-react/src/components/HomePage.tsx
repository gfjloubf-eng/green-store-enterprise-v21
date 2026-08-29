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
import { addItemToCart } from '@/services/cartClient';
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

  const [products, setProducts] = useState<ProductDTO[]>(() =>
    ProductService.getAll().filter((product) => product.status === 'active' && product.stock > 0),
  );
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
      yemeniProducts: yemeni.slice(0, 6),
      todayOffers: offers.slice(0, 4),
      seasonalProducts: seasonal.slice(0, 4),
    };
  }, [products]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dailyTip = useMemo(() => getDailyTip(), []);

  const handleQuickAdd = async (product: ProductDTO) => {
    setAddingId(product.id);
    try {
      await addItemToCart(product.id, 1).catch(() => null);
      add(product, 1);
      setAddedIds((prev) => ({ ...prev, [product.id]: true }));
      setToastMessage(`تمت إضافة "${product.name}" إلى السلة بنجاح ✓`);
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [product.id]: false }));
        setToastMessage(null);
      }, 2500);
    } catch {
      add(product, 1);
      setAddedIds((prev) => ({ ...prev, [product.id]: true }));
      setToastMessage(`تمت إضافة "${product.name}" إلى السلة بنجاح ✓`);
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [product.id]: false }));
        setToastMessage(null);
      }, 2500);
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
              <WhatsAppOrderAction
                variant="modal"
                buttonText="طلب سريع عبر واتساب"
                className="w-auto min-w-[220px]"
                getMessage={() => 'أرغب في طلب خضروات وفواكه طازجة من قطوف الطبيعة.'}
              />
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

      {/* Daily Tip Widget - AI/Curated Educational Content */}
      <section className="rounded-3xl bg-emerald-900 p-5 text-white shadow-lg border border-emerald-700/50 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-400/10 blur-3xl -translate-x-16 -translate-y-16 group-hover:bg-amber-400/20 transition-colors" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between relative z-10">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-emerald-950 shadow-inner">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-300">هل تعلم؟ · معلومة اليوم</p>
                <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
              </div>
              <h2 className="mt-1 text-lg font-black tracking-tight">{dailyTip.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-emerald-50/90 font-medium">
                {dailyTip.body}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
             <Link to="/education" className="text-[10px] font-bold text-emerald-900 bg-amber-300 px-3 py-1.5 rounded-full hover:bg-amber-400 transition-colors">
              مركز المعرفة
            </Link>
            <a href={dailyTip.sourceUrl} target="_blank" rel="noreferrer" className="text-[9px] font-medium text-emerald-300/80 hover:text-emerald-200 transition-colors underline underline-offset-4">
              المصدر: {dailyTip.sourceLabel}
            </a>
          </div>
        </div>
      </section>

      {/* Mobile-first shortcuts for the storefront's main journeys */}
      <section aria-label="روابط قطوف السريعة" className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <button
          type="button"
          onClick={() => document.getElementById('qutoof-fruits-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="flex min-h-[72px] items-center gap-2 rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-3 py-2 text-right text-emerald-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100"
        >
          <span className="text-2xl" aria-hidden="true">🍎</span>
          <span><strong className="block text-xs">فواكه طازجة</strong><span className="text-[10px] opacity-75">تصفح الأصناف</span></span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/education')}
          className="flex min-h-[72px] items-center gap-2 rounded-2xl border border-amber-200/70 bg-amber-50/80 px-3 py-2 text-right text-amber-950 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100"
        >
          <BookOpen className="h-5 w-5 shrink-0 text-amber-600" />
          <span><strong className="block text-xs">الإرشادات</strong><span className="text-[10px] opacity-75">معرفة غذائية موثوقة</span></span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/consultation')}
          className="flex min-h-[72px] items-center gap-2 rounded-2xl border border-sky-200/70 bg-sky-50/80 px-3 py-2 text-right text-sky-950 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100"
        >
          <span className="text-2xl" aria-hidden="true">🌿</span>
          <span><strong className="block text-xs">استشارة طبيعية</strong><span className="text-[10px] opacity-75">معلومات عامة لا تشخيص</span></span>
        </button>
        <a
          href="tel:+967712275038"
          className="flex min-h-[72px] items-center gap-2 rounded-2xl border border-rose-200/70 bg-rose-50/80 px-3 py-2 text-right text-rose-950 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-400 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-100"
        >
          <PhoneCall className="h-5 w-5 shrink-0 text-rose-600" />
          <span><strong className="block text-xs">اتصل بنا</strong><span className="text-[10px] opacity-75">712 275 038</span></span>
        </a>
      </section>

      {/* 2. Today's Offers Presentation Banner */}
      {todayOffers.length > 0 && !searchQuery && (
        <section className="space-y-4">
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
        <section className="space-y-4 min-h-[40vh]">
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
        <div className="space-y-10">
          {/* Fruits Section */}
          <section id="qutoof-fruits-section" className="scroll-mt-24 space-y-4">
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

      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-emerald-900/95 dark:bg-emerald-950/95 text-white px-5 py-3 text-xs font-extrabold shadow-2xl flex items-center gap-2 border border-emerald-500/40 backdrop-blur-md transition-all animate-bounce">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
