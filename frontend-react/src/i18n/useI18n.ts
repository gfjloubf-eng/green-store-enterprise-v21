/* ============================================================
   GSDS v1.1 — useI18n Hook
   Access translations with RTL direction awareness
   ============================================================ */

import { useMemo, useCallback } from 'react';
import { useRTL } from '@/hooks/useRTL';
import { translations, DEFAULT_LOCALE, type Locale, type Translations } from './locale';

export type TranslationKey = keyof Translations;

interface I18nContextValue {
  /** Current locale */
  locale: Locale;
  /** Translate a key with optional interpolation variables */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  /** All translations for the current locale */
  translations: Translations;
}

/**
 * useI18n — Hook to access translations.
 * Automatically uses the current RTL direction to determine locale.
 */
export function useI18n(): I18nContextValue {
  const { isRTL } = useRTL();

  const locale: Locale = useMemo(() => (isRTL ? 'ar' : 'en'), [isRTL]);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      let text = translations[locale][key] ?? translations[DEFAULT_LOCALE][key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(`{${k}}`, String(v));
        }
      }
      return text;
    },
    [locale],
  );

  return useMemo(
    () => ({ locale, t, translations: translations[locale] }),
    [locale, t],
  );
}

