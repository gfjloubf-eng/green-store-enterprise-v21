import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout — Thin wrapper around AppShell for backward compatibility.
 *
 * Usage (legacy):
 *   <Layout><Page /></Layout>
 *
 * Usage (preferred — AppShell):
 *   <Route element={<AppShell />}>...routes...</Route>
 */
export function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}

export { AppShell } from '@/components/layout/AppShell';

