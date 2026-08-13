import { createContext, useContext, useReducer, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, CartTotals } from './cartTypes';
import { mockCart } from './mockCart';

type Action =
  | { type: 'add'; product: CartItem['product']; quantity?: number }
  | { type: 'remove'; productId: string }
  | { type: 'set'; productId: string; quantity: number }
  | { type: 'clear' };

type State = { items: CartItem[] };

const initialState: State = { items: mockCart };

function totalsFromItems(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((s, it) => s + it.product.sellingPrice * it.quantity, 0);
  const discount = items.reduce((s, it) => s + (it.product.discount || 0) * it.quantity, 0);
  const delivery = items.length ? 3.0 : 0.0;
  const total = Math.max(0, subtotal - discount) + delivery;
  return { subtotal, discount, delivery, total };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const idx = state.items.findIndex(i => i.product.id === action.product.id);
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = { ...items[idx], quantity: items[idx].quantity + (action.quantity || 1) };
        return { items };
      }
      return { items: [...state.items, { product: action.product, quantity: action.quantity || 1 }] };
    }
    case 'remove': {
      return { items: state.items.filter(i => i.product.id !== action.productId) };
    }
    case 'set': {
      const items = state.items.map(i =>
        i.product.id === action.productId ? { ...i, quantity: Math.max(0, action.quantity) } : i,
      ).filter(i=>i.quantity>0);
      return { items };
    }
    case 'clear':
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<{
  items: CartItem[];
  totals: CartTotals;
  add: (product: CartItem['product'], quantity?: number) => void;
  remove: (productId: string) => void;
  set: (productId: string, quantity: number) => void;
  clear: () => void;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const add = (product: CartItem['product'], quantity = 1) => dispatch({ type: 'add', product, quantity });
  const remove = (productId: string) => dispatch({ type: 'remove', productId });
  const set = (productId: string, quantity: number) => dispatch({ type: 'set', productId, quantity });
  const clear = () => dispatch({ type: 'clear' });

  const totals = useMemo(() => totalsFromItems(state.items), [state.items]);

  return (
    <CartContext.Provider value={{ items: state.items, totals, add, remove, set, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
}
