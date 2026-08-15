/* ============================================================
   GSDS v1.1 — ProductDetailsPage
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.3 — Uses ProductService via useProductDetail hook
   ============================================================ */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  Eye,
  Heart,
  HeartPulse,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  ShoppingBag,
  Check,
  Store,
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
  getNotRecommendedFor,
  getProductBadges,
  getProductRating,
  getNutritionSummary,
  getStorageInstructions,
  getSuitableFor,
  isFreshToday,
} from '@/features/marketplace/utils/productTags';

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
      current.includes(product.id) ? current.filter((id) => id !== product.id) : [product.id, ...current],
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

  const recommendedProducts = useMemo(() => {
    if (!product) return [];
    return ProductService.getAll()
      .filter((candidate) => candidate.id !== product.id && candidate.status === 'active')
      .slice(0, 4);
  }, [product]);

  const productBadges = product ? getProductBadges(product) : [];
  const galleryImages = useMemo(
    () => [product?.image || placeholderImage, placeholderImage, placeholderImage],
    [product],
  );

  const healthBenefits = {
    Vegetables: ['غني بالألياف', 'يدعم الهضم', 'يفتح خيارات أفضل للوجبات اليومية'],
    Fruits: ['مصدر طبيعي للفيتامينات', 'مناسب كوجبة خفيفة', 'يدعم نشاطك اليومي'],
    Herbs: ['مضاد أكسدة', 'مناسب للتتبيل', 'مساعد في تنوع الأطباق اليومية'],
    Dairy: ['مصدر بروتين', 'يدعم العناصر الغذائية', 'مناسب مع الإفطار أو الوجبات الخفيفة'],
    Beverages: ['منعش', 'مناسب للاسترخاء', 'يفتح تجربة شراء ممتعة'],
  };

  const whenNotToBuy = {
    Vegetables: 'لا تشتريه إن كنت ستحتاج إلى تخزين طويل، لأن الطازجة تميل إلى التدهور بسرعة.',
    Fruits: 'لا تشتريه إذا كنت غير قادر على استهلاكه خلال يومين لأن نضارته تتأثر بالوقت.',
    Herbs: 'لا تشتريه إن كنت تفضل تخزينًا طويلًا؛ الأفضل استخدامه سريعًا في التتبيل.',
    Dairy: 'لا تشتريه إذا كنت حساسًا تجاه منتجات الألبان أو إذا لم تتوفر ظروف تخزين مناسبة.',
    Beverages: 'لا تشتريه إذا كانت احتياجاتك محدودة أو كنت تستهدف خيارات منخفضة السعر.',
  };

  const bestTime = {
    Vegetables: 'أفضل وقت لاستخدامه هو في بداية اليوم مع وجباتك الرئيسية.',
    Fruits: 'يفضل تناوله قبل الظهر أو بعد التمرين كوجبة خفيفة.',
    Herbs: 'يمثل إضافة ممتازة عند تجهيز الوجبات أو التتبيل في وقت الغداء.',
    Dairy: 'يفضل تناوله خلال الإفطار أو مع وجبة خفيفة متوازنة.',
    Beverages: 'يفضل استخدامه في وقت الاسترخاء أو مع الوجبات اليومية.',
  };

  return (
    <div className="flex flex-col gap-4" dir="rtl">
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
            <Eye className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
            {product ? product.name : t('products.details.title')}
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
      </div>

      <div className="gsd-card p-4 sm:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2 text-sm [color:var(--gs-foreground-muted)]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {t('common.loading')}
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full [background:var(--gs-danger-soft)]">
              <Eye className="h-8 w-8 [color:var(--gs-danger)]" aria-hidden="true" />
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
          <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                <div className="gsd-surface rounded-3xl p-4 text-center">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="mx-auto h-72 w-full max-w-xs rounded-2xl object-cover transition duration-300 ease-in-out hover:scale-105"
                  />
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {galleryImages.map((image, index) => {
                      const isActive = selectedImage === image;
                      return (
                        <button
                          key={`${product.id}-thumb-${index}`}
                          type="button"
                          onClick={() => setSelectedImage(image)}
                          className={`overflow-hidden rounded-2xl border-2 transition-all ${
                            isActive
                              ? 'border-[var(--gs-primary)] ring-2 ring-[var(--gs-primary-soft)] opacity-100'
                              : 'border-[var(--gs-border)] opacity-75 hover:opacity-100'
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

                <div className="flex flex-wrap justify-center gap-2">
                  {productBadges.map((badge) => (
                    <span
                      key={badge.label}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        badge.active ? 'bg-emerald-50 text-emerald-700' : 'bg-[var(--gs-muted)] text-[var(--gs-foreground-secondary)]'
                      }`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-semibold [color:var(--gs-foreground)]">{product.name}</h2>
                    <p className="text-sm [color:var(--gs-foreground-secondary)]">
                      {product.brand.name} • {product.category.name}
                    </p>
                    {supplyingStore && (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/stores/${supplyingStore.id}`)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--gs-foreground)] transition hover:border-[var(--gs-primary)] hover:text-[var(--gs-primary)] shadow-sm"
                        >
                          <Store className="h-4 w-4 text-emerald-600" />
                          <span>المتجر المورّد: <strong className="font-bold text-[var(--gs-foreground)]">{supplyingStore.name}</strong></span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${supplyingStore.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {supplyingStore.status === 'open' ? 'مفتوح الآن' : 'مغلق مؤقتًا'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <Star className="h-4 w-4" />
                    {getProductRating(product).toFixed(1)}
                  </div>
                </div>

                <div className="rounded-2xl bg-[var(--gs-muted)] p-4 text-right">
                  <div className="text-sm [color:var(--gs-foreground-muted)]">السعر الحالي</div>
                  <div className="mt-1 text-2xl font-semibold [color:var(--gs-primary)]">{formatPrice(product.sellingPrice, locale)}</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoTile label="الباركود" value={product.barcode} />
                  <InfoTile label="SKU" value={product.sku} />
                  <InfoTile label="الفئة" value={product.category.name} />
                  <InfoTile label="الماركة" value={product.brand.name} />
                  <InfoTile label="الوحدة" value={product.unit.name} />
                  <InfoTile label="الحالة" value={product.status} />
                </div>

                <div className="gsd-surface rounded-2xl p-4 text-right">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-semibold [color:var(--gs-foreground)]">طلب المنتج</div>
                      <p className="text-xs [color:var(--gs-foreground-secondary)]">اختر الكمية وشارك طلبك الفريد.</p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleFavorite}
                      className="gsd-btn gsd-btn--ghost gsd-btn--sm inline-flex items-center gap-2"
                      aria-label={isProductFavorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                    >
                      <Heart className={`h-4 w-4 ${isProductFavorited ? 'text-rose-500' : 'text-[var(--gs-foreground)]'}`} />
                      {isProductFavorited ? 'في المفضلة' : 'أضف للمفضلة'}
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="text-sm [color:var(--gs-foreground-secondary)]">
                      <div className="mb-1">الكمية</div>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                        className="w-full rounded-xl border border-[var(--gs-border-subtle)] bg-transparent px-3 py-2 text-sm outline-none [color:var(--gs-foreground)]"
                      />
                    </label>
                    <div className="text-sm [color:var(--gs-foreground-secondary)]">
                      <div className="mb-1">التواصل عبر واتساب</div>
                      <div className="rounded-xl border border-[var(--gs-border-subtle)] px-3 py-2 text-sm [color:var(--gs-foreground)]">
                        {WHATSAPP_NUMBER}
                      </div>
                    </div>
                  </div>

                  <label className="mt-3 block text-sm [color:var(--gs-foreground-secondary)]">
                    <div className="mb-1">الطلب أو الاستفسار</div>
                    <textarea
                      value={customerRequest}
                      onChange={(event) => setCustomerRequest(event.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-[var(--gs-border-subtle)] bg-transparent px-3 py-2 text-sm outline-none [color:var(--gs-foreground)]"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={adding || !product || product.stock <= 0}
                    className={`gsd-btn gsd-btn--primary gsd-btn--md inline-flex items-center justify-center gap-2 flex-1 ${
                      added ? 'bg-emerald-600 text-white' : ''
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4" />
                        تمت إضافة المنتج للسلة ✓
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        إضافة إلى السلة
                      </>
                    )}
                  </button>
                  <a
                    href={buildWhatsAppUrl(whatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="gsd-btn gsd-btn--ghost gsd-btn--md inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    طلب عبر واتساب
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <FeatureBlock
                icon={Sparkles}
                title="الفوائد الصحية"
                body={
                  healthBenefits[product.category.name as keyof typeof healthBenefits]?.join(' • ') ||
                  'منتج منتقى بعناية لتلبية احتياجك اليومي.'
                }
              />
              <FeatureBlock
                icon={ShieldCheck}
                title="علامات الجودة"
                body={`${
                  isFreshToday(product) ? 'طازج اليوم،' : 'منتج مختار بعناية،'
                } مناسب للطلب السريع ومتوافق مع تجربة المتجر.`}
              />
              <FeatureBlock
                icon={Clock3}
                title="أفضل وقت لاستخدام المنتج"
                body={bestTime[product.category.name as keyof typeof bestTime] || 'استخدمه في وقت مناسب ضمن روتينك اليومي.'}
              />
              <FeatureBlock
                icon={HeartPulse}
                title="منتج مناسب لمرضى السكري"
                body={
                  ['Vegetables', 'Herbs'].includes(product.category.name)
                    ? 'خيار مناسب ضمن الخيارات الأقل سكرًا عندما يتم تضمينه في نظام غذائي متوازن.'
                    : 'قارن مع الخيارات النباتية في المتجر قبل اختيار المنتج في نظام غذائي متوازن.'
                }
              />
              <FeatureBlock
                icon={BadgeCheck}
                title="متى لا تشتري المنتج"
                body={whenNotToBuy[product.category.name as keyof typeof whenNotToBuy] || 'اختَر الكمية التي يمكنك استهلاكها خلال أقرب فرصة.'}
              />
              <FeatureBlock
                icon={Sparkles}
                title="التخزين المثالي"
                body={getStorageInstructions(product)}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <InfoBlock title="الملخص الغذائي" value={getNutritionSummary(product)} />
              <InfoBlock title="مناسب لـ" value={getSuitableFor(product)} />
              <InfoBlock title="لا ينصح به لـ" value={getNotRecommendedFor(product)} />
            </div>

            <section className="gsd-card rounded-2xl p-4 sm:p-5">
              <div className="mb-3 text-lg font-semibold [color:var(--gs-foreground)]">المتاجر المتاحة</div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {StoreService.getAll().map((store) => (
                  <div key={store.id} className="gsd-surface rounded-2xl p-4 text-right">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold [color:var(--gs-foreground)]">{store.name}</div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${store.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {store.status === 'open' ? 'مفتوح' : 'مغلق'}
                      </span>
                    </div>
                    <div className="mt-2 text-xs [color:var(--gs-foreground-secondary)]">
                      التقييم: {store.rating.toFixed(1)} • المسافة: {store.distance}
                    </div>
                    <div className="mt-2 text-xs [color:var(--gs-foreground-secondary)]">
                      {store.deliveryAvailable ? 'توصيل متاح' : 'بدون توصيل'} • {store.highlight}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="gsd-card rounded-2xl p-4 sm:p-5">
              <div className="mb-3 text-lg font-semibold [color:var(--gs-foreground)]">منتجات مشابهة</div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((related) => (
                  <button
                    key={related.id}
                    type="button"
                    onClick={() => navigate(`/products/${related.id}`)}
                    className="gsd-surface rounded-2xl p-3 text-right transition hover:-translate-y-0.5"
                  >
                    <img
                      src={related.image || placeholderImage}
                      alt={related.name}
                      className="h-36 w-full rounded-xl object-cover"
                    />
                    <div className="mt-2 text-sm font-semibold [color:var(--gs-foreground)]">{related.name}</div>
                    <div className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">{related.category.name}</div>
                    <div className="mt-2 text-sm font-semibold [color:var(--gs-primary)]">{related.sellingPrice.toFixed(2)} ر.س</div>
                  </button>
                ))}
              </div>
            </section>

            <section className="gsd-card rounded-2xl p-4 sm:p-5">
              <div className="mb-3 text-lg font-semibold [color:var(--gs-foreground)]">منتجات مقترحة</div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {recommendedProducts.map((recommended) => (
                  <button
                    key={recommended.id}
                    type="button"
                    onClick={() => navigate(`/products/${recommended.id}`)}
                    className="gsd-surface rounded-2xl p-3 text-right transition hover:-translate-y-0.5"
                  >
                    <img
                      src={recommended.image || placeholderImage}
                      alt={recommended.name}
                      className="h-36 w-full rounded-xl object-cover"
                    />
                    <div className="mt-2 text-sm font-semibold [color:var(--gs-foreground)]">{recommended.name}</div>
                    <div className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">{recommended.category.name}</div>
                    <div className="mt-2 text-sm font-semibold [color:var(--gs-primary)]">{recommended.sellingPrice.toFixed(2)} ر.س</div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full [background:var(--gs-muted)]">
              <Eye className="h-8 w-8 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">{t('products.details.notFound')}</h2>
            <p className="text-sm [color:var(--gs-foreground-secondary)] max-w-md">
              {t('products.details.notFoundDesc', { id: id || '' })}
            </p>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="gsd-btn gsd-btn--primary gsd-btn--md mt-2"
            >
              {t('products.backToList')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="gsd-surface rounded-2xl p-3 text-right">
      <div className="text-xs [color:var(--gs-foreground-muted)]">{label}</div>
      <div className="mt-1 text-sm font-semibold [color:var(--gs-foreground)]">{value}</div>
    </div>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="gsd-surface rounded-2xl p-4 text-right">
      <div className="text-sm font-semibold [color:var(--gs-foreground)]">{title}</div>
      <p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">{value}</p>
    </div>
  );
}

function FeatureBlock({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Sparkles;
  title: string;
  body: string;
}) {
  return (
    <div className="gsd-surface rounded-2xl p-4 text-right">
      <div className="flex items-center gap-2 text-sm font-semibold [color:var(--gs-foreground)]">
        <Icon className="h-4 w-4 [color:var(--gs-primary)]" />
        {title}
      </div>
      <p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">{body}</p>
    </div>
  );
}
