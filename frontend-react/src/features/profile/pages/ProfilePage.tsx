import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Shield, LogOut, CheckCircle2, Lock, Save, KeyRound, AlertCircle } from 'lucide-react';
import { updateProfile, changePassword } from '@/services/authClient';

export function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const formatPerm = (p: any): string => {
    if (typeof p === 'string') return p;
    if (typeof p === 'object' && p !== null) return `${p.resource}:${p.action}`;
    return String(p);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!name.trim()) {
      setProfileError('الاسم لا يمكن أن يكون فارغاً');
      return;
    }

    setProfileLoading(true);
    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() || undefined });
      await refreshUser();
      setProfileSuccess('تم تحديث بيانات الملف الشخصي بنجاح');
      setTimeout(() => setProfileSuccess(null), 3500);
    } catch (err: any) {
      setProfileError(err?.message || 'فشل تحديث البيانات الشخصية');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('يرجى إدخال كلمة المرور الحالية');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('كلمة المرور الجديدة يجب أن تتكون من 8 أحرف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setPasswordSuccess('تم تغيير كلمة المرور بنجاح');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 3500);
    } catch (err: any) {
      if (err?.message === 'invalid_current_password') {
        setPasswordError('كلمة المرور الحالية غير صحيحة');
      } else {
        setPasswordError(err?.message || 'فشل تغيير كلمة المرور');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8" dir="rtl">
      {/* Profile Header */}
      <div className="gsd-card rounded-3xl p-6 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="h-20 w-20 rounded-2xl bg-emerald-500/10 text-emerald-600 font-bold text-2xl flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold [color:var(--gs-foreground)]">{user.name}</h1>
            <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-0.5 text-xs font-semibold uppercase">
              {user.role || 'USER'}
            </span>
          </div>
          <p className="text-xs text-[var(--gs-foreground-secondary)] flex items-center gap-2">
            <Mail className="h-3.5 w-3.5" />
            {user.email}
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="gsd-btn gsd-btn--secondary gsd-btn--sm text-rose-600 hover:bg-rose-50 rounded-xl inline-flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Information & Edit Profile */}
        <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
          <h2 className="text-base font-bold [color:var(--gs-foreground)] flex items-center gap-2 border-b border-[var(--gs-border)] pb-3">
            <User className="h-5 w-5 text-emerald-600" />
            معلومات الحساب والتعديل
          </h2>

          {profileError && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          {profileSuccess && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
            <div className="space-y-1 text-right">
              <label className="font-semibold text-[var(--gs-foreground-secondary)]">الاسم الكامل *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="gsd-input w-full p-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-xs"
              />
            </div>

            <div className="space-y-1 text-right">
              <label className="font-semibold text-[var(--gs-foreground-secondary)]">البريد الإلكتروني (غير قابل للتعديل)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="gsd-input w-full p-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-muted)] text-xs text-[var(--gs-foreground-muted)] cursor-not-allowed"
              />
            </div>

            <div className="space-y-1 text-right">
              <label className="font-semibold text-[var(--gs-foreground-secondary)]">رقم الهاتف</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966500000000"
                className="gsd-input w-full p-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="gsd-btn gsd-btn--primary gsd-btn--sm rounded-xl inline-flex items-center gap-2 px-4 py-2"
              >
                {profileLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    حفظ التغييرات
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-4">
          <h2 className="text-base font-bold [color:var(--gs-foreground)] flex items-center gap-2 border-b border-[var(--gs-border)] pb-3">
            <Lock className="h-5 w-5 text-emerald-600" />
            تغيير كلمة المرور
          </h2>

          {passwordError && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div className="space-y-1 text-right">
              <label className="font-semibold text-[var(--gs-foreground-secondary)]">كلمة المرور الحالية *</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="gsd-input w-full p-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-xs"
              />
            </div>

            <div className="space-y-1 text-right">
              <label className="font-semibold text-[var(--gs-foreground-secondary)]">كلمة المرور الجديدة *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="gsd-input w-full p-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-xs"
              />
            </div>

            <div className="space-y-1 text-right">
              <label className="font-semibold text-[var(--gs-foreground-secondary)]">تأكيد كلمة المرور الجديدة *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="gsd-input w-full p-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="gsd-btn gsd-btn--primary gsd-btn--sm rounded-xl inline-flex items-center gap-2 px-4 py-2"
              >
                {passwordLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    تحديث كلمة المرور
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Permissions Matrix view */}
      {user.permissions && user.permissions.length > 0 && (
        <div className="gsd-card rounded-3xl p-5 border border-[var(--gs-border)] bg-[var(--gs-surface)] space-y-3">
          <h2 className="text-base font-bold [color:var(--gs-foreground)] flex items-center gap-2 border-b border-[var(--gs-border)] pb-3">
            <Shield className="h-5 w-5 text-emerald-600" />
            الصلاحيات الممنوحة للتعامل مع النظام ({user.permissions.length})
          </h2>

          <div className="flex flex-wrap gap-2 pt-2">
            {user.permissions.map((p, idx) => (
              <span
                key={idx}
                className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono font-medium text-emerald-700"
              >
                {formatPerm(p)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
