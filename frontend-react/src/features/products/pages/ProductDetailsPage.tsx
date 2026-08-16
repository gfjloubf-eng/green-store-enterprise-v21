/* ============================================================
   GSDS v1.3 — ProductDetailsPage (Real Store Content + Dual WhatsApp)
   Green Store Enterprise v2 — Real Produce Intelligence Phase
   ============================================================ */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Eye,
  Heart,
  Info,
  Leaf,
  ShoppingBag,
  Sparkles,
  Star,
  Store as StoreIcon,
  Calendar,
  MapPin,
  Utensils,
  Snowflake,
  AlertTriangle,
  Users,
  Tag,
} from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { placeholderImage } from '@/assets/images/products/productImages';
import {
  buildSingleProductWhatsAppMessage,
  type WhatsAppTarget,
} from '@/config/whatsapp';
import { addItemToCart } from '@/services/cartClient';
import { useCart } from '@/features/marketplace/useCart';
import { StoreService } from '@/features/marketplace/services/storeService';
import { ProductService } from '../services/productService';
import { useProductDetail } from '../hooks/useProductService';
import { getData, getErrorMessage, isState } from '../state/productState';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { getProductBadges, getProductRating } from '@/features/marketplace/utils/productTags';
import { getProduceIntelligence } from '../domain/produceIntelligence';
import { EducationalImageCard } from '@/components/ui/EducationalImageCard';
import { WhatsAppOrderAction } from '@/components/ui/WhatsAppOrderAction';

const FAVORITES_KEY = 'qutoof-nature.favorites';
const RECENTLY_VIEWED_KEY = 'qutoof-nature.recentlyViewed';

