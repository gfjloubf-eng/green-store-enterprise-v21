/* ============================================================
   cartState — Unified React cart context (single source of truth)
   Green Store Enterprise v2 (customer storefront)
   ============================================================
   CartContext is the ONLY React interface components use to read/write the
   cart. All operations delegate to the cartClient gateway which decides the
   storage/backend mode (guest → localStorage, signed-in → server cart).

   No operation is ever "optimistically" faked: a mutation reports success
   only after the gateway confirmed it, so no fake success message can ever
   appear inside a failure path.
   ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import type { AuthContextValue } from '@/types/auth';
import {
  addItemToCart,
  CART_UPDATED_EVENT,
  clearCart as clearCartApi,
  getCart,
  isGuestCartMode,
  removeCartItem,
  updateCartItem,
  type Cart,
  type CartItem,
} from '@/services/cartClient';
import type { CartTotals } from './cartTypes';
import { CART_ERROR_MESSAGES } from '@/lib/storefrontCommerce';

/** Lightweight product input used by ctx.add (UI passes the full DTO). */
export interface AddProductLike {
  id: string;
  name: string;
  sellingPrice: number;
  image?: string;
}

export interface CartActionResult {
  ok: boolean;
  message?: string;
}

interface CartContextValue {
  cart: Cart | null;
  items: CartItem[];
  totals: CartTotals;
  /** True while the initial/background cart load is in flight. */
  loading: boolean;
  /** Last Arabic error (load or operation). Cleared on the next success. */
  error: string | null;
  authMode: 'guest' | 'account';
  refresh: () => Promise<void>;
  add: (product: AddProductLike, quantity?: number) => Promise<CartActionResult>;
  increase: (itemId: string) => Promise<CartActionResult>;
  decrease: (itemId: string) => Promise<CartActionResult>;
  setQuantity: (itemId: string, quantity: number) => Promise<CartActionResult>;
  removeItem: (itemId: string) => Promise<CartActionResult>;
  clear: () => Promise<CartActionResult>;
  dismissError: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const EMPTY_TOTALS: CartTotals = {
  subtotal: 0,
  savings: 0,
  taxTotal: 0,
  deliveryTotal: 0,
  grandTotal: 0,
  totalQuantity: 0,
};

export function CartProvider({ children }: { children: ReactNode }) {
  // AuthProvider lives above CartProvider in the real tree; this provider is
  // also mounted standalone by legacy shells where guests only are used.
  const auth = useContext<AuthContextValue | undefined>(AuthContext);
  const isAuthenticated = Boolean(auth?.isAuthenticated);

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const opSeq = useRef(0);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (): Promise<void> => {
    const seq = ++opSeq.current;
    setLoading(true);
    try {
      const next = await getCart();
      if (seq !== opSeq.current) return; // a newer operation superseded this one
      setCart(next);
      setError(null);
    } catch (err) {
      if (seq !== opSeq.current) return;
      const message = err instanceof Error ? err.message : CART_ERROR_MESSAGES.loadFailed;
      setError(message);
    } finally {
      if (seq === opSeq.current) setLoading(false);
    }
  }, []);

  // Initial load + reload whenever the auth mode flips (login/logout).
  useEffect(() => {
    void load();
  }, [isAuthenticated, load]);

  // Keep every surface in sync with gateway writes coming from outside this
  // context (e.g. clearCart after order creation inside orderClient).
  useEffect(() => {
    const onCartEvent = () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => void load(), 120);
    };
    window.addEventListener(CART_UPDATED_EVENT, onCartEvent);
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      window.removeEventListener(CART_UPDATED_EVENT, onCartEvent);
    };
  }, [load]);

  const reportFailure = (message: string): CartActionResult => {
    setError(message);
    return { ok: false, message };
  };

  const add = useCallback(
    async (product: AddProductLike, quantity = 1): Promise<CartActionResult> => {
      if (!product?.id) return reportFailure(CART_ERROR_MESSAGES.noPrice);
      const seq = ++opSeq.current;
      setLoading(false);
      try {
        const next = await addItemToCart(product.id, quantity, {
          name: product.name,
          sellingPrice: product.sellingPrice,
          image: product.image,
        });
        if (seq === opSeq.current) {
          setCart(next);
          setError(null);
        }
        return { ok: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : CART_ERROR_MESSAGES.syncFailed;
        return reportFailure(message);
      }
    },
    [],
  );

  const setQuantity = useCallback(
    async (itemId: string, quantity: number): Promise<CartActionResult> => {
      const item = cart?.items.find((it) => it.id === itemId);
      if (!item) return reportFailure('العنصر غير موجود في السلة.');

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return removeItem(itemId);
      }

      const seq = ++opSeq.current;
      try {
        const next = await updateCartItem(itemId, Math.min(quantity, 99));
        if (seq === opSeq.current) {
          setCart(next);
          setError(null);
        }
        return { ok: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : CART_ERROR_MESSAGES.syncFailed;
        return reportFailure(message);
      }
    },
    [cart],
  );

  const removeItem = useCallback(
    async (itemId: string): Promise<CartActionResult> => {
      const item = cart?.items.find((it) => it.id === itemId);
      if (!item) return { ok: true };
      const seq = ++opSeq.current;
      try {
        const next = await removeCartItem(itemId);
        if (seq === opSeq.current) {
          setCart(next);
          setError(null);
        }
        return { ok: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : CART_ERROR_MESSAGES.syncFailed;
        return reportFailure(message);
      }
    },
    [cart],
  );

  const increase = useCallback(
    async (itemId: string): Promise<CartActionResult> => {
      const item = cart?.items.find((it) => it.id === itemId);
      if (!item) return { ok: true };
      return setQuantity(itemId, item.quantity + 1);
    },
    [cart, setQuantity],
  );

  const decrease = useCallback(
    async (itemId: string): Promise<CartActionResult> => {
      const item = cart?.items.find((it) => it.id === itemId);
      if (!item) return { ok: true };
      if (item.quantity <= 1) return removeItem(itemId);
      return setQuantity(itemId, item.quantity - 1);
    },
    [cart, removeItem, setQuantity],
  );

  const clear = useCallback(async (): Promise<CartActionResult> => {
    const seq = ++opSeq.current;
    try {
      await clearCartApi();
      if (seq !== opSeq.current) return { ok: true };
      setCart(null);
      setError(null);
      await load();
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : CART_ERROR_MESSAGES.syncFailed;
      return reportFailure(message);
    }
  }, [load]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  const dismissError = useCallback(() => setError(null), []);

  const items = useMemo(() => cart?.items ?? [], [cart]);

  const totals = useMemo<CartTotals>(() => {
    if (!cart) return EMPTY_TOTALS;
    return {
      subtotal: cart.subtotal ?? 0,
      savings: cart.savings ?? 0,
      taxTotal: cart.taxTotal ?? 0,
      deliveryTotal: cart.deliveryTotal ?? 0,
      grandTotal: cart.grandTotal ?? 0,
      totalQuantity: cart.totalQuantity ?? 0,
    };
  }, [cart]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      items,
      totals,
      loading,
      error,
      authMode: cart?.mode ?? (isGuestCartMode() ? 'guest' : 'account'),
      refresh,
      add,
      increase,
      decrease,
      setQuantity,
      removeItem,
      clear,
      dismissError,
    }),
    [cart, items, totals, loading, error, refresh, add, increase, decrease, setQuantity, removeItem, clear, dismissError],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
}
