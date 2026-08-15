import { useNavigate } from 'react-router-dom';
import { Bell, Menu, X, LogOut, ShoppingCart, LogIn, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
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
        'gsd-topbar sticky top-0 z-50 md:relative md:z-auto shadow-sm md:shadow-none md:static flex h-16 items-center justify-between gap-2 px-3 sm:px-5',
        '[background:var(--gs-surface)] [border-color:var(--gs-border)] border-b',
        className,
      )}
    >
      {/* Mobile Left Section: Hamburger & Logo + Store Name visually connected */}
      <div className="flex items-center gap-2 lg:hidden min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          data-sidebar-toggle="true"
          aria-expanded={mobileOpen}
          className="flex items-center justify-center rounded-xl p-2.5 touch-manipulation min-h-[44px] min-w-[44px] [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors shrink-0"
          aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          title={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div
          className="flex items-center cursor-pointer min-w-0"
          onClick={() => navigate('/')}
        >
          <LogoPlaceholder size="sm" showText />
        </div>
      </div>

      {/* Desktop/Tablet Breadcrumb */}
      <BreadcrumbEngine className="hidden lg:flex flex-1 min-w-0" />

      {/* Header Actions (Desktop & Mobile) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Cart button (Desktop) */}
        {user && (
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="hidden lg:flex rounded-lg p-2 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors min-h-[40px] min-w-[40px] items-center justify-center"
            aria-label="السلة / Cart"
            title="السلة / Cart"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
          </button>
        )}

        {/* Notification placeholder (Desktop) */}
        {user && (
          <button
            type="button"
            className="hidden lg:flex relative rounded-lg p-2 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors min-h-[40px] min-w-[40px] items-center justify-center"
            aria-label={t('profile.notifications')}
            title={t('profile.notifications')}
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full [background:var(--gs-primary)]" />
          </button>
        )}

        {/* Centralized Settings Access Button (Desktop & Mobile) */}
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="rounded-xl p-2.5 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={t('nav.settings') || 'الإعدادات'}
          title={t('nav.settings') || 'الإعدادات'}
        >
          <Settings className="h-5 w-5" />
        </button>

        {/* Desktop User Profile & Logout OR Guest Login button */}
        <div className="hidden lg:flex items-center">
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

        {/* Mobile User Profile Avatar OR Login button */}
        <div className="flex lg:hidden items-center">
          {user ? (
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold [background:var(--gs-primary-soft)] [color:var(--gs-primary)] border border-emerald-500/30 shrink-0"
              aria-label={user.name}
              title={user.name}
            >
              {initials}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="gsd-btn gsd-btn--primary gsd-btn--xs rounded-xl px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1 min-h-[38px]"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>دخول</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
