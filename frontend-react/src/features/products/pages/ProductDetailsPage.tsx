/* ============================================================
   GSDS v1.2 — ProductDetailsPage (Real Produce Intelligence)
   Green Store Enterprise v2 — Premium Catalog & Produce Intelligence
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
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Calendar,
  MapPin,
  Utensils,
  Snowflake,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { placeholderImage } from '@/assets/images/products/productImages';
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from '@/config/whatsapp';
import { addItemToCart } from '@/services/cartClient';
import { useCart } from '@/features/marketplace/useCart';
import { StoreService } from '@/features/marketplace/services/storeService';
import { ProductService } from '../services/productService';
import { useProductDetail } from '../hooks/useProductService';
import { getData, getErrorMessage, isState } from '../state/productState';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import {
  getProductBadges,
  getProductRating,
} from '@/features/marketplace/utils/productTags';
import { getProduceIntelligence } from '../domain/produceIntelligence';
import { EducationalImageCard } from '@/components/ui/EducationalImageCard';

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
  const [customerRequest, setCustomerRequest] = useState('أرغب في طلب هذا المنتج اليوم.');
  const [selectedImage, setSelectedImage] = useState(product?.image || placeholderImage);
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [favorites, setFavorites] = useLocalStorageState<string[]>(FAVORITES_KEY, []);
  const [, setRecentlyViewed] = useLocalStorageState<string[]>(RECENTLY_VIEWED_KEY, []);

  // Produce Intelligence Data
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

  const defaultStoreName =
    supplyingStore?.name ?? StoreService.getOpen().find((store) => store.status === 'open')?.name ?? 'قطوف الطبيعة';
  const whatsappMessage = `مرحبًا، أحتاج إلى ${product?.name ?? 'المنتج'} (${product?.sku ?? ''}) من ${defaultStoreName}، الكمية: ${quantity}، الطلب: ${customerRequest}`;

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
  const galleryImages = useMemo(
    () => [
      product?.image || placeholderImage,
      produceIntel.educationalImage || placeholderImage,
      placeholderImage,
    ],
    [product, produceIntel],
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-2 sm:px-4 pb-12" dir="rtl">
      {/* Page Header & Navigation */}
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
          <div className="space-y-8">
            {/* Top Grid: Image Gallery & Commercial Order Controls */}
            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
              {/* Product Photo Showcase */}
              <div className="space-y-4">
                <div className="gsd-surface rounded-3xl p-4 text-center border border-[var(--gs-border-subtle)] relative overflow-hidden">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="mx-auto h-72 sm:h-80 w-full max-w-sm rounded-2xl object-cover transition duration-300 ease-in-out hover:scale-105"
                  />
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {galleryImages.map((image, index) => {
                      const isActive = selectedImage === image;
                      return (
                        <button
                          key={`${product.id}-thumb-${index}`}
                          type="button"
                          onClick={() => setSelectedImage(image)}
                          className={`overflow-hidden rounded-2xl border-2 transition-all ${
                            isActive
                              ? 'border-emerald-600 ring-2 ring-emerald-500/20 opacity-100'
                              : 'border-[var(--gs-border)] opacity-70 hover:opacity-100'
                          }`}
                          aria-label={`عرض الصورة ${index + 1}`}
                          aria-current={isActive}
                        >
                          <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="h-20 w-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Produce Badges */}
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

              {/* Product Purchase & Summary Controls */}
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
                          <Store className="h-4 w-4 text-emerald-600" />
                          <span>متجر التوريد: <strong className="font-bold text-emerald-700 dark:text-emerald-400">{supplyingStore.name}</strong></span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${supplyingStore.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {supplyingStore.status === 'open' ? 'مفتوح' : 'مغلق مؤقتاً'}
                          </span>
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
                      {product.stock > 0 ? `متوفر في المخزون (${product.stock} ${product.unit.abbreviation})` : 'نفد المخزون مؤقتاً'}
                    </span>
                  </div>
                </div>

                {/* Short Overview / نبذة عن المنتج */}
                <div className="rounded-2xl bg-[var(--gs-muted)] p-4 text-sm text-[var(--gs-foreground-secondary)] leading-relaxed">
                  <h3 className="text-xs font-bold text-[var(--gs-foreground)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-emerald-600" />
                    نبذة عن المنتج
                  </h3>
                  {produceIntel.shortDescription}
                </div>

                {/* Interactive Order Controls */}
                <div className="gsd-surface rounded-2xl p-4 text-right border border-[var(--gs-border-subtle)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-[var(--gs-foreground)]">تجهيز الطلب</div>
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

                    <div className="text-xs font-semibold text-[var(--gs-foreground-secondary)]">
                      <div className="mb-1.5">طلب سريع عبر واتساب</div>
                      <div className="rounded-xl border border-[var(--gs-border-subtle)] px-3 py-2.5 text-xs font-bold text-emerald-600 flex items-center justify-between">
                        <span>مباشرة للمتجر</span>
                        <span>{WHATSAPP_NUMBER}</span>
                      </div>
                    </div>
                  </div>

                  <label className="block text-xs font-semibold text-[var(--gs-foreground-secondary)]">
                    <div className="mb-1">ملاحظات الطلب (اختياري)</div>
                    <textarea
                      value={customerRequest}
                      onChange={(e) => setCustomerRequest(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border border-[var(--gs-border-subtle)] bg-transparent px-3 py-2 text-xs outline-none [color:var(--gs-foreground)]"
                    />
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row pt-1">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={adding || !product || product.stock <= 0}
                      className={`gsd-btn gsd-btn--primary gsd-btn--md inline-flex items-center justify-center gap-2 flex-1 rounded-2xl h-12 font-bold text-sm ${
                        added ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="h-5 w-5" />
                          تمت إضافته للسلة بنجاح ✓
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-5 w-5" />
                          إضافة إلى السلة (إجمالي: {formatPrice(product.sellingPrice * quantity, locale)})
                        </>
                      )}
                    </button>
                    <a
                      href={buildWhatsAppUrl(whatsappMessage)}
                      target="_blank"
                      rel="noreferrer"
                      className="gsd-btn gsd-btn--ghost gsd-btn--md inline-flex items-center justify-center gap-2 rounded-2xl h-12 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50/50"
                    >
                      <MessageCircle className="h-5 w-5" />
                      طلب سريع عبر واتساب
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Produce Intelligence Detailed Presentation Sections */}
            <div className="space-y-6 pt-4 border-t border-[var(--gs-border-subtle)]">
              <h3 className="text-xl font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                <Leaf className="h-6 w-6 text-emerald-600" />
                الدليل التغذوي والمعلومات الكاملة للمنتج
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* 🌿 الفوائد العامة (General Benefits) */}
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

                {/* 🥗 العناصر الغذائية البارزة (Nutrition Highlights) */}
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

                {/* 🍽️ الاستخدامات الشائعة والتحضير (Common Uses & Prep) */}
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

                {/* ❄️ طريقة الحفظ والتخزين (Storage Guidance) */}
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

              {/* 👨‍👩‍👧‍👦 لمن يناسب؟ (Suitability Overview) */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10 p-5 space-y-4">
                <h4 className="text-base font-bold text-[var(--gs-foreground)] flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  👨‍👩‍👧‍👦 لمن يناسب هذا المنتج؟
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

              {/* ⚠️ ملاحظات وتنبيهات غذائية (Caution Notes) */}
              {produceIntel.suitability.cautionNotes && produceIntel.suitability.cautionNotes.length > 0 && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    ⚠️ ملاحظات غذائية عامة
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

              {/* 🌱 الموسم والمنشأ (Season & Origin) */}
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

              {/* Educational Visual Presentation Card */}
              {produceIntel.educationalImage && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-[var(--gs-foreground-secondary)]">صورة توضيحية للمنتج في بيئته الزراعية</div>
                  <EducationalImageCard
                    src={produceIntel.educationalImage}
                    alt={produceIntel.educationalImageAltAr || product.name}
                    caption={`${product.name} — ${produceIntel.origin}`}
                    aspectRatio="video"
                    className="max-w-2xl mx-auto"
                  />
                </div>
              )}
            </div>

            {/* Related Products Recommendation */}
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
