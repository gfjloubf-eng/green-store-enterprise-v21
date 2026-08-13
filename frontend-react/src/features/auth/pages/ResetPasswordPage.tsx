import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { resetPassword } from '@/services/authClient';

export function ResetPasswordPage() {
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError('يرجى إدخال رمز استعادة كلمة المرور');
      return;
    }
    if (newPassword.length < 8) {
      setError('كلمة المرور يجب أن تتكون من 8 أحرف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        token: token.trim(),
        newPassword,
        confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'الرمز غير صالح أو منتهي الصلاحية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[var(--gs-background)] text-[var(--gs-foreground)]" dir="rtl">
      <div className="w-full max-w-md space-y-6 gsd-card rounded-3xl p-6 sm:p-8 border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)]">تعيين كلمة مرور جديدة</h1>
          <p className="text-xs text-[var(--gs-foreground-secondary)]">أدخل رمز الاستعادة وكلمة المرور الجديدة لحسابك.</p>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>تم تغيير كلمة المرور بنجاح! جاري تحويلك لصفحة الدخول...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)]">رمز الاستعادة (Token) *</label>
            <div className="relative">
              <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-muted)]" />
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="أدخل الرمز المستلم"
                className="gsd-input w-full pr-10 pl-3 py-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-sm font-mono"
              />
            </div>
          </div>

          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)]">كلمة المرور الجديدة *</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-muted)]" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="gsd-input w-full pr-10 pl-3 py-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-sm"
              />
            </div>
          </div>

          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)]">تأكيد كلمة المرور الجديدة *</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-muted)]" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="gsd-input w-full pr-10 pl-3 py-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gsd-btn gsd-btn--primary gsd-btn--lg w-full rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'حفظ كلمة المرور الجديدة'
            )}
          </button>
        </form>

        <div className="text-center border-t border-[var(--gs-border-subtle)] pt-4 text-xs text-[var(--gs-foreground-secondary)]">
          <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
            العودة لصفحة تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
