import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, MessageCircle, Star, Truck } from 'lucide-react';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { buildWhatsAppUrl } from '@/config/whatsapp';
import { ProductService } from '@/features/products/services/productService';
import { placeholderImage } from '@/assets/images/products/productImages';
import { getProductRating } from '../utils/productTags';
import type { ProductDTO } from '@/features/products/domain/productDTO';
import { StoreService } from '../services/storeService';

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

  const availableProducts = useMemo(() => {
    if (!store) return [];
    return ProductService.getAll().filter((product) => store.productIds.includes(product.id));
  }, [store]);

  const todayOffers = useMemo(
    () => availableProducts.filter((product) => product.sellingPrice <= 3).slice(0, 4),
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
            <button
              key={product.id}
              type="button"
              onClick={() => navigate(`/products/${product.id}`)}
              className="gsd-surface flex flex-col rounded-3xl p-3 text-right text-left transition hover:-translate-y-0.5"
            >
              <img
                src={product.image || placeholderImage}
                alt={product.name}
                className="h-36 w-full rounded-3xl object-cover"
              />
              <div className="mt-3">
                <div className="text-sm font-semibold [color:var(--gs-foreground)]">{product.name}</div>
                <div className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">{product.category.name}</div>
                <div className="mt-2 flex items-center justify-between gap-2 text-sm font-semibold [color:var(--gs-primary)]">
                  <span>{product.sellingPrice.toFixed(2)} ر.س</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                    {product.stock > 0 ? 'متوفر' : 'غير متوفر'}
                  </span>
                </div>
              </div>
            </button>
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
            <div className="text-lg font-semibold [color:var(--gs-foreground)]">تقييمات العملاء</div>
            <div className="mt-3 space-y-3">
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
  return (
    <button
      type="button"
      onClick={onClick}
      className="gsd-surface flex flex-col rounded-3xl p-3 text-right transition hover:-translate-y-0.5"
    >
      <img src={product.image || placeholderImage} alt={product.name} className="h-32 w-full rounded-3xl object-cover" />
      <div className="mt-3">
        <div className="text-sm font-semibold [color:var(--gs-foreground)]">{product.name}</div>
        <div className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">{product.category.name}</div>
        <div className="mt-2 flex items-center justify-between gap-2 text-sm font-semibold [color:var(--gs-primary)]">
          <span>{product.sellingPrice.toFixed(2)} ر.س</span>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">{getProductRating(product).toFixed(1)}</span>
        </div>
      </div>
    </button>
  );
}
