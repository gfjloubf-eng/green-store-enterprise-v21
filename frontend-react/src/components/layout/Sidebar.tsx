import { useRef, useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import { useRTL } from '@/hooks/useRTL';
import { useAuth } from '@/hooks/useAuth';
import type { NavGroup, NavItem } from '@/types/navigation';
import { LogoPlaceholder } from '@/components/ui/LogoPlaceholder';

/* ─── Props ────────────────────────────────────────────────── */

interface SidebarProps {
  /** Navigation groups to render */
  groups: NavGroup[];
  /** Whether the sidebar is expanded (desktop) */
  expanded: boolean;
  /** Toggle expanded state */
  onToggleExpanded: () => void;
  /** Whether the mobile overlay is open */
  mobileOpen: boolean;
  /** Close the mobile overlay */
  onMobileClose: () => void;
}

/* ─── Child Item (recursive) ──────────────────────────────── */

interface ChildItemProps {
  item: NavItem;
  depth: number;
  mobileOpen: boolean;
  onNavigate: () => void;
}

function ChildItem({ item, depth, mobileOpen, onNavigate }: ChildItemProps) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.path === location.pathname;

  const handleClick = useCallback(() => {
    if (hasChildren) {
      setOpen((prev) => !prev);
    } else if (item.path) {
      onNavigate();
    }
  }, [hasChildren, item.path, onNavigate]);

  return (
    <li>
      <button
        type="button"
        disabled={item.disabled}
        onClick={handleClick}
        className={cn(
          'gsd-sidebar-item group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
          mobileOpen && 'min-h-[56px] rounded-2xl px-4 py-3 text-base gap-4',
          isActive
            ? 'gsd-sidebar-item--active'
            : '[color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)]',
          item.disabled && 'opacity-40 cursor-not-allowed',
        )}
        style={{ paddingInlineStart: `${12 + depth * 16}px` }}
        title={item.label}
      >
        {item.icon && (
          <item.icon className={cn('shrink-0', mobileOpen ? 'h-6 w-6' : 'h-5 w-5')} aria-hidden="true" />
        )}
        <span className={cn('gsd-sidebar-label flex-1 text-left truncate', mobileOpen && 'text-base font-medium')}>
          {item.label}
        </span>
        {hasChildren && (
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 transition-transform duration-150',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        )}
        {item.badge != null && item.badge > 0 && (
          <span className={cn(
            'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
            mobileOpen ? '[background:var(--gs-primary-soft)] [color:var(--gs-primary)]' : 'bg-emerald-500/20 text-emerald-400',
          )}>
            {item.badge}
          </span>
        )}
      </button>

      {hasChildren && open && (
        <ul className="mt-1 space-y-0.5" role="list">
          {item.children!.map((child) => (
            <ChildItem
              key={child.id}
              item={child}
              depth={depth + 1}
              mobileOpen={mobileOpen}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/* ─── Sidebar ──────────────────────────────────────────────── */

export function Sidebar({
  groups,
  expanded,
  onToggleExpanded,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLElement>(null);
  const { t } = useI18n();
  const { isRTL } = useRTL();
  const { user, logout, isAuthenticated, hasPermission, hasRole } = useAuth();
  const showMobileExpanded = expanded || mobileOpen;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const isItemVisible = useCallback((item: NavItem): boolean => {
    if (item.authRequired && !isAuthenticated) return false;
    if (item.publicOnly && isAuthenticated) return false;
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) return false;
    if (item.requiredRoles?.length && !item.requiredRoles.some((role) => hasRole(role))) return false;
    if (item.requiredRole && !hasRole(item.requiredRole)) return false;
    return true;
  }, [isAuthenticated, hasPermission, hasRole]);

  /* Close mobile overlay on outside click */
  useClickOutside(sidebarRef, useCallback(() => {
    if (mobileOpen) onMobileClose();
  }, [mobileOpen, onMobileClose]));

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    onMobileClose();
  }, [navigate, onMobileClose]);

  const renderSidebarContent = () => (
    <>
      {/* Brand / Logo area */}
      <div className="flex h-16 items-center justify-between border-b px-4 [border-color:var(--gs-border)]">
        {showMobileExpanded ? (
          <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => handleNavigate('/')}>
            <LogoPlaceholder size="lg" showText className="min-w-0" />
          </div>
        ) : (
          <div className="mx-auto cursor-pointer" onClick={() => handleNavigate('/')}>
            <LogoPlaceholder size="md" showText={false} />
          </div>
        )}
        <button
          type="button"
          onClick={onToggleExpanded}
          className="hidden lg:flex items-center justify-center rounded-lg p-1.5 [color:var(--gs-foreground-muted)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground-secondary)] transition-colors"
          aria-label={expanded ? t('nav.sidebar') : t('nav.sidebar')}
        >
          {expanded ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Mobile Drawer User Profile Header */}
      {mobileOpen && (
        <div className="p-3 border-b [border-color:var(--gs-border)] bg-[var(--gs-muted)]/50">
          {user ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={() => handleNavigate('/profile')}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold [background:var(--gs-primary-soft)] [color:var(--gs-primary)] border border-emerald-500/30">
                  {initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate [color:var(--gs-foreground)]">{user.name}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase">{user.role ?? 'User'}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-xs font-medium shrink-0"
                title="تسجيل الخروج"
              >
                خروج
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNavigate('/login')}
                className="gsd-btn gsd-btn--primary gsd-btn--sm w-full rounded-xl text-xs py-2 font-bold"
              >
                تسجيل الدخول
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto p-3 scrollbar-none">
        {groups.map((group) => {
          const visibleItems = group.items.filter(isItemVisible);
          if (visibleItems.length === 0) return null;

          const groupLabelKey = getGroupLabelKey(group.label);
          return (
            <div key={group.label} className="mb-4">
              {expanded && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest [color:var(--gs-foreground-muted)]">
                  {t(groupLabelKey) || group.label}
                </p>
              )}
              <ul className="space-y-0.5" role="list">
                {visibleItems.map((item) => {
                  const itemLabelKey = getItemLabelKey(item.id);
                  const displayLabel = itemLabelKey ? t(itemLabelKey) : item.label;
                  const hasChildren = item.children && item.children.length > 0;
                  const isActive = item.path === window.location.pathname;

                  if (hasChildren && showMobileExpanded) {
                    return (
                      <ChildItem
                        key={item.id}
                        item={{
                          ...item,
                          label: displayLabel,
                        }}
                        depth={0}
                        mobileOpen={mobileOpen}
                        onNavigate={() => item.path && handleNavigate(item.path)}
                      />
                    );
                  }
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        disabled={item.disabled}
                        onClick={() => item.path && handleNavigate(item.path)}
                        className={cn(
                          'gsd-sidebar-item group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
                          mobileOpen && 'min-h-[56px] rounded-2xl px-4 py-3 text-base gap-4',
                          isActive
                            ? 'gsd-sidebar-item--active'
                            : '[color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)] hover:[color:var(--gs-foreground)]',
                          item.disabled && 'opacity-40 cursor-not-allowed',
                          !expanded && !mobileOpen && 'justify-center px-2',
                        )}
                        title={displayLabel}
                      >
                        {item.icon && (
                          <item.icon className={cn('shrink-0', mobileOpen ? 'h-6 w-6' : 'h-5 w-5')} aria-hidden="true" />
                        )}
                        {(expanded || mobileOpen) && (
                          <>
                            <span className={cn('flex-1 text-left truncate', mobileOpen && 'text-base font-medium')}>
                              {displayLabel}
                            </span>
                            {item.badge != null && item.badge > 0 && (
                              <span className={cn(
                                'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
                                mobileOpen ? '[background:var(--gs-primary-soft)] [color:var(--gs-primary)]' : '',
                              )}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </>
  );

  /* Lock background scroll and handle ESC to close mobile overlay */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onMobileClose();
      };
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('keydown', onKey);
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [mobileOpen, onMobileClose]);

  /* Publish mobile open state so other UI (Topbar) can react without
     changing app-level wiring. This keeps Topbar and Sidebar decoupled
     but allows the hamburger icon to reflect the current mobile state. */
  useEffect(() => {
    try {
      const ev = new CustomEvent('sidebar:mobile-toggle', { detail: { open: mobileOpen } });
      window.dispatchEvent(ev);
    } catch (e) {
      // ignore
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile drawer below 768px */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            onClick={onMobileClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Close menu"
          />
          <aside
            ref={sidebarRef}
            data-state={expanded ? 'expanded' : 'collapsed'}
            data-mobile-open="true"
            className={cn(
              'relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-background)] shadow-2xl transition-transform duration-250 ease-standard',
              'w-[80%] max-w-[300px]',
              isRTL ? 'ml-auto' : ''
            )}
            aria-label={t('nav.sidebar')}
            style={{ transform: 'translateZ(0)' }}
          >
            {renderSidebarContent()}
          </aside>
        </div>
      )}
 
      {/* Desktop/tablet sidebar unchanged */}
      <aside
        ref={!mobileOpen ? sidebarRef : null}
        data-state={expanded ? 'expanded' : 'collapsed'}
        data-mobile-open={mobileOpen ? 'true' : 'false'}
        className={cn(
          'gsd-sidebar hidden md:flex fixed top-0 bottom-0 z-50 flex-col border-r transition-transform duration-250 ease-standard',
          '[background:var(--gs-background)] [border-color:var(--gs-border)]',
          'lg:static lg:z-auto',
          'lg:shadow-none shadow-2xl lg:rounded-none rounded-tr-3xl rounded-br-3xl overflow-hidden',
          // keep transform logic for mobile/tablet show/hide
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label={t('nav.sidebar')}
        // desktop width uses CSS variables
        style={{
          width: expanded ? 'var(--gs-sidebar-width)' : 'var(--gs-sidebar-collapsed)'
        }}
      >
        {renderSidebarContent()}
      </aside>
    </>
  );
}

/* ─── Label Key Helpers ─────────────────────────────────────── */

function getGroupLabelKey(label: string): TranslationKey {
  const map: Record<string, TranslationKey> = {
    'Main Menu': 'sidebar.mainMenu',
    'Catalog': 'sidebar.catalog',
    'Inventory': 'sidebar.inventory',
    'Suppliers': 'sidebar.suppliers',
    'UI Library': 'sidebar.uiLibrary',
    'System': 'sidebar.system',
  };
  return map[label] as TranslationKey;
}

function getItemLabelKey(id: string): TranslationKey {
  const map: Record<string, TranslationKey> = {
    'home': 'nav.home',
    'workspace': 'nav.workspace',
    'products': 'nav.products',
    'categories': 'nav.categories',
    'brands': 'nav.brands',
    'units': 'nav.units',
    'barcode': 'nav.barcode',
    'inventoryDashboard': 'nav.inventoryDashboard',
    'stockOverview': 'nav.stockOverview',
    'stockMovements': 'nav.stockMovements',
    'stockAdjustment': 'nav.stockAdjustment',
    'stockTransfer': 'nav.stockTransfer',
    'lowStock': 'nav.lowStock',
    'outOfStock': 'nav.outOfStock',
    'inventoryReports': 'nav.inventoryReports',
    'components': 'nav.components',
    'layouts': 'nav.layouts',
    'layouts-sidebar': 'nav.sidebar',
    'layouts-grid': 'nav.grid',
    'settings': 'nav.settings',
'help': 'nav.help',
    'suppliersDashboard': 'nav.suppliersDashboard',
    'suppliersList': 'nav.suppliersList',
    'supplierCategories': 'nav.supplierCategories',
    'supplierContacts': 'nav.supplierContacts',
    'supplierReports': 'nav.supplierReports',
  };
  return map[id] as TranslationKey;
}
