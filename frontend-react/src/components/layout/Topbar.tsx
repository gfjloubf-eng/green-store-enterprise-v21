import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Menu, X, LogOut, ShoppingCart, LogIn, Settings, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/useI18n';
import { useAuth } from '@/hooks/useAuth';
import { BreadcrumbEngine } from './BreadcrumbEngine';
import { LogoPlaceholder } from '@/components/ui/LogoPlaceholder';
import { getCart } from '@/services/cartClient';
import { useTheme } from '@/hooks/useTheme';
import {
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationItem,
} from '@/services/notificationClient';
import { isManagementRole } from '@/utils/authRoles';

/* ─── Props ────────────────────────────────────────────────── */

interface TopbarProps {
  /** Called when the hamburger menu is clicked (mobile) */
  onMenuClick: () => void;
  /** Whether mobile sidebar drawer is currently open */
  mobileOpen?: boolean;
  /** Public storefront mode uses a lighter commerce-focused header. */
  storefront?: boolean;
  /** Optional class name override */
  className?: string;
}

/* ─── Topbar ───────────────────────────────────────────────── */

export function Topbar({ onMenuClick, mobileOpen = false, storefront = false, className }: TopbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const managementUser = Boolean(
    user &&
      !storefront &&
      (isManagementRole(user.role) || (Array.isArray(user.roles) && user.roles.some(isManagementRole))),
  );

  useEffect(() => {
    getCart().then((c) => {
      if (c?.items) {
        const total = c.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    }).catch(() => setCartCount(0));
  }, [location.pathname]);

  useEffect(() => {
    if (!managementUser) return;

    let active = true;
    const loadNotifications = async () => {
      try {
        const result = await getUserNotifications();
        if (active) {
          setNotifications(result?.items ?? []);
          setUnreadCount(result?.unreadCount ?? 0);
        }
      } catch {
        // Notification failures must not affect the rest of the admin shell.
      }
    };

    void loadNotifications();
    const intervalId = window.setInterval(() => void loadNotifications(), 30_000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [managementUser, location.pathname]);

  useEffect(() => {
    if (!notificationsOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notificationsOpen]);

  const handleMarkAllNotificationsAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await markAllNotificationsAsRead();
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      setUnreadCount(0);
    } catch {
      // Keep the current state if the request fails; the next poll will reconcile it.
    }
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications((current) =>
          current.map((item) => (item.id === notification.id ? { ...item, read: true } : item)),
        );
        setUnreadCount((count) => Math.max(0, count - 1));
      } catch {
        // Navigation remains available even if marking as read fails.
      }
    }

    let payload: Record<string, unknown> = {};
    if (notification.payload) {
      try {
        payload = JSON.parse(notification.payload) as Record<string, unknown>;
      } catch {
        payload = {};
      }
    }

    setNotificationsOpen(false);
    if (payload.orderId) navigate(`/admin/orders?orderId=${encodeURIComponent(String(payload.orderId))}`);
    else if (payload.customerId) navigate(`/admin/customers?customerId=${encodeURIComponent(String(payload.customerId))}`);
  };

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
      {/* Storefront brand; the menu trigger is only needed when the admin sidebar exists. */}
      <div className="flex items-center gap-2 min-w-0">
        {!storefront && (
          <button
            type="button"
            onClick={onMenuClick}
            data-sidebar-toggle="true"
            aria-expanded={mobileOpen}
            className="flex lg:hidden items-center justify-center rounded-xl p-2.5 touch-manipulation min-h-[44px] min-w-[44px] [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors shrink-0"
            aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            title={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        )}

        <div
          className={cn('flex items-center cursor-pointer min-w-0', storefront ? 'lg:flex' : 'lg:hidden')}
          onClick={() => navigate('/')}
        >
          <LogoPlaceholder size="sm" showText />
        </div>
      </div>

      {/* Desktop/Tablet Breadcrumb or storefront search placeholder space */}
      {!storefront && <BreadcrumbEngine className="hidden lg:flex flex-1 min-w-0" />}
      {storefront && <div className="hidden sm:block flex-1" aria-hidden="true" />}

      {/* Header Actions (Desktop & Mobile) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Theme toggle (Desktop & Mobile) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="relative rounded-xl p-2.5 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
          title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Cart button (Desktop & Mobile) */}
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="relative rounded-xl p-2.5 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="السلة / Cart"
          title="السلة / Cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>

        {/* Administration notifications */}
        {managementUser && (
          <div ref={notificationsRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              className="relative flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg p-2 [color:var(--gs-foreground-secondary)] transition-colors hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)]"
              aria-label={t('profile.notifications') || 'الإشعارات'}
              title={t('profile.notifications') || 'الإشعارات'}
              aria-expanded={notificationsOpen}
              aria-haspopup="menu"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-sm">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div
                role="menu"
                className="absolute right-0 top-12 z-[70] w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border shadow-xl [background:var(--gs-surface)] [border-color:var(--gs-border)]"
              >
                <div className="flex items-center justify-between gap-3 border-b px-4 py-3 [border-color:var(--gs-border)]">
                  <div>
                    <p className="text-sm font-bold [color:var(--gs-foreground)]">الإشعارات</p>
                    <p className="text-[11px] [color:var(--gs-foreground-secondary)]">
                      {unreadCount > 0 ? `${unreadCount} غير مقروءة` : 'لا توجد إشعارات غير مقروءة'}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => void handleMarkAllNotificationsAsRead()}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline"
                    >
                      تحديد الكل كمقروء
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-xs [color:var(--gs-foreground-secondary)]">لا توجد إشعارات حتى الآن.</p>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        role="menuitem"
                        onClick={() => void handleNotificationClick(notification)}
                        className={cn(
                          'flex w-full flex-col gap-1 border-b px-4 py-3 text-right transition-colors hover:[background:var(--gs-muted)] [border-color:var(--gs-border)]',
                          !notification.read && '[background:var(--gs-primary-soft)]',
                        )}
                      >
                        <span className="flex items-start gap-2 text-xs font-bold [color:var(--gs-foreground)]">
                          {!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />}
                          <span>{notification.title}</span>
                        </span>
                        <span className="text-[11px] leading-5 [color:var(--gs-foreground-secondary)]">{notification.body}</span>
                        <span className="text-[10px] [color:var(--gs-foreground-secondary)]">
                          {new Intl.DateTimeFormat('ar-YE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(notification.createdAt))}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings remains available to the admin shell; the storefront keeps the header focused. */}
        {!storefront && (
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="rounded-xl p-2.5 [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={t('nav.settings') || 'الإعدادات'}
            title={t('nav.settings') || 'الإعدادات'}
          >
            <Settings className="h-5 w-5" />
          </button>
        )}

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
