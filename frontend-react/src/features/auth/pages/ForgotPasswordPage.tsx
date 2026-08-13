import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { forgotPassword } from '@/services/authClient';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'فشل إرسال طلب استعادة كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[var(--gs-background)] text-[var(--gs-foreground)]" dir="rtl">
      <div className="w-full max-w-md space-y-6 gsd-card rounded-3xl p-6 sm:p-8 border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)]">استعادة كلمة المرور</h1>
          <p className="text-xs text-[var(--gs-foreground-secondary)]">أدخل بريدك الإلكتروني ليصلك رابط وإرشادات إعادة تعيين كلمة المرور.</p>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-xs text-[var(--gs-foreground-secondary)] leading-relaxed">
              إذا كان البريد الإلكتروني (<strong>{email}</strong>) مسجلاً لدينا في النظام، فقد تم إرسال تعليمات الرمز التعبيري لإعادة التعيين.
            </p>
            <div className="pt-2">
              <Link to="/reset-password" className="gsd-btn gsd-btn--primary gsd-btn--sm rounded-xl px-4 py-2 text-xs">
                إدخال رمز إعادة التعيين
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1 text-right">
              <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)]">البريد الإلكتروني *</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="gsd-input w-full pr-10 pl-3 py-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gsd-btn gsd-btn--primary gsd-btn--lg w-full rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'إرسال تعليمات الاستعادة'
              )}
            </button>
          </form>
        )}

        <div className="text-center border-t border-[var(--gs-border-subtle)] pt-4 text-xs text-[var(--gs-foreground-secondary)]">
          <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
            العودة لصفحة تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
