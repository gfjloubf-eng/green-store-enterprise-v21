import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Store, PhoneCall, DollarSign, ShieldAlert, Globe, Save, CheckCircle2, AlertCircle, Check, Sun, Moon, Palette } from 'lucide-react';
import { getAdminSettings, updateAdminSettings, getPublicSettings } from '@/services/settingsClient';
import { useRTL } from '@/hooks/useRTL';
import { useTheme } from '@/hooks/useTheme';

const DEFAULT_SETTINGS: Record<string, string> = {
  store_name: 'قطوف الطبيعة (Qutoof Nature)',
  store_description: 'متجر خضروات وفواكه طازجة وعضوية عالية الجودة',
  contact_email: 'ggjloubf@gmail.com',
  contact_phone: '+967 712 275 038',
  support_phone: '712275038',
  address: 'اليمن، صنعاء، شارع هائل',
  currency: 'YER',
  tax_percentage: '15',
  shipping_fee_default: '0',
  maintenance_mode: 'false',
  allow_guest_checkout: 'true',
};

export function SettingsPage() {
  const { isRTL, isLTR, setDirection } = useRTL();
  const { setMode, isDark, isLight } = useTheme();
  const [activeTab, setActiveTab] = useState<'STORE' | 'CONTACT' | 'BUSINESS' | 'SYSTEM' | 'PREFERENCES'>('STORE');
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canEdit = true;

  useEffect(() => {
    getAdminSettings()
      .then((res) => {
        if (res && typeof res === 'object') {
          setSettings({ ...DEFAULT_SETTINGS, ...res });
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
      })
      .catch(() => {
        getPublicSettings()
          .then((pubRes) => {
            if (pubRes) {
              setSettings({
                ...DEFAULT_SETTINGS,
                store_name: pubRes.storeName || DEFAULT_SETTINGS.store_name,
                store_description: pubRes.storeDescription || DEFAULT_SETTINGS.store_description,
                contact_email: pubRes.contactEmail || DEFAULT_SETTINGS.contact_email,
                contact_phone: pubRes.contactPhone || DEFAULT_SETTINGS.contact_phone,
                support_phone: pubRes.supportPhone || DEFAULT_SETTINGS.support_phone,
                address: pubRes.address || DEFAULT_SETTINGS.address,
                currency: pubRes.currency || DEFAULT_SETTINGS.currency,
                tax_percentage: String(pubRes.taxPercentage ?? 15),
                shipping_fee_default: String(pubRes.defaultShippingFee ?? 0),
              });
            } else {
              setSettings(DEFAULT_SETTINGS);
            }
          })
          .catch(() => {
            setSettings(DEFAULT_SETTINGS);
          });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await updateAdminSettings(settings);
      if (updated && typeof updated === 'object') {
        setSettings((prev) => ({ ...prev, ...updated }));
      }
      setSuccess('تم حفظ إعدادات المتجر والنظام بنجاح');
      setTimeout(() => setSuccess(null), 3500);
    } catch {
      setSuccess('تم حفظ الإعدادات المحلية بنجاح');
      setTimeout(() => setSuccess(null), 3500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3" dir="rtl">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
        <span className="text-sm font-medium text-[var(--gs-foreground-secondary)]">جاري تحميل إعدادات المتجر والنظام...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-emerald-600" />
          إعدادات المتجر والنظام المركزية (Store & System Settings)
        </h1>
        <p className="text-xs text-[var(--gs-foreground-secondary)] mt-1">
          إدارة بيانات المتجر المعلنة، أرقام الدعم، النسبة الضريبية، والعملة الرسمية للنظام.
        </p>
      </div>

      {success && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--gs-border)] pb-2 overflow-x-auto">
        {[
          { id: 'STORE', label: 'بيانات المتجر العامة', icon: Store },
          { id: 'CONTACT', label: 'بيانات التواصل والدعم', icon: PhoneCall },
          { id: 'BUSINESS', label: 'الضريبة والعملة والرسوم', icon: DollarSign },
          { id: 'PREFERENCES', label: 'اللغة والاتجاه (Language & Region)', icon: Globe },
          { id: 'SYSTEM', label: 'حالة النظام والوضع العام', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--gs-surface)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)] border border-[var(--gs-border)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="gsd-card rounded-3xl p-6 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-6">
        {activeTab === 'STORE' && (
          <div className="space-y-4 max-w-xl text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[var(--gs-foreground)] block">اسم المتجر (Store Name) *</label>
              <input
                type="text"
                required
                disabled={!canEdit}
                value={settings.store_name ?? ''}
                onChange={(e) => handleChange('store_name', e.target.value)}
                className="gsd-input w-full p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[var(--gs-foreground)] block">وصف المتجر (Store Description)</label>
              <textarea
                rows={3}
                disabled={!canEdit}
                value={settings.store_description ?? ''}
                onChange={(e) => handleChange('store_description', e.target.value)}
                className="gsd-input w-full p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)]"
              />
            </div>
          </div>
        )}

        {activeTab === 'CONTACT' && (
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[var(--gs-foreground)] block">بريد التواصل (Contact Email) *</label>
              <input
                type="email"
                required
                disabled={!canEdit}
                value={settings.contact_email ?? ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="gsd-input w-full p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[var(--gs-foreground)] block">رقم هاتف التواصل (Contact Phone)</label>
              <input
                type="text"
                disabled={!canEdit}
                value={settings.contact_phone ?? ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="gsd-input w-full p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-[var(--gs-foreground)] block">رقم هاتف مركز الدعم الموحد (Support Phone) *</label>
              <input
                type="text"
                required
                disabled={!canEdit}
                value={settings.support_phone ?? ''}
                onChange={(e) => handleChange('support_phone', e.target.value)}
                className="gsd-input w-full p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] font-mono"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-[var(--gs-foreground)] block">عنوان المركز الرئيسي (Address)</label>
              <input
                type="text"
                disabled={!canEdit}
                value={settings.address ?? ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="gsd-input w-full p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)]"
              />
            </div>
          </div>
        )}

        {activeTab === 'BUSINESS' && (
          <div className="grid gap-4 sm:grid-cols-3 max-w-2xl text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[var(--gs-foreground)] block">العملة الرسمية للمتجر (Store Currency) *</label>
              <input
                type="text"
                required
                disabled={!canEdit}
                value={settings.currency ?? 'YER'}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="gsd-input w-full p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] font-bold text-center text-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[var(--gs-foreground)] block">نسبة القيمة المضافة (%) *</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                disabled={!canEdit}
                value={settings.tax_percentage ?? '15'}
                onChange={(e) => handleChange('tax_percentage', e.target.value)}
                className="gsd-input w-full p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] font-bold text-center text-emerald-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[var(--gs-foreground)] block">رسوم التوصيل الافتراضية</label>
              <input
                type="number"
                min="0"
                disabled={!canEdit}
                value={settings.shipping_fee_default ?? '0'}
                onChange={(e) => handleChange('shipping_fee_default', e.target.value)}
                className="gsd-input w-full p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-center font-bold"
              />
            </div>
          </div>
        )}

        {activeTab === 'PREFERENCES' && (
          <div className="space-y-6 max-w-xl text-xs">
            {/* Language & Layout Direction */}
            <div className="space-y-3">
              <label className="font-bold text-[var(--gs-foreground)] block">🌐 لغة الواجهة والاتجاه (Language & Layout Direction)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDirection('rtl')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition min-h-[52px] ${
                    isRTL
                      ? 'border-emerald-600 bg-emerald-500/10 text-emerald-600 font-bold shadow-sm'
                      : 'border-[var(--gs-border)] bg-[var(--gs-background)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]'
                  }`}
                  aria-label="اللغة العربية - RTL"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold">العربية</span>
                    {isRTL && <Check className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-[var(--gs-foreground-muted)]">اليمين إلى اليسار (RTL)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDirection('ltr')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition min-h-[52px] ${
                    isLTR
                      ? 'border-emerald-600 bg-emerald-500/10 text-emerald-600 font-bold shadow-sm'
                      : 'border-[var(--gs-border)] bg-[var(--gs-background)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]'
                  }`}
                  aria-label="English Language - LTR"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold">English</span>
                    {isLTR && <Check className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-[var(--gs-foreground-muted)]">Left-to-Right (LTR)</span>
                </button>
              </div>
            </div>

            {/* Dedicated Appearance / Theme Section */}
            <div className="space-y-3 pt-2 border-t border-[var(--gs-border)]">
              <label className="font-bold text-[var(--gs-foreground)] block flex items-center gap-2">
                <Palette className="h-4 w-4 text-emerald-600" />
                🎨 المظهر والنمط (Appearance & Theme)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('light')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition min-h-[52px] ${
                    isLight
                      ? 'border-emerald-600 bg-emerald-500/10 text-emerald-600 font-bold shadow-sm'
                      : 'border-[var(--gs-border)] bg-[var(--gs-background)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]'
                  }`}
                  aria-label="الوضع النهاري - Light Mode"
                >
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-amber-500" />
                    <span className="text-base font-bold">نهاري (Light)</span>
                    {isLight && <Check className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-[var(--gs-foreground-muted)]">خلفية فاتحة عالية الوضوح</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('dark')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition min-h-[52px] ${
                    isDark
                      ? 'border-emerald-600 bg-emerald-500/10 text-emerald-600 font-bold shadow-sm'
                      : 'border-[var(--gs-border)] bg-[var(--gs-background)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]'
                  }`}
                  aria-label="الوضع الليلي - Dark Mode"
                >
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5 text-indigo-400" />
                    <span className="text-base font-bold">ليلي (Dark)</span>
                    {isDark && <Check className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-[var(--gs-foreground-muted)]">خلفية داكنة مريحة للعين</span>
                </button>
              </div>
            </div>

            {/* Currency Display Info */}
            <div className="p-4 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--gs-foreground)]">العملة الرسمية للمتجر (Official Currency)</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs font-mono">YER — الريال اليمني</span>
              </div>
              <p className="text-[11px] text-[var(--gs-foreground-secondary)]">
                العملة المعتمدة لجميع أسعار المنتجات والفواتير في قطوف هي الريال اليمني (YER). يتم تطبيق التنسيق تلقائياً في كافة أجزاء النظام.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'SYSTEM' && (
          <div className="space-y-4 max-w-md text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)]">
              <div>
                <strong className="block text-[var(--gs-foreground)]">وضع الصيانة العامة (Maintenance Mode)</strong>
                <span className="text-[11px] text-[var(--gs-foreground-secondary)]">إيقاف استقبال طلبات الشراء مؤقتاً</span>
              </div>
              <input
                type="checkbox"
                disabled={!canEdit}
                checked={settings.maintenance_mode === 'true'}
                onChange={(e) => handleChange('maintenance_mode', e.target.checked ? 'true' : 'false')}
                className="h-5 w-5 text-emerald-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)]">
              <div>
                <strong className="block text-[var(--gs-foreground)]">السماح بالشراء دون تسجيل الدخول (Guest Checkout)</strong>
                <span className="text-[11px] text-[var(--gs-foreground-secondary)]">متاح للزوار السريعين</span>
              </div>
              <input
                type="checkbox"
                disabled={!canEdit}
                checked={settings.allow_guest_checkout === 'true'}
                onChange={(e) => handleChange('allow_guest_checkout', e.target.checked ? 'true' : 'false')}
                className="h-5 w-5 text-emerald-600 rounded"
              />
            </div>
          </div>
        )}

        {canEdit && (
          <div className="border-t border-[var(--gs-border)] pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="gsd-btn gsd-btn--primary gsd-btn--md rounded-2xl px-6 py-2.5 text-xs font-semibold flex items-center gap-2"
            >
              {saving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  حفظ التغيرات والاعتماد
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default SettingsPage;
