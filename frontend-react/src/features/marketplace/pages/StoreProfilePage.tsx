import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, MessageCircle, Star, Truck, Plus, Check } from 'lucide-react';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { buildWhatsAppUrl } from '@/config/whatsapp';
import { ProductService } from '@/features/products/services/productService';
import { placeholderImage } from '@/assets/images/products/productImages';
import { getProductRating } from '../utils/productTags';
import type { ProductDTO } from '@/features/products/domain/productDTO';
import { StoreService } from '../services/storeService';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';
import { useCart } from '../useCart';
import { addItemToCart } from '@/services/cartClient';
import { calculateEffectivePrice } from '@/features/products/services/offerService';

const reviews = [
  {
    author: 'سلوى',
    rating: 5,
    text: 'خدمة ممتازة، المنتجات كانت طازجة والتوصيل كان سريعًا. أنصح بهذا المتجر لكل أسرة.',
    date: 'منذ يومين',
  },
  {
    author: 'ياسين',
    rating: 4.8,
    text: 'منتجات نظيفة وجودة عالية، تجربة طلب سهلة عبر واتساب.',
    date: 'منذ ٤ أيام',
  },
  {
    author: 'هالة',
    rating: 4.7,
    text: 'المنتجات وصلت بحالة رائعة والتغليف كان جيدًا جداً.',
    date: 'منذ أسبوع',
  },
];

