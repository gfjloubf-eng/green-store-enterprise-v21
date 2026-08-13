import { useContext } from 'react';
import { RTLContext } from '@/providers/RTLProvider';
import type { RTLContextValue } from '@/types/rtl';

export function useRTL(): RTLContextValue {
  const context = useContext(RTLContext);
  if (!context) {
    throw new Error('useRTL must be used within a RTLProvider');
  }
  return context;
}
