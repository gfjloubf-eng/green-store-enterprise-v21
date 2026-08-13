export type ThemeMode = 'dark' | 'light';

export interface ThemeContextValue {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  isLight: boolean;
}
