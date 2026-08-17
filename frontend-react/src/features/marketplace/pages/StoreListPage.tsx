import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowRight, Search, Star, MapPin, Store as StoreIcon, Filter } from 'lucide-react';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { StoreService } from '../services/storeService';
import { buildWhatsAppUrl } from '@/config/whatsapp';

export function StoreListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [openOnly, setOpenOnly] = useState(false);

  const allStores = useMemo(() => StoreService.getAll(), []);

  const filteredStores = useMemo(() => {
    return allStores.filter((store) => {
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = store.name.toLowerCase().includes(q);
        const matchesCat = store.categories.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesCat) return false;
      }

      // Category match
      if (selectedCategory !== 'all') {
        if (!store.categories.includes(selectedCategory)) return false;
      }

      // Status match
      if (openOnly && store.status !== 'open') {
        return false;
      }

      return true;
    });
  }, [allStores, searchQuery, selectedCategory, openOnly]);

  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    allStores.forEach((s) => s.categories.forEach((c) => set.add(c)));
    return Array.from(set);
  }, [allStores]);

  return (
    <div className="flex flex-col gap-5" dir="rtl">
      {/* Header & Description */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
            <StoreIcon className="h-6 w-6 text-emerald-600" />
            المتاجر المحلية والشريكة
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
        <p className="max-w-xl text-sm [color:var(--gs-foreground-secondary)]">
          اكتشف المتاجر المحلية الموثوقة المتوفرة في السوق، قارن التقييمات، وتواصل مباشرة عبر واتساب.
        </p>
      </div>

      {/* Discovery Filters Bar */}
      <div className="gsd-card rounded-3xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-3.5 shadow-sm">
        {/* Search and City Selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-secondary)]" />
            <input
              type="text"
              placeholder="ابحث عن متجر، منتج، أو تصنيف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-[var(--gs-border-subtle)] bg-[var(--gs-muted)]/50 pr-10 pl-4 py-2.5 text-xs font-semibold [color:var(--gs-foreground)] outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative inline-flex items-center">
              <MapPin className="absolute right-3 h-4 w-4 text-emerald-600" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="rounded-2xl border border-[var(--gs-border-subtle)] bg-[var(--gs-muted)]/50 pr-9 pl-4 py-2.5 text-xs font-semibold [color:var(--gs-foreground)] outline-none focus:border-emerald-500 transition"
              >
                <option value="all">جميع المدن والمناطق</option>
                <option value="sanaa">صنعاء (المركز)</option>
                <option value="aden">عدن</option>
                <option value="taiz">تعز</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setOpenOnly((prev) => !prev)}
              className={`rounded-2xl border px-3.5 py-2.5 text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap min-h-[44px] ${
                openOnly
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                  : 'border-[var(--gs-border-subtle)] bg-[var(--gs-muted)]/50 text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>المتاجر المفتوحة فقط</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap min-h-[38px] ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-[var(--gs-muted)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]/80'
            }`}
          >
            كل المتاجر ({allStores.length})
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap min-h-[38px] ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[var(--gs-muted)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stores Grid */}
      {filteredStores.length === 0 ? (
        <div className="gsd-card rounded-3xl p-12 text-center space-y-3 border border-[var(--gs-border)]">
          <StoreIcon className="h-10 w-10 text-[var(--gs-foreground-secondary)] mx-auto opacity-50" />
          <div className="text-base font-bold text-[var(--gs-foreground)]">لم يتم العثور على متاجر مطابقة</div>
          <p className="text-xs text-[var(--gs-foreground-secondary)]">جرب تغيير كلمة البحث أو فلاتر التصفية للمتاجر.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredStores.map((store) => (
            <article key={store.id} className="w-full gsd-card overflow-hidden rounded-3xl shadow-sm transition hover:-translate-y-0.5 focus-within:-translate-y-0.5 border border-[var(--gs-border)] bg-[var(--gs-surface)]">
              <div className="relative h-52 overflow-hidden sm:h-60">
                <img src={store.coverImage} alt={store.name} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={store.logo}
                      alt={`${store.name} logo`}
                      className="h-14 w-14 rounded-2xl border-2 border-white/30 object-cover shadow-sm"
                    />
                    <div className="space-y-1 text-right text-white">
                      <div className="text-base font-bold flex items-center gap-2">
                        <span>{store.name}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 text-white px-2 py-0.5 text-[10px] font-bold">
                          <Star className="h-3 w-3 fill-current" />
                          {store.rating}
                        </span>
                      </div>
                      <div className="text-xs text-white/80">{store.categories.join(' • ')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 text-right space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`gsd-badge ${store.status === 'open' ? 'gsd-badge--success' : 'gsd-badge--danger'}`}>
                    {store.status === 'open' ? '🟢 مفتوح الآن' : '🔴 مغلق'}
                  </span>
                  <span className="gsd-badge gsd-badge--neutral">📍 {store.distance}</span>
                  <span className="gsd-badge gsd-badge--info">{store.deliveryAvailable ? '🚀 توصيل متاح' : 'بدون توصيل'}</span>
                </div>

                <p className="text-xs text-[var(--gs-foreground-secondary)] line-clamp-2 leading-relaxed">
                  {store.description}
                </p>

                <div className="grid gap-2 text-xs text-[var(--gs-foreground-secondary)] pt-2 border-t border-[var(--gs-border-subtle)]">
                  <div className="flex items-center justify-between gap-2">
                    <span>وقت التوصيل:</span>
                    <strong className="text-[var(--gs-foreground)] font-bold">{store.deliveryTime}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span>تكلفة التوصيل:</span>
                    <strong className="text-[var(--gs-foreground)] font-bold">{store.deliveryCost}</strong>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => navigate(`/stores/${store.id}`)}
                    className="gsd-btn gsd-btn--primary gsd-btn--md flex items-center justify-center gap-2 min-h-[48px] py-2.5 w-full font-bold"
                  >
                    <ArrowRight className="h-4 w-4" />
                    عرض المتجر والمنتجات
                  </button>
                  <a
                    href={buildWhatsAppUrl(`مرحبًا، أود التواصل مع ${store.name} حول متاحيات الطلب.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 py-1.5 hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" />
                    تواصل مباشرة عبر واتساب
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
