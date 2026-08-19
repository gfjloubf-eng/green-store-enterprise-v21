import { useNavigate } from 'react-router-dom';
import { Info, Phone, LifeBuoy, Users, ShieldCheck, ArrowRight, Home, Mail, MapPin, Clock } from 'lucide-react';
import { SupportTeamCards } from '@/components/support/SupportTeamCards';
import { FAQSection } from '@/components/support/FAQSection';

export function AboutPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6 pb-8" dir="rtl">
      <div className="gsd-card rounded-3xl p-8 border border-[var(--gs-border)] bg-[var(--gs-surface)] text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
          <Info className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold [color:var(--gs-foreground)]">عن متجر قطوف الطبيعة</h1>
        <p className="max-w-2xl mx-auto text-sm [color:var(--gs-foreground-secondary)] leading-relaxed">
          منصة "قطوف الطبيعة" توفر أجود أنواع الخضروات والفواكه والمنتجات الطازجة مباشرة من المزارع إلى العميل، مع التركيز على الجودة اليومية والخدمة الاحترافية وتجربة المستخدم المريحة.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="gsd-btn gsd-btn--primary gsd-btn--md rounded-xl inline-flex items-center gap-2"
          >
            تصفح الكتالوج الطازج
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6 pb-12" dir="rtl">
      {/* Contact Header */}
      <div className="gsd-card rounded-3xl p-6 sm:p-8 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold [color:var(--gs-foreground)]">تواصل معنا والخدمات المساندة</h1>
            <p className="text-xs [color:var(--gs-foreground-secondary)]">يسعدنا استقبال استفساراتكم وملاحظاتكم عبر القنوات المعتمدة.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 pt-2">
          <div className="p-4 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] space-y-1">
            <Mail className="h-5 w-5 text-emerald-600 mb-2" />
            <h3 className="text-xs font-semibold [color:var(--gs-foreground)]">البريد الإلكتروني</h3>
            <p className="text-xs text-[var(--gs-foreground-secondary)]">ggjloubf@gmail.com</p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] space-y-1">
            <MapPin className="h-5 w-5 text-emerald-600 mb-2" />
            <h3 className="text-xs font-semibold [color:var(--gs-foreground)]">الموقع الرئيسي</h3>
            <p className="text-xs text-[var(--gs-foreground-secondary)]">اليمن، صنعاء، شارع هائل</p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] space-y-1">
            <Clock className="h-5 w-5 text-emerald-600 mb-2" />
            <h3 className="text-xs font-semibold [color:var(--gs-foreground)]">ساعات العمل</h3>
            <p className="text-xs text-[var(--gs-foreground-secondary)]">يوميًا من 8:00 صباحًا - 10:00 مساءً</p>
          </div>
        </div>
      </div>

      {/* Support Team Cards */}
      <SupportTeamCards onOpenTicket={() => navigate('/support')} />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}

import FeatureSettingsPage from '@/features/settings/pages/SettingsPage';

export function SettingsPage() {
  return <FeatureSettingsPage />;
}

export function HelpPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6 pb-12" dir="rtl">
      <div className="gsd-card rounded-3xl p-6 sm:p-8 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold [color:var(--gs-foreground)]">المساعدة والدعم المباشر</h1>
            <p className="text-xs [color:var(--gs-foreground-secondary)]">إرشادات وأجوبة الأسئلة الشائعة وقنوات التواصل مع فريق الدعم.</p>
          </div>
        </div>
      </div>

      <SupportTeamCards onOpenTicket={() => navigate('/support')} />
      <FAQSection />
    </div>
  );
}

export function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6 pb-8" dir="rtl">
      <div className="gsd-card rounded-3xl p-6 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--gs-border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold [color:var(--gs-foreground)]">إدارة المستخدمين (Users Management)</h1>
              <p className="text-xs [color:var(--gs-foreground-secondary)]">عرض وإدارة الحسابات المسجلة وفق RBAC.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--gs-border)] overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-[var(--gs-background)] text-[var(--gs-foreground-muted)] uppercase border-b border-[var(--gs-border)]">
              <tr>
                <th className="p-3 font-semibold">المستخدم</th>
                <th className="p-3 font-semibold">البريد الإلكتروني</th>
                <th className="p-3 font-semibold">الدور الرئيسي</th>
                <th className="p-3 font-semibold">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gs-border-subtle)] [color:var(--gs-foreground)]">
              <tr>
                <td className="p-3 font-medium">المدير العام</td>
                <td className="p-3">admin@greenstore.com</td>
                <td className="p-3"><span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5 font-bold text-[10px]">ADMIN</span></td>
                <td className="p-3 text-emerald-600 font-semibold">نشط</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">المستخدم التجريبي</td>
                <td className="p-3">user@greenstore.com</td>
                <td className="p-3"><span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 font-bold text-[10px]">CUSTOMER</span></td>
                <td className="p-3 text-emerald-600 font-semibold">نشط</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminRolesPage() {
  return (
    <div className="flex flex-col gap-6 pb-8" dir="rtl">
      <div className="gsd-card rounded-3xl p-6 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
        <div className="flex items-center gap-3 border-b border-[var(--gs-border)] pb-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold [color:var(--gs-foreground)]">الأدوار والصلاحيات (Roles & Permissions)</h1>
            <p className="text-xs [color:var(--gs-foreground-secondary)]">مصفوفة الصلاحيات المعتمدة في Phase 8 RBAC.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'CUSTOMER', 'USER'].map((r) => (
            <div key={r} className="p-4 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase">{r}</span>
              <p className="text-[11px] text-[var(--gs-foreground-secondary)]">
                دور معتمد مسبقاً في مصفوفة الوصول والأمان.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NotFound404Page() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6" dir="rtl">
      <span className="text-5xl font-black text-emerald-500">404</span>
      <h1 className="mt-2 text-xl font-bold [color:var(--gs-foreground)]">الصفحة غير موجودة</h1>
      <p className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">
        المسار المطلوب غير موجود أو تم نقله.
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-6 gsd-btn gsd-btn--primary gsd-btn--md rounded-xl inline-flex items-center gap-2"
      >
        <Home className="h-4 w-4" />
        العودة للرئيسية
      </button>
    </div>
  );
}
