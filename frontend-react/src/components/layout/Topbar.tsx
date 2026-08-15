import { useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, Menu, X, Languages, Search, LogOut, ShoppingCart, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useRTL } from '@/hooks/useRTL';
import { useI18n } from '@/i18n/useI18n';
import { useAuth } from '@/hooks/useAuth';
import { BreadcrumbEngine } from './BreadcrumbEngine';
import { LogoPlaceholder } from '@/components/ui/LogoPlaceholder';

/* ─── Props ────────────────────────────────────────────────── */

interface TopbarProps {
  /** Called when the hamburger menu is clicked (mobile) */
  onMenuClick: () => void;
  /** Whether mobile sidebar drawer is currently open */
  mobileOpen?: boolean;
  /** Optional class name override */
  className?: string;
}

/* ─── Topbar ───────────────────────────────────────────────── */

export function Topbar({ onMenuClick, mobileOpen = false, className }: TopbarProps) {
  const navigate = useNavigate();
  const { isDark, toggle: toggleTheme } = useTheme();
  const { isRTL, toggle: toggleDirection } = useRTL();
  const { t } = useI18n();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header
      className={cn(
        'gsd-topbar sticky top-0 z-50 md:relative md:z-auto shadow-sm md:shadow-none md:static flex h-16 items-center gap-3 border-b px-4 sm:px-5',
        '[background:var(--gs-surface)] [border-color:var(--gs-border)]',
        className,
      )}
    >
      {/* Hamburger — mobile only */}
      <button
        type="button"
        onClick={onMenuClick}
        data-sidebar-toggle="true"
        aria-expanded={mobileOpen}
        className="flex lg:hidden items-center justify-center rounded-lg p-3 touch-manipulation min-h-[44px] [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors"
        aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
        title={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile logo centered */}
      <div className="absolute inset-x-0 flex items-center justify-center lg:hidden pointer-events-none" style={{ height: '100%' }}>
        <div className="mx-auto pointer-events-auto cursor-pointer" onClick={() => navigate('/')}>
          <LogoPlaceholder size="lg" showText />
        </div>
      </div>

      {/* Breadcrumb on desktop/tablet only */}
      <BreadcrumbEngine className="hidden lg:flex flex-1 min-w-0" />

      {/* Desktop action icons */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Cart button */}
        {user && (
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="rounded-lg p-2 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors"
            aria-label="السلة / Cart"
            title="السلة / Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        )}

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors"
          aria-label={t('theme.toggle')}
          title={isDark ? t('theme.light') : t('theme.dark')}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* RTL toggle */}
        <button
          type="button"
          onClick={toggleDirection}
          className="rounded-lg p-2 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors"
          aria-label={t('direction.toggle')}
          title={isRTL ? t('direction.ltr') : t('direction.rtl')}
        >
          <Languages className="h-4 w-4" />
        </button>

        {/* Notification placeholder */}
        {user && (
          <button
            type="button"
            className="relative rounded-lg p-2 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors"
            aria-label={t('profile.notifications')}
            title={t('profile.notifications')}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full [background:var(--gs-primary)]" />
          </button>
        )}

        {/* User profile & Logout OR Guest Login button */}
        {user ? (
          <div className="ml-2 flex items-center gap-2 border-l pl-3 [border-color:var(--gs-border)]">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
              <div className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold [background:var(--gs-primary-soft)] [color:var(--gs-primary)]">
                {initials}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-medium truncate max-w-[120px] [color:var(--gs-foreground)]">{user.name}</span>
                <span className="text-[10px] text-emerald-600 font-semibold uppercase">{user.role ?? 'User'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="ml-1 rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="gsd-btn gsd-btn--primary gsd-btn--sm inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-xl"
          >
            <LogIn className="h-3.5 w-3.5" />
            تسجيل الدخول
          </button>
        )}
      </div>


      {/* Mobile action controls (Theme toggle & Language toggle) */}
      <div className="ml-auto flex items-center gap-1 lg:hidden">
        <button
          type="button"
          onClick={toggleDirection}
          className="rounded-xl p-2.5 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={t('direction.toggle')}
          title={isRTL ? t('direction.ltr') : t('direction.rtl')}
        >
          <Languages className="h-5 w-5 text-emerald-600" />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-xl p-2.5 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={t('theme.toggle')}
          title={isDark ? t('theme.light') : t('theme.dark')}
        >
          {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-500" />}
        </button>

        <button
          type="button"
          className="rounded-xl p-2.5 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={t('common.search')}
          title={t('common.search')}
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

