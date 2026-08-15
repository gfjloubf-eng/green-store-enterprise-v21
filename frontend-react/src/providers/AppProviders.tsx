import type { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { RTLProvider } from './RTLProvider';
import { AuthProvider } from './AuthProvider';
import { CartProvider } from '@/features/marketplace/cartState';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders — Composes all application-level context providers.
 * Order matters: AuthProvider depends on nothing,
 * ThemeProvider, RTLProvider, and CartProvider are composed.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <RTLProvider>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </RTLProvider>
    </ThemeProvider>
  );
}
