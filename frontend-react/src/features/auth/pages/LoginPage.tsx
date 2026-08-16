import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LogoPlaceholder } from '@/components/ui/LogoPlaceholder';

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    if (!identifier.trim() || !password.trim()) {
      setError('يرجى إدخال البريد الإلكتروني/اسم المستخدم وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      await auth.login(identifier, password, remember);
      navigate('/');
    } catch (err: any) {
      if (err?.status === 401 || err?.message === 'invalid_credentials' || err?.code === 'unauthorized') {
        setError('بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور.');
      } else {
        setError(err?.message ?? 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--gs-background)] px-4 py-8" dir="rtl">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-xl border bg-[var(--gs-surface)] [border-color:var(--gs-border)]">
        <div className="flex flex-col items-center mb-6 text-center">
          <LogoPlaceholder size="lg" showText className="mb-4" />
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)]">تسجيل الدخول إلى قطوف الطبيعة</h1>
          <p className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">بوابة التسوق وإدارة الطلبات</p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-right">
            <label className="block text-xs font-semibold [color:var(--gs-foreground-secondary)]" htmlFor="identifier">
              البريد الإلكتروني أو اسم المستخدم *
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-muted)]" />
              <input
                id="identifier"
                name="identifier"
                type="text"
                className="gsd-input w-full pr-10 pl-3 py-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-sm"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-1 text-right">
            <label className="block text-xs font-semibold [color:var(--gs-foreground-secondary)]" htmlFor="password">
              كلمة المرور *
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="gsd-input w-full pr-10 pl-10 py-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-[var(--gs-foreground-muted)] hover:text-[var(--gs-foreground)] transition-colors"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer [color:var(--gs-foreground-secondary)]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              تذكرني
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="font-semibold text-emerald-600 hover:underline"
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gsd-btn gsd-btn--primary gsd-btn--lg w-full rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-[var(--gs-border-subtle)] pt-4 text-xs text-[var(--gs-foreground-secondary)]">
          ليس لديك حساب؟{' '}
          <Link
            to="/register"
            className="font-semibold text-emerald-600 hover:underline"
          >
            إنشاء حساب عميل جديد
          </Link>
        </div>
      </div>
    </div>
  );
}

