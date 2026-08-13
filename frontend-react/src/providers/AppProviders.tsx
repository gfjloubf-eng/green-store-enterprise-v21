import type { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { RTLProvider } from './RTLProvider';
import { AuthProvider } from './AuthProvider';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders — Composes all application-level context providers.
 * Order matters: AuthProvider depends on nothing,
 * ThemeProvider and RTLProvider are independent.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <RTLProvider>
        <AuthProvider>{children}</AuthProvider>
      </RTLProvider>
    </ThemeProvider>
  );
}