export function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const state = useProductDetail(id);
  const product = getData(state);
  const isLoading = isState(state, 'loading');
  const isError = isState(state, 'error');
  const errorMessage = getErrorMessage(state);

  const [quantity, setQuantity] = useState(1);
  const [customerRequest, setCustomerRequest] = useState('أرغب في طلب هذا المنتج من المتجر اليوم.');
  const [selectedImage, setSelectedImage] = useState(product?.image || placeholderImage);
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [favorites, setFavorites] = useLocalStorageState<string[]>(FAVORITES_KEY, []);
  const [, setRecentlyViewed] = useLocalStorageState<string[]>(RECENTLY_VIEWED_KEY, []);

  // Educational Produce Intelligence Data (Separated from Sellable Product)
  const produceIntel = useMemo(() => {
    return product ? getProduceIntelligence(product) : getProduceIntelligence('');
  }, [product]);

  const handleAddToCart = async () => {
    if (!product || adding) return;
    setAdding(true);
    try {
      await addItemToCart(product.id, quantity).catch(() => null);
      add(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch {
      add(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image || placeholderImage);
      setRecentlyViewed((current) => {
        const next = [product.id, ...current.filter((item) => item !== product.id)];
        return next.slice(0, 8);
      });
    }
  }, [product, setRecentlyViewed]);

  const isProductFavorited = product ? favorites.includes(product.id) : false;

  const toggleFavorite = () => {
    if (!product) return;
    setFavorites((current) =>
      current.includes(product.id) ? current.filter((item) => item !== product.id) : [product.id, ...current],
    );
  };

  const supplyingStore = useMemo(() => {
    if (!product) return undefined;
    return StoreService.getAll().find((store) => store.productIds.includes(product.id));
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return ProductService.getAll()
      .filter(
        (candidate) =>
          candidate.id !== product.id &&
          (candidate.category.id === product.category.id || candidate.brand.id === product.brand.id),
      )
      .slice(0, 4);
  }, [product]);

  const productBadges = product ? getProductBadges(product) : [];

  // Helper for generating custom WhatsApp message for Dual Ordering
  const getWhatsAppMessage = (_target: WhatsAppTarget) => {
    if (!product) return '';
    return buildSingleProductWhatsAppMessage(
      {
        name: product.name,
        sellingPrice: product.sellingPrice,
        unit: { name: product.unit.name, abbreviation: product.unit.abbreviation },
      },
      quantity,
      customerRequest
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-2 sm:px-4 pb-12" dir="rtl">
      {/* Header & Navigation */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-10 w-10 p-0 rounded-full border border-[var(--gs-border-subtle)]"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-2">
            <Eye className="h-6 w-6 text-emerald-600" aria-hidden="true" />
            {product ? product.name : t('products.details.title')}
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
      </div>

      <div className="gsd-card p-4 sm:p-8 rounded-3xl shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2 text-sm [color:var(--gs-foreground-muted)]">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              {t('common.loading')}
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/40">
              <Eye className="h-8 w-8 text-rose-600" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">{t('errors.notFound')}</h2>
            <p className="text-sm [color:var(--gs-foreground-secondary)] max-w-md">
              {errorMessage || t('products.details.notFoundDesc', { id: id || '' })}
            </p>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="gsd-btn gsd-btn--primary gsd-btn--md mt-2"
            >
              {t('products.backToList')}
            </button>
          </div>
        ) : product ? (
          <div className="space-y-10">
            {/* PHASE 2: SELLABLE STORE PRODUCT SECTION (Commercial Buy Box) */}
            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] items-start">
              {/* Product Store Photo */}
              <div className="space-y-4">
                <div className="gsd-surface rounded-3xl p-4 text-center border border-[var(--gs-border-subtle)] relative overflow-hidden">
                  <div className="absolute top-3 right-3 z-10 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <Tag className="h-3 w-3" />
                    منتج تجاري للبيع
                  </div>
                  <img
                    src={selectedImage}
                    alt={`صورة المنتج التجاري - ${product.name}`}
                    className="mx-auto h-72 sm:h-80 w-full max-w-sm rounded-2xl object-cover transition duration-300 ease-in-out hover:scale-105"
                  />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-2">
                  {productBadges.map((badge) => (
                    <span
                      key={badge.label}
                      className={`rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1 ${
                        badge.active
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40'
                          : 'bg-[var(--gs-muted)] text-[var(--gs-foreground-secondary)]'
                      }`}
                    >
                      <Sparkles className="h-3 w-3 text-emerald-600" />
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Commercial Purchase Controls */}
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold [color:var(--gs-foreground)] tracking-tight">
                      {product.name}
                    </h2>
                    <p className="text-sm [color:var(--gs-foreground-secondary)] mt-1 flex items-center gap-2">
                      <span>الفئة: <strong>{product.category.name}</strong></span>
                      <span>•</span>
                      <span>الماركة: <strong>{product.brand.name}</strong></span>
                    </p>
                    {supplyingStore && (
                      <div className="mt-2.5">
                        <button
                          type="button"
                          onClick={() => navigate(`/stores/${supplyingStore.id}`)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 px-3.5 py-1.5 text-xs font-semibold text-[var(--gs-foreground)] transition hover:border-emerald-500 shadow-sm"
                        >
                          <StoreIcon className="h-4 w-4 text-emerald-600" />
                          <span>المتجر المورّد: <strong className="font-bold text-emerald-700 dark:text-emerald-400">{supplyingStore.name}</strong></span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 px-3.5 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-300/40">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                    {getProductRating(product).toFixed(1)} / 5.0
                  </div>
                </div>

                {/* Price Display */}
                <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 p-4 text-right flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">السعر / الوحدة</div>
                    <div className="mt-0.5 text-3xl font-black text-emerald-700 dark:text-emerald-400">
                      {formatPrice(product.sellingPrice, locale)} <span className="text-sm font-normal text-emerald-800 dark:text-emerald-300">/ {product.unit.name}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      product.stock > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {product.stock > 0 ? `متوفر بالمخزون (${product.stock} ${product.unit.abbreviation})` : 'نفد المؤقت'}
                    </span>
                  </div>
                </div>

                {/* Interactive Order & Dual WhatsApp Box */}
                <div className="gsd-surface rounded-3xl p-5 text-right border border-[var(--gs-border-subtle)] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-[var(--gs-foreground)] flex items-center gap-1.5">
                      <ShoppingBag className="h-4 w-4 text-emerald-600" />
                      تجهيز الطلب والشراء
                    </div>
                    <button
                      type="button"
                      onClick={toggleFavorite}
                      className="gsd-btn gsd-btn--ghost gsd-btn--sm inline-flex items-center gap-1.5 text-xs font-medium"
                    >
                      <Heart className={`h-4 w-4 ${isProductFavorited ? 'fill-rose-500 text-rose-500' : 'text-[var(--gs-foreground-secondary)]'}`} />
                      {isProductFavorited ? 'في المفضلة' : 'حفظ في المفضلة'}
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-semibold text-[var(--gs-foreground-secondary)]">
                      <div className="mb-1.5">الكمية المطلوبة ({product.unit.abbreviation})</div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="h-10 w-10 rounded-xl border border-[var(--gs-border-subtle)] bg-[var(--gs-surface)] font-bold text-lg hover:bg-[var(--gs-muted)]"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={product.stock || 99}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                          className="w-full text-center rounded-xl border border-[var(--gs-border-subtle)] bg-transparent py-2 font-bold text-base outline-none [color:var(--gs-foreground)]"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="h-10 w-10 rounded-xl border border-[var(--gs-border-subtle)] bg-[var(--gs-surface)] font-bold text-lg hover:bg-[var(--gs-muted)]"
                        >
                          +
                        </button>
                      </div>
                    </label>

                    <label className="block text-xs font-semibold text-[var(--gs-foreground-secondary)]">
                      <div className="mb-1.5">ملاحظات الطلب (اختياري)</div>
                      <textarea
                        value={customerRequest}
                        onChange={(e) => setCustomerRequest(e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-[var(--gs-border-subtle)] bg-transparent px-3 py-1.5 text-xs outline-none [color:var(--gs-foreground)]"
                      />
                    </label>
                  </div>

                  {/* Primary Action: Add to Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={adding || !product || product.stock <= 0}
                    className={`w-full gsd-btn gsd-btn--primary gsd-btn--md inline-flex items-center justify-center gap-2 rounded-2xl h-12 font-bold text-sm shadow-md transition ${
                      added ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="h-5 w-5" />
                        تمت إضافة المنتج للسلة بنجاح ✓
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-5 w-5" />
                        إضافة إلى السلة (إجمالي: {formatPrice(product.sellingPrice * quantity, locale)})
                      </>
                    )}
                  </button>

                  {/* PHASE 3: WHATSAPP DUAL ORDERING ACTION */}
                  <div className="pt-2 border-t border-[var(--gs-border-subtle)] space-y-2">
                    <div className="text-[11px] font-bold text-[var(--gs-foreground-secondary)] flex items-center gap-1">
                      <span>📲 خيار طلب سريع عبر واتساب:</span>
                    </div>
                    <WhatsAppOrderAction
                      getMessage={getWhatsAppMessage}
                      variant="buttons"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PHASE 1: EDUCATIONAL INFORMATION SECTION (Separated from Sellable Product) */}
            <div className="space-y-6 pt-8 border-t-2 border-dashed border-[var(--gs-border)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-950/10 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/20">
                <h3 className="text-xl font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                  <Leaf className="h-6 w-6 text-emerald-600" />
                  🌿 تعرف على المنتج (معلومات تثقيفية وتغذوية)
                </h3>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  دليل المحتوى التثقيفي العام
                </span>
              </div>

              {/* Short Overview */}
              <div className="rounded-2xl bg-[var(--gs-muted)] p-4 text-sm text-[var(--gs-foreground-secondary)] leading-relaxed">
                <h4 className="text-xs font-bold text-[var(--gs-foreground)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-emerald-600" />
                  عن هذا المحصول
                </h4>
                {produceIntel.shortDescription}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* 🌿 الفوائد العامة */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 space-y-3">
                  <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    🌿 الفوائد العامة
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[var(--gs-foreground-secondary)]">
                    {produceIntel.generalBenefits.map((benefit, idx) => (
                      <li key={`benefit-${idx}`} className="flex items-start gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 🥗 العناصر الغذائية البارزة */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 space-y-3">
                  <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-emerald-600" />
                    🥗 العناصر الغذائية البارزة
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {produceIntel.nutritionHighlights.map((highlight, idx) => (
                      <span
                        key={`nutrition-${idx}`}
                        className="rounded-xl bg-white dark:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200 shadow-xs"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 🍽️ الاستخدامات والتحضير */}
                <div className="rounded-2xl border border-[var(--gs-border-subtle)] bg-[var(--gs-surface)] p-5 space-y-3">
                  <h4 className="text-base font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-emerald-600" />
                    🍽️ الاستخدامات الشائعة والتحضير
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[var(--gs-foreground-secondary)]">
                    {produceIntel.commonUses.map((use, idx) => (
                      <li key={`use-${idx}`} className="flex items-start gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{use}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t border-[var(--gs-border-subtle)] text-xs text-[var(--gs-foreground-secondary)]">
                    <strong className="text-[var(--gs-foreground)]">طريقة التحضير والغسيل:</strong> {produceIntel.preparationGuidance}
                  </div>
                </div>

                {/* ❄️ الحفظ والتخزين */}
                <div className="rounded-2xl border border-[var(--gs-border-subtle)] bg-[var(--gs-surface)] p-5 space-y-3">
                  <h4 className="text-base font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-blue-600" />
                    ❄️ طريقة الحفظ والتخزين
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--gs-foreground-secondary)] leading-relaxed">
                    {produceIntel.storageGuidance}
                  </p>
                </div>
              </div>

              {/* 👨‍👩‍👧‍👦 لمن يناسب؟ */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10 p-5 space-y-4">
                <h4 className="text-base font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  👨‍👩‍👧‍👦 لمن يناسب هذا المنتج بشكل عام؟
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                  <div className="rounded-xl bg-white dark:bg-emerald-950/40 p-3 border border-emerald-500/10 space-y-1">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">👨‍👩‍👧‍👦 معظم الناس</div>
                    <p className="text-[var(--gs-foreground-secondary)]">{produceIntel.suitability.general}</p>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-emerald-950/40 p-3 border border-emerald-500/10 space-y-1">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">🥗 النظام المتوازن</div>
                    <p className="text-[var(--gs-foreground-secondary)]">{produceIntel.suitability.balancedDiet}</p>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-emerald-950/40 p-3 border border-emerald-500/10 space-y-1">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">👶 للأطفال</div>
                    <p className="text-[var(--gs-foreground-secondary)]">{produceIntel.suitability.children}</p>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-emerald-950/40 p-3 border border-emerald-500/10 space-y-1">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">🤰 للحوامل</div>
                    <p className="text-[var(--gs-foreground-secondary)]">{produceIntel.suitability.pregnant}</p>
                  </div>
                </div>
              </div>

              {/* ⚠️ التنبيهات الغذائية العامة */}
              {produceIntel.suitability.cautionNotes && produceIntel.suitability.cautionNotes.length > 0 && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    ⚠️ تنبيهات غذائية وملاحظات عامة
                  </h4>
                  <ul className="space-y-1 text-xs text-amber-900/90 dark:text-amber-300">
                    {produceIntel.suitability.cautionNotes.map((note, idx) => (
                      <li key={`note-${idx}`} className="flex items-start gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 🌱 الموسم والمنشأ */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[var(--gs-surface)] border border-[var(--gs-border-subtle)] p-4 flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[var(--gs-foreground-secondary)]">الموسم الزراعي</div>
                    <div className="text-sm font-bold text-[var(--gs-foreground)] mt-0.5">{produceIntel.season}</div>
                  </div>
                </div>
                <div className="rounded-2xl bg-[var(--gs-surface)] border border-[var(--gs-border-subtle)] p-4 flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[var(--gs-foreground-secondary)]">المنشأ / المزرعة</div>
                    <div className="text-sm font-bold text-[var(--gs-foreground)] mt-0.5">{produceIntel.origin}</div>
                  </div>
                </div>
              </div>

              {/* Educational Illustrative Visual Card (Distinct from Sellable Product Photo) */}
              {produceIntel.educationalImage && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-[var(--gs-foreground-secondary)] flex items-center gap-1.5">
                    <Leaf className="h-4 w-4 text-emerald-600" />
                    صورة توضيحية للمحصول في بيئته الزراعية (محتوى تثقيفي)
                  </div>
                  <EducationalImageCard
                    src={produceIntel.educationalImage}
                    alt={produceIntel.educationalImageAltAr || product.name}
                    caption={`${product.name} — ${produceIntel.origin}`}
                    aspectRatio="video"
                    className="max-w-2xl mx-auto shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="pt-8 border-t border-[var(--gs-border-subtle)] space-y-4">
                <h3 className="text-lg font-bold text-[var(--gs-foreground)]">منتجات أخرى قد تعجبك</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {relatedProducts.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => navigate(`/products/${rel.id}`)}
                      className="cursor-pointer group gsd-surface rounded-2xl p-3 border border-[var(--gs-border-subtle)] transition hover:border-emerald-500 hover:shadow-md"
                    >
                      <img
                        src={rel.image || placeholderImage}
                        alt={rel.name}
                        className="h-28 w-full object-cover rounded-xl group-hover:scale-105 transition"
                      />
                      <div className="mt-2 text-xs font-bold text-[var(--gs-foreground)] truncate">{rel.name}</div>
                      <div className="text-xs font-black text-emerald-600 mt-1">{formatPrice(rel.sellingPrice, locale)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
