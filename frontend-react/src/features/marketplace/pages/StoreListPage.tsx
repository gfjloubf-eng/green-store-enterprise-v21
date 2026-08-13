import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { StoreService } from '../services/storeService';
import { buildWhatsAppUrl } from '@/config/whatsapp';

export function StoreListPage() {
  const navigate = useNavigate();

  const openStores = useMemo(() => StoreService.getOpen(), []);

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 font-semibold [color:var(--gs-foreground)]">المتاجر المحلية</h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
        <p className="max-w-xl text-sm [color:var(--gs-foreground-secondary)]">
          اكتشف المتاجر المحلية الموثوقة المتوفرة في السوق، تعرف على ساعات العمل والتوصيل، وابدأ الطلب عبر واتساب.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {StoreService.getAll().map((store) => (
          <article key={store.id} className="w-full gsd-card overflow-hidden rounded-3xl shadow-sm transition hover:-translate-y-0.5 focus-within:-translate-y-0.5">
            <div className="relative h-56 overflow-hidden sm:h-64">
              <img src={store.coverImage} alt={store.name} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={store.logo}
                    alt={`${store.name} logo`}
                    className="h-14 w-14 rounded-2xl border border-white/20 object-cover"
                  />
                  <div className="space-y-1 text-right text-white">
                    <div className="text-base font-semibold">{store.name}</div>
                    <div className="text-xs text-white/80">{store.categories.join(' • ')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 text-right">
              <div className="flex flex-wrap items-center gap-2">
                <span className="gsd-badge gsd-badge--success">{store.status === 'open' ? 'مفتوح' : 'مغلق'}</span>
                <span className="gsd-badge gsd-badge--neutral">{store.distance}</span>
                <span className="gsd-badge gsd-badge--info">{store.deliveryAvailable ? 'توصيل متاح' : 'بدون توصيل'}</span>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-[var(--gs-foreground-secondary)]">
                <div className="flex items-center justify-between gap-2">
                  <span>وقت التوصيل</span>
                  <strong className="text-[var(--gs-foreground)]">{store.deliveryTime}</strong>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>تكلفة التوصيل</span>
                  <strong className="text-[var(--gs-foreground)]">{store.deliveryCost}</strong>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>الحد الأدنى للطلب</span>
                  <strong className="text-[var(--gs-foreground)]">{store.minimumOrder}</strong>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/stores/${store.id}`)}
                  className="gsd-btn gsd-btn--primary gsd-btn--md flex items-center justify-center gap-2 min-h-[52px] py-3"
                >
                  <ArrowRight className="h-4 w-4" />
                  عرض المتجر
                </button>
                <a
                  href={buildWhatsAppUrl(`مرحبًا، أود التواصل مع ${store.name} حول متاحيات الطلب.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold [color:var(--gs-primary)]"
                >
                  <MessageCircle className="h-4 w-4" />
                  تواصل عبر واتساب
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {openStores.length > 0 ? (
        <div className="gsd-card rounded-3xl p-4 text-right">
          <div className="text-sm font-semibold [color:var(--gs-foreground)]">متاجر مفتوحة الآن</div>
          <p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">
            هذه المتاجر جاهزة لاستقبال طلباتك وتوصيل المنتجات الطازجة بسرعة.
          </p>
        </div>
      ) : null}
    </div>
  );
}