export function StoreProfilePage() {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const store = StoreService.getById(storeId ?? '');
  const [userStoreRating, setUserStoreRating] = useState<number | null>(null);
  const [storeRatingSubmitted, setStoreRatingSubmitted] = useState(false);

  const [availableProducts, setAvailableProducts] = useState<ProductDTO[]>(() =>
    store ? ProductService.getAll().filter((product) => store.productIds.includes(product.id)) : [],
  );

  useEffect(() => {
    if (!store) return;
    let isMounted = true;
    void ProductService.syncAllFromBackend().then((syncedProducts) => {
      if (!isMounted) return;
      setAvailableProducts(syncedProducts.filter((product) => store.productIds.includes(product.id)));
    });
    return () => {
      isMounted = false;
    };
  }, [store]);

  const todayOffers = useMemo(
    () => availableProducts.filter((product) => calculateEffectivePrice(product).hasActiveOffer).slice(0, 3),
    [availableProducts],
  );

  const bestSellers = useMemo(
    () => [...availableProducts].sort((a, b) => b.stock - a.stock).slice(0, 4),
    [availableProducts],
  );

  const newArrivals = useMemo(
    () => [...availableProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4),
    [availableProducts],
  );

  const similarStores = useMemo(
    () =>
      StoreService.getAll().filter(
        (item) => item.id !== store?.id && item.status === store?.status,
      ).slice(0, 3),
    [store],
  );

  const coordinates = store?.location?.coordinates;
  const mapUrl = coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
    : null;

  if (!store) {
    return (
      <div className="gsd-card rounded-3xl p-6 text-right" dir="rtl">
        <div className="text-lg font-semibold [color:var(--gs-foreground)]">المتجر غير موجود</div>
        <p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">
          تحقق من الرابط أو عد إلى صفحة المتاجر لمعرفة المتاجر المتاحة.
        </p>
        <button
          type="button"
          onClick={() => navigate('/stores')}
          className="gsd-btn gsd-btn--primary gsd-btn--md mt-4"
        >
          العودة إلى المتاجر
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-h2 font-semibold [color:var(--gs-foreground)]">{store.name}</h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
        <button
          type="button"
          onClick={() => navigate('/stores')}
          className="gsd-btn gsd-btn--ghost gsd-btn--md"
        >
          <ArrowLeft className="h-4 w-4" />
          جميع المتاجر
        </button>
      </div>

      <section className="overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_35%)] shadow-sm">
        <div className="relative h-64 overflow-hidden">
          <img src={store.coverImage} alt={store.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-right text-white">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={store.logo}
                  alt={`${store.name} logo`}
                  className="h-16 w-16 rounded-3xl border border-white/20 object-cover"
                />
                <div>
                  <div className="text-2xl font-semibold">{store.name}</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-sm text-white/80">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {store.rating.toFixed(1)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {store.distance}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      {store.deliveryAvailable ? 'يوجد توصيل' : 'بدون توصيل'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="inline-flex flex-wrap gap-2 text-xs font-semibold">
                <span className={`rounded-full px-3 py-1 ${store.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {store.status === 'open' ? 'مفتوح الآن' : 'مغلق مؤقتًا'}
                </span>
                <span className="rounded-full bg-black/20 px-3 py-1">{store.deliveryTime}</span>
                <span className="rounded-full bg-black/20 px-3 py-1">{store.deliveryCost}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="gsd-surface rounded-3xl p-4 text-right">
            <div className="text-xs [color:var(--gs-foreground-muted)]">الحد الأدنى للطلب</div>
            <div className="mt-2 text-lg font-semibold [color:var(--gs-foreground)]">{store.minimumOrder}</div>
          </div>
          <div className="gsd-surface rounded-3xl p-4 text-right">
            <div className="text-xs [color:var(--gs-foreground-muted)]">ساعات العمل</div>
            <div className="mt-2 text-lg font-semibold [color:var(--gs-foreground)]">{store.workingHours}</div>
          </div>
          <div className="gsd-surface rounded-3xl p-4 text-right">
            <div className="text-xs [color:var(--gs-foreground-muted)]">الفئات</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {store.categories.map((category) => (
                <span key={category} className="rounded-full bg-[var(--gs-muted)] px-3 py-1 text-xs [color:var(--gs-foreground-secondary)]">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="gsd-card rounded-3xl p-4 text-right">
        <div className="text-lg font-semibold [color:var(--gs-foreground)]">عن المتجر</div>
        <p className="mt-3 text-sm [color:var(--gs-foreground-secondary)]">{store.description}</p>
      </section>

      <section className="gsd-card rounded-3xl p-4 text-right">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl bg-[var(--gs-muted)] p-4">
            <div className="text-xs [color:var(--gs-foreground-muted)]">التوصيل</div>
            <div className="mt-2 text-lg font-semibold [color:var(--gs-foreground)]">{store.deliveryAvailable ? 'مباشر وسريع' : 'غير متاح حالياً'}</div>
          </div>
          <div className="rounded-3xl bg-[var(--gs-muted)] p-4">
            <div className="text-xs [color:var(--gs-foreground-muted)]">تواصل واتساب</div>
            <div className="mt-2 text-lg font-semibold [color:var(--gs-foreground)]">{store.whatsappLabel}</div>
          </div>
          <a
            href={buildWhatsAppUrl(`مرحبًا، أود طلب منتجات من ${store.name} والسؤال عن التفاصيل.`)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-4 text-sm font-semibold [color:var(--gs-primary)]"
          >
            تواصل الآن عبر واتساب
            <MessageCircle className="h-5 w-5" />
          </a>
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-4 text-sm font-semibold [color:var(--gs-primary)]"
            >
              فتح الموقع على الخريطة
              <MapPin className="h-5 w-5" />
            </a>
          )}
        </div>
      </section>

      <section className="gsd-card rounded-3xl p-4 text-right">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">المنتجات المتاحة</h2>
            <p className="text-sm [color:var(--gs-foreground-secondary)]">أبرز المنتجات التي يمكن طلبها اليوم من هذا المتجر.</p>
          </div>
          <span className="text-sm [color:var(--gs-foreground-secondary)]">{availableProducts.length} منتجًا</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {availableProducts.map((product) => (
            <ProductTile key={product.id} product={product} onClick={() => navigate(`/products/${product.id}`)} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          <SectionPanel title="عروض اليوم" description="منتجات مميزة بخيارات سعرية مناسبة من المتجر.">
            <div className="grid gap-3 sm:grid-cols-2">
              {todayOffers.map((product) => (
                <ProductTile key={product.id} product={product} onClick={() => navigate(`/products/${product.id}`)} />
              ))}
            </div>
          </SectionPanel>

          <SectionPanel title="الأكثر مبيعاً" description="المنتجات ذات الطلب الأعلى اليوم من المتجر.">
            <div className="grid gap-3 sm:grid-cols-2">
              {bestSellers.map((product) => (
                <ProductTile key={product.id} product={product} onClick={() => navigate(`/products/${product.id}`)} />
              ))}
            </div>
          </SectionPanel>

          <SectionPanel title="وصول حديثاً" description="أحدث الإضافات المتاحة للطلب المباشر.">
            <div className="grid gap-3 sm:grid-cols-2">
              {newArrivals.map((product) => (
                <ProductTile key={product.id} product={product} onClick={() => navigate(`/products/${product.id}`)} />
              ))}
            </div>
          </SectionPanel>
        </div>

        <aside className="space-y-4">
          <div className="gsd-card rounded-3xl p-4 text-right">
            <div className="text-lg font-semibold [color:var(--gs-foreground)]">معلومات سريعة</div>
            <div className="mt-3 space-y-3 text-sm [color:var(--gs-foreground-secondary)]">
              <div className="flex items-center justify-between gap-2">
                <span>التوصيل</span>
                <strong className="[color:var(--gs-foreground)]">{store.deliveryAvailable ? 'متاح' : 'غير متاح'}</strong>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>تكلفة التوصيل</span>
                <strong className="[color:var(--gs-foreground)]">{store.deliveryCost}</strong>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>أوقات العمل</span>
                <strong className="[color:var(--gs-foreground)]">{store.workingHours}</strong>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span>سعر وتقييم متوقع</span>
                <strong className="[color:var(--gs-foreground)]">{Math.max(...availableProducts.map(getProductRating)).toFixed(1)}</strong>
              </div>
            </div>
          </div>

          <div className="gsd-card rounded-3xl p-4 text-right">
            <div className="text-lg font-semibold [color:var(--gs-foreground)] mb-3">تقييمات العملاء</div>

            {/* Interactive Store & Service Rating Widget */}
            <div className="mb-4 p-3.5 rounded-2xl bg-[var(--gs-muted)]/70 border border-[var(--gs-border-subtle)] space-y-2">
              <div className="text-xs font-bold text-[var(--gs-foreground)] flex items-center justify-between">
                <span>قيّم هذا المتجر وجودة الخدمة:</span>
                {userStoreRating && <span className="text-emerald-600 font-bold">{userStoreRating} / 5 🌟</span>}
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setUserStoreRating(star);
                      setStoreRatingSubmitted(true);
                      setTimeout(() => setStoreRatingSubmitted(false), 3500);
                    }}
                    className="p-1 transition hover:scale-125 focus:outline-none"
                    aria-label={`تقييم المتجر ${star} من 5`}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        userStoreRating && star <= userStoreRating
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {storeRatingSubmitted && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  ✓ شكرًا لتقييمك للمتجر! تم حفظ تقييم الخدمة محلية.
                </div>
              )}
            </div>

            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.author} className="rounded-3xl bg-[var(--gs-muted)] p-4">
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold [color:var(--gs-foreground)]">
                    <span>{review.author}</span>
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <Star className="h-4 w-4" />
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">{review.text}</p>
                  <div className="mt-2 text-xs [color:var(--gs-foreground-muted)]">{review.date}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="gsd-card rounded-3xl p-4 text-right">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">متاجر مشابهة</h2>
            <p className="text-sm [color:var(--gs-foreground-secondary)]">متاجر أخرى قد تناسب طلبك بنفس جودة الخدمة.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {similarStores.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/stores/${item.id}`)}
              className="gsd-surface rounded-3xl p-4 text-right transition hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold [color:var(--gs-foreground)]">{item.name}</div>
                  <div className="text-xs [color:var(--gs-foreground-secondary)]">{item.distance} • {item.deliveryAvailable ? 'توصيل' : 'استلام فقط'}</div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                  {item.status === 'open' ? 'مفتوح' : 'مغلق'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionPanel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="gsd-card rounded-3xl p-4 text-right">
      <div className="mb-4">
        <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">{title}</h2>
        <p className="mt-1 text-sm [color:var(--gs-foreground-secondary)]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ProductTile({ product, onClick }: { product: ProductDTO; onClick: () => void }) {
  const { locale } = useI18n();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (adding || product.stock <= 0) return;
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
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="gsd-surface flex flex-col justify-between rounded-3xl p-3 text-right transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--gs-primary)]"
    >
      <div>
        <img
          src={product.image || placeholderImage}
          alt={product.name}
          className="h-32 w-full rounded-2xl object-cover"
          loading="lazy"
        />
        <div className="mt-3 space-y-1">
          <div className="text-sm font-semibold [color:var(--gs-foreground)]">{product.name}</div>
          <div className="text-xs [color:var(--gs-foreground-secondary)]">{product.category.name}</div>
          <div className="mt-2 flex items-center justify-between gap-2 text-sm font-semibold [color:var(--gs-primary)]">
            <span>{formatPrice(product.sellingPrice, locale)}</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              {product.stock > 0 ? `${getProductRating(product).toFixed(1)} ★` : 'غير متوفر'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[var(--gs-border-subtle)]">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding || product.stock <= 0}
          className={`w-full rounded-xl py-1.5 px-3 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            added
              ? 'bg-emerald-600 text-white shadow-sm'
              : product.stock <= 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-600/20'
          }`}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5" />
              تمت الإضافة ✓
            </>
          ) : product.stock <= 0 ? (
            'نفدت الكمية'
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
