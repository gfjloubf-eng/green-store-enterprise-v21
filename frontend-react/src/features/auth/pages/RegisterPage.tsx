import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('يرجى إدخال الاسم الكامل');
      return;
    }
    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    if (password.length < 8) {
      setError('كلمة المرور يجب أن تتكون من 8 أحرف على الأقل');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        phone: phone.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      if (err?.message === 'email_already_exists') {
        setError('البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر أو تسجيل الدخول.');
      } else {
        setError(err?.message || 'فشل إنشاء الحساب. يرجى التأكد من البيانات والمحاولة مجدداً.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[var(--gs-background)] text-[var(--gs-foreground)]" dir="rtl">
      <div className="w-full max-w-md space-y-6 gsd-card rounded-3xl p-6 sm:p-8 border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <UserPlus className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)]">إنشاء حساب عميل جديد</h1>
          <p className="text-xs text-[var(--gs-foreground-secondary)]">انضم إلى قطوف الطبيعة للتسوق السريع وإدارة طلبياتك.</p>
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
            <span>تم إنشاء الحساب وتسجيل الدخول بنجاح! جاري تحويلك...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)]">الاسم الكامل *</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-muted)]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="محمد أحمد"
                className="gsd-input w-full pr-10 pl-3 py-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-sm"
              />
            </div>
          </div>

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

          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)]">رقم الهاتف (اختياري)</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-muted)]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966500000000"
                className="gsd-input w-full pr-10 pl-3 py-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-sm"
              />
            </div>
          </div>

          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)]">كلمة المرور *</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="gsd-input w-full pr-10 pl-3 py-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-sm"
              />
            </div>
          </div>

          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold [color:var(--gs-foreground-secondary)]">تأكيد كلمة المرور *</label>
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
              'إنشاء حساب جديد'
            )}
          </button>
        </form>

        <div className="text-center border-t border-[var(--gs-border-subtle)] pt-4 text-xs text-[var(--gs-foreground-secondary)]">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
