import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Direction, RTLContextValue } from '@/types/rtl';

export const RTLContext = createContext<RTLContextValue | undefined>(undefined);

const STORAGE_KEY = 'gsd-direction';
const DEFAULT_DIRECTION: Direction = 'rtl';

function getInitialDirection(): Direction {
  if (typeof window === 'undefined') return DEFAULT_DIRECTION;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'rtl' || stored === 'ltr') return stored;
  return DEFAULT_DIRECTION;
}

interface RTLProviderProps {
  children: ReactNode;
  defaultDirection?: Direction;
}

export function RTLProvider({ children, defaultDirection }: RTLProviderProps) {
  const [direction, setDirectionState] = useState<Direction>(defaultDirection ?? getInitialDirection);

  const applyDirection = useCallback((dir: Direction) => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem(STORAGE_KEY, dir);
  }, []);

  const setDirection = useCallback(
    (dir: Direction) => {
      setDirectionState(dir);
      applyDirection(dir);
    },
    [applyDirection],
  );

  const toggle = useCallback(() => {
    setDirection(direction === 'rtl' ? 'ltr' : 'rtl');
  }, [direction, setDirection]);

  // Apply initial direction on mount
  useEffect(() => {
    applyDirection(direction);
  }, [direction, applyDirection]);

  const value = useMemo<RTLContextValue>(
    () => ({
      direction,
      toggle,
      setDirection,
      isRTL: direction === 'rtl',
      isLTR: direction === 'ltr',
    }),
    [direction, toggle, setDirection],
  );

  return <RTLContext.Provider value={value}>{children}</RTLContext.Provider>;
}
