import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  User as UserIcon,
  Package,
  Warehouse,
  Users,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getCart, type Cart } from '@/services/cartClient';
import { formatPrice } from '@/lib/formatters';
import { useI18n } from '@/i18n/useI18n';
import { ProductService } from '@/features/products/services/productService';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, hasPermission, hasRole } = useAuth();
  const { locale } = useI18n();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (hasPermission('carts:read')) {
        const c = await getCart();
        setCart(c);
      }
    } catch (e: any) {
      setError(e?.message ?? 'فشل في تحميل بيانات اللوحة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalProducts = ProductService.getAll().length;
  const lowStockCount = ProductService.getAll().filter((p) => p.stock <= 5).length;
  const isAdmin = hasRole('ADMIN') || hasRole('SUPER_ADMIN') || hasPermission('*');
  const isManagerOrStaff = hasRole('MANAGER') || hasRole('STAFF') || hasPermission('inventory:read');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
        <span className="text-sm font-medium [color:var(--gs-foreground-secondary)]">جاري تحميل لوحة التحكم...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8" dir="rtl">
      {/* Header Banner */}
      <div className="gsd-card overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-2">
              لوحة التحكم الرئيسية
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold">مرحبًا بك، {user?.name || 'مستخدم قطوف'}!</h1>
            <p className="text-emerald-100 text-sm mt-1">
              الدور الحالي: <strong className="uppercase bg-white/10 px-2 py-0.5 rounded text-xs">{user?.role || 'CUSTOMER'}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-xs font-semibold backdrop-blur-sm transition hover:bg-white/25"
          >
            <RefreshCw className="h-4 w-4" />
            تحديث
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-600 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={fetchDashboardData} className="underline text-xs font-semibold">إعادة المحاولة</button>
        </div>
      )}

      {/* Admin Experience */}
      {isAdmin ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} title="المستخدمين والنظام" value="نشط" desc="إدارة RBAC والحيّز" color="bg-blue-500/10 text-blue-600" />
            <StatCard icon={Package} title="إجمالي المنتجات" value={String(totalProducts)} desc="منتج في الكتالوج" color="bg-emerald-500/10 text-emerald-600" />
            <StatCard icon={AlertTriangle} title="مخزون منخفض" value={String(lowStockCount)} desc="منتجات تحت الحد" color="bg-amber-500/10 text-amber-600" />
            <StatCard icon={ShoppingCart} title="سلة التسوق" value={cart?.items?.length ? `${cart.items.length} عناصر` : 'فارغة'} desc="سلة الحساب الحالي" color="bg-teal-500/10 text-teal-600" />
          </div>

          <div className="gsd-card rounded-2xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)]">
            <h2 className="text-base font-semibold [color:var(--gs-foreground)] mb-4">إجراءات الإدارة السريعة</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <QuickActionBtn title="إدارة المنتجات" icon={Package} onClick={() => navigate('/products')} />
              <QuickActionBtn title="إدارة المخزون" icon={Warehouse} onClick={() => navigate('/inventory')} />
              <QuickActionBtn title="المستخدمين والصلاحيات" icon={ShieldCheck} onClick={() => navigate('/admin/users')} />
              <QuickActionBtn title="الملف الشخصي" icon={UserIcon} onClick={() => navigate('/profile')} />
            </div>
          </div>
        </div>
      ) : isManagerOrStaff ? (
        /* Staff / Manager Experience */
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={Package} title="المنتجات المتاحة" value={String(totalProducts)} desc="كتالوج المنتجات" color="bg-emerald-500/10 text-emerald-600" />
            <StatCard icon={AlertTriangle} title="تنبيهات المخزون" value={String(lowStockCount)} desc="تحتاج تزويد" color="bg-amber-500/10 text-amber-600" />
            <StatCard icon={Warehouse} title="حالة المستودع" value="مستقر" desc="العمليات التشغيلية" color="bg-blue-500/10 text-blue-600" />
          </div>

          <div className="gsd-card rounded-2xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)]">
            <h2 className="text-base font-semibold [color:var(--gs-foreground)] mb-4">العمليات التشغيلية</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <QuickActionBtn title="عرض المنتجات" icon={Package} onClick={() => navigate('/products')} />
              <QuickActionBtn title="لوحة المخزون" icon={Warehouse} onClick={() => navigate('/inventory')} />
              <QuickActionBtn title="الملف الشخصي" icon={UserIcon} onClick={() => navigate('/profile')} />
            </div>
          </div>
        </div>
      ) : (
        /* Customer Experience */
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard icon={ShoppingCart} title="سلة التسوق" value={cart?.items?.length ? `${cart.items.length} منتجات` : 'فارغة'} desc="عناصر جاهزة للطلب" color="bg-emerald-500/10 text-emerald-600" />
            <StatCard icon={ShoppingBag} title="الكتالوج الطازج" value={`${totalProducts}+ منتج`} desc="خضروات وفواكه طازجة" color="bg-teal-500/10 text-teal-600" />
            <StatCard icon={TrendingUp} title="حساب العملاء" value="نشط" desc="حساب موثق" color="bg-blue-500/10 text-blue-600" />
          </div>

          <div className="gsd-card rounded-2xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)]">
            <h2 className="text-base font-semibold [color:var(--gs-foreground)] mb-4">اختيارات ومسارات سريعة</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <QuickActionBtn title="تصفح المنتجات" icon={Package} onClick={() => navigate('/products')} />
              <QuickActionBtn title="عرض سلة الشراء" icon={ShoppingCart} onClick={() => navigate('/cart')} />
              <QuickActionBtn title="إعدادات الحساب" icon={UserIcon} onClick={() => navigate('/profile')} />
            </div>
          </div>

          {cart && cart.items.length > 0 && (
            <div className="gsd-card rounded-2xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold [color:var(--gs-foreground)]">ملخص السلة الحالية</h3>
                <span className="text-xs font-bold text-emerald-600">{formatPrice(cart.grandTotal, locale)}</span>
              </div>
              <p className="text-xs [color:var(--gs-foreground-secondary)] mb-4">
                لديك {cart.items.length} عنصر في سلة الشراء. يمكنك استكمال الطلب أو تعديل الكميات.
              </p>
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="gsd-btn gsd-btn--primary gsd-btn--sm inline-flex items-center gap-2 rounded-xl"
              >
                الانتقال للسلة
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, title, value, desc, color }: { icon: any; title: string; value: string; desc: string; color: string }) {
  return (
    <div className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)]">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs text-[var(--gs-foreground-secondary)]">{title}</span>
          <div className="text-lg font-bold [color:var(--gs-foreground)] mt-0.5">{value}</div>
        </div>
      </div>
      <p className="text-[11px] text-[var(--gs-foreground-muted)] mt-3 border-t border-[var(--gs-border-subtle)] pt-2">{desc}</p>
    </div>
  );
}

function QuickActionBtn({ title, icon: Icon, onClick }: { title: string; icon: any; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] hover:border-[var(--gs-primary)] transition text-right group"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-[var(--gs-primary)]" />
        <span className="text-sm font-semibold [color:var(--gs-foreground)]">{title}</span>
      </div>
      <ArrowRight className="h-4 w-4 text-[var(--gs-foreground-muted)] group-hover:text-[var(--gs-primary)] transition" />
    </button>
  );
}

export default DashboardPage;
