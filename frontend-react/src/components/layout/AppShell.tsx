/* ============================================================
   GSDS v1.0 — AppShell Component
   Application shell composing Sidebar, Topbar, Footer and
   a main content area rendered via <Outlet />.
   ============================================================ */

import { useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { navConfig } from '@/config/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Footer } from './Footer';

/* ─── AppShell ─────────────────────────────────────────────── */

import { FloatingSupport } from '@/components/support/FloatingSupport';
import CartDrawer from '@/features/marketplace/CartDrawer';
import { MobileBottomNav } from './MobileBottomNav';

export function AppShell() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);

  const isStorefront =
    location.pathname === '/' ||
    location.pathname === '/products' ||
    /^\/products\/[^/]+$/.test(location.pathname) ||
    ['/cart', '/settings', '/about', '/contact', '/help', '/support', '/stores'].some(
      (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    );
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <div className="gsd-appshell flex h-screen overflow-hidden [background:var(--gs-background)]" dir="inherit">
      {/* Storefront pages use a focused commerce shell; admin pages keep the full sidebar. */}
      {!isStorefront && (
        <Sidebar
          groups={navConfig}
          expanded={expanded}
          onToggleExpanded={handleToggleExpanded}
          mobileOpen={mobileOpen}
          onMobileClose={handleMobileClose}
        />
      )}

      {/* Main area */}
      <div className={cn('flex flex-1 flex-col min-w-0', isStorefront && 'w-full')}>
        {/* Topbar */}
        <Topbar onMenuClick={handleMobileToggle} mobileOpen={mobileOpen} storefront={isStorefront} />

        {/* Content */}
        <main
          className={cn(
            'gsd-main flex-1 overflow-y-auto p-3.5 sm:p-6 pb-20 lg:pb-6',
            'scrollbar-none',
          )}
        >
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav storefront={isStorefront} />

      {/* Global Cart UI */}
      <CartDrawer />

      {/* Global Floating Support Widget */}
      <FloatingSupport />
    </div>
  );
}

