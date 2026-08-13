import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      setError('Please enter your email/username and password');
      return;
    }

    setLoading(true);
    try {
      await auth.login(identifier, password);
      navigate('/');
    } catch (err: any) {
      if (err?.status === 401 || err?.message === 'invalid_credentials' || err?.code === 'unauthorized') {
        setError('Invalid credentials. Please check your email and password.');
      } else {
        setError(err?.message ?? 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--gs-background)] px-4 py-8">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border bg-[var(--gs-surface)] [border-color:var(--gs-border)]">
        <div className="flex flex-col items-center mb-6 text-center">
          <LogoPlaceholder size="lg" showText className="mb-4" />
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)]">Sign in to Green Store</h1>
          <p className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">Enterprise Management Portal</p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 [color:var(--gs-foreground-secondary)]" htmlFor="identifier">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 [color:var(--gs-foreground-muted)]" />
              <input
                id="identifier"
                name="identifier"
                type="text"
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl bg-[var(--gs-background)] [border-color:var(--gs-border)] [color:var(--gs-foreground)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 [color:var(--gs-foreground-secondary)]" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 [color:var(--gs-foreground-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="w-full pl-9 pr-10 py-2 text-sm border rounded-xl bg-[var(--gs-background)] [border-color:var(--gs-border)] [color:var(--gs-foreground)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-2.5 text-[color:var(--gs-foreground-muted)] hover:[color:var(--gs-foreground)] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs cursor-pointer [color:var(--gs-foreground-secondary)]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Signing in...</span>
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-[var(--gs-border-subtle)] pt-4 text-xs text-[var(--gs-foreground-secondary)]">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="font-semibold text-emerald-600 hover:underline"
          >
            Create Customer Account
          </button>
        </div>
      </div>
    </div>
  );
}

