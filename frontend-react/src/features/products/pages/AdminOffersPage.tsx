/* ============================================================
   GSDS v1.2 — AdminOffersPage Component
   Green Store Enterprise v2 — Admin Offer Management
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Plus, CheckCircle2, AlertCircle, Trash2, Power, ArrowRight } from 'lucide-react';
import { ProductService } from '../services/productService';
import { OfferService, calculateEffectivePrice, getOfferStateStatus } from '../services/offerService';
import type { ProductDTO } from '../domain/productDTO';
import type { OfferType, ProductOffer } from '../types/product';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';

export function AdminOffersPage() {
  const navigate = useNavigate();
  const { locale } = useI18n();
  const [products, setProducts] = useState<ProductDTO[]>(() => ProductService.getAll());
  const [selectedProductId, setSelectedProductId] = useState('');
  const [title, setTitle] = useState('عرض جديد');
  const [offerType, setOfferType] = useState<OfferType>('today');
  const [discountValue, setDiscountValue] = useState(20);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = () => {
    setProducts(ProductService.getAll());
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedProductId) {
      setError('يرجى اختيار منتج لإضافة العرض');
      return;
    }

    const prod = ProductService.getById(selectedProductId);
    if (!prod) {
      setError('المنتج المختار غير موجود');
      return;
    }

    const newOffer: ProductOffer = {
      id: `off-${Date.now()}`,
      title: title.trim() || 'عرض خاص',
      type: offerType,
      discountValue: Number(discountValue),
      originalPrice: prod.sellingPrice,
      offerPrice: Math.max(0.01, prod.sellingPrice * (1 - Number(discountValue) / 100)),
      active: true,
    };

    const res = OfferService.setProductOffer(selectedProductId, newOffer);
    if (res) {
      setSuccess(`تم تفعيل العرض بنجاح على المنتج "${res.name}"`);
      refreshProducts();
      setSelectedProductId('');
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError('فشل في حفظ العرض');
    }
  };

  const handleToggleActive = (productId: string, currentActive: boolean) => {
    OfferService.toggleOfferState(productId, !currentActive);
    refreshProducts();
  };

  const handleRemoveOffer = (productId: string) => {
    if (!window.confirm('هل أنت تأكد من رغبتك في إزالة العرض من هذا المنتج؟')) return;
    OfferService.removeOffer(productId);
    refreshProducts();
  };

  const offerProducts = products.filter((p) => p.offer || p.compareAtPrice);

  return (
    <div className="flex flex-col gap-6 pb-12" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-3">
            <Tag className="h-6 w-6 text-emerald-600" />
            إدارة العروض والخصومات التجارية (Premium Offers)
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>

        <button
          type="button"
          onClick={() => navigate('/products')}
          className="gsd-btn gsd-btn--secondary gsd-btn--sm rounded-xl inline-flex items-center gap-2 px-4 py-2 text-xs"
        >
          <ArrowRight className="h-4 w-4" />
          العودة لقائمة المنتجات
        </button>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700 font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Create / Edit Offer Form */}
        <form onSubmit={handleCreateOffer} className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4 h-fit">
          <h2 className="text-base font-bold [color:var(--gs-foreground)] border-b border-[var(--gs-border)] pb-3 flex items-center gap-2">
            <Plus className="h-4 w-4 text-emerald-600" />
            إنشاء عرض تجاري جديد
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)] block">اختر المنتج البيعي:</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] p-2.5 text-xs text-[var(--gs-foreground)] focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- اختر من الكتالوج الحالي --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({formatPrice(p.sellingPrice, locale)})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)] block">عنوان العرض:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: عرض اليوم، خصم الجمعة"
              className="w-full rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] p-2.5 text-xs text-[var(--gs-foreground)] focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)] block">نوع العرض:</label>
              <select
                value={offerType}
                onChange={(e) => setOfferType(e.target.value as OfferType)}
                className="w-full rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] p-2.5 text-xs text-[var(--gs-foreground)] focus:ring-2 focus:ring-emerald-500"
              >
                <option value="today">عرض اليوم</option>
                <option value="week">عرض الأسبوع</option>
                <option value="seasonal">عرض موسمي</option>
                <option value="percentage">خصم مئوي (%)</option>
                <option value="fixed">خصم مبلغ ثابت</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)] block">نسبة الخصم (%):</label>
              <input
                type="number"
                min="1"
                max="90"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] p-2.5 text-xs text-[var(--gs-foreground)] focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="gsd-btn gsd-btn--primary gsd-btn--md w-full rounded-2xl font-bold py-2.5 text-xs mt-2"
          >
            حفظ وتفعيل العرض
          </button>
        </form>

        {/* Existing Offers Table */}
        <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
          <h2 className="text-base font-bold [color:var(--gs-foreground)] border-b border-[var(--gs-border)] pb-3 flex items-center justify-between">
            <span>العروض النشطة والمعدلة في المتجر ({offerProducts.length})</span>
          </h2>

          {offerProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--gs-foreground-secondary)]">
              لا توجد عروض مخصصة حالياً. قم بإضافة عرض من النموذج الموازي.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="border-b border-[var(--gs-border)] text-[var(--gs-foreground-secondary)]">
                    <th className="p-2.5">المنتج</th>
                    <th className="p-2.5">العرض</th>
                    <th className="p-2.5">السعر الأصلي</th>
                    <th className="p-2.5">السعر بعد الخصم</th>
                    <th className="p-2.5">الحالة</th>
                    <th className="p-2.5 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                    {offerProducts.map((p) => {
                      const priceInfo = calculateEffectivePrice(p);
                      const isActive = p.offer ? p.offer.active : true;
                      const statusState = p.offer ? getOfferStateStatus(p.offer) : 'active';

                      const statusBadge = {
                        active: { label: '🟢 نشط', style: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' },
                        upcoming: { label: '⏳ قادم', style: 'bg-blue-500/10 text-blue-600 border border-blue-500/20' },
                        expired: { label: '⚠️ منتهي', style: 'bg-amber-500/10 text-amber-600 border border-amber-500/20' },
                        disabled: { label: '🔴 معطل', style: 'bg-rose-500/10 text-rose-600 border border-rose-500/20' },
                      }[statusState];

                      return (
                        <tr key={p.id} className="border-b border-[var(--gs-border-subtle)] hover:bg-[var(--gs-muted)]/30">
                          <td className="p-2.5 font-semibold text-[var(--gs-foreground)]">{p.name}</td>
                          <td className="p-2.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 px-2 py-0.5 text-[11px] font-bold">
                              {priceInfo.offerTitle || 'عرض'} ({priceInfo.discountPercentage}%)
                            </span>
                          </td>
                          <td className="p-2.5 text-rose-500 line-through">{formatPrice(priceInfo.originalPrice, locale)}</td>
                          <td className="p-2.5 font-bold text-emerald-600">{formatPrice(priceInfo.finalPrice, locale)}</td>
                          <td className="p-2.5">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusBadge.style}`}>
                              {statusBadge.label}
                            </span>
                          </td>
                        <td className="p-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(p.id, isActive)}
                              className="p-1.5 rounded-lg hover:bg-[var(--gs-muted)] text-[var(--gs-foreground-secondary)]"
                              title={isActive ? 'تعطيل العرض' : 'تفعيل العرض'}
                            >
                              <Power className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveOffer(p.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                              title="حذف العرض"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOffersPage;
