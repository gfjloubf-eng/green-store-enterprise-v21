export type Direction = 'rtl' | 'ltr';

export interface RTLContextValue {
  direction: Direction;
  toggle: () => void;
  setDirection: (dir: Direction) => void;
  isRTL: boolean;
  isLTR: boolean;
}
