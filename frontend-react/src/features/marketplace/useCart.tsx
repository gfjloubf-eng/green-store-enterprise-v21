import { useCartContext } from './cartState';

export function useCart() {
  return useCartContext();
}
