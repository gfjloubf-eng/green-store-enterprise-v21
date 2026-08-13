import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ThemeContextValue, ThemeMode } from '@/types/theme';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'gsd-theme';
const DEFAULT_MODE: ThemeMode = 'dark';

/**
 * Reads the initial theme from:
 * 1. The data-theme attribute already set by the flash prevention script in index.html
 * 2. localStorage as fallback
 * 3. System preference as last resort
 */
function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_MODE;
  // Trust the flash prevention script in index.html that already set data-theme
  const htmlTheme = document.documentElement.getAttribute('data-theme');
  if (htmlTheme === 'dark' || htmlTheme === 'light') return htmlTheme;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return DEFAULT_MODE;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({ children, defaultMode }: ThemeProviderProps) {
  // Initialize from the DOM attribute set by flash prevention script
  const [mode, setModeState] = useState<ThemeMode>(defaultMode ?? getInitialMode);

  const applyTheme = useCallback((newMode: ThemeMode) => {
    document.documentElement.setAttribute('data-theme', newMode);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setModeState(newMode);
      applyTheme(newMode);
    },
    [applyTheme],
  );

  const toggle = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  // Apply initial theme on mount (synchronize React state with DOM)
  useEffect(() => {
    applyTheme(mode);
  }, [mode, applyTheme]);

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setMode(e.matches ? 'light' : 'dark');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      toggle,
      setMode,
      isDark: mode === 'dark',
      isLight: mode === 'light',
    }),
    [mode, toggle, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
