/* ============================================================
   GSDS v1.0 — AppShell Component
   Application shell composing Sidebar, Topbar, Footer and
   a main content area rendered via <Outlet />.
   ============================================================ */

import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { navConfig } from '@/config/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Footer } from './Footer';

/* ─── AppShell ─────────────────────────────────────────────── */

import { FloatingSupport } from '@/components/support/FloatingSupport';

export function AppShell() {
  const [expanded, setExpanded] = useState(true);
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
      {/* Sidebar */}
      <Sidebar
        groups={navConfig}
        expanded={expanded}
        onToggleExpanded={handleToggleExpanded}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <Topbar onMenuClick={handleMobileToggle} />

        {/* Content */}
        <main
          className={cn(
            'gsd-main flex-1 overflow-y-auto p-6',
            'scrollbar-none',
          )}
        >
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Global Floating Support Widget */}
      <FloatingSupport />
    </div>
  );
}

