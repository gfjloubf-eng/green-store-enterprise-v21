import { createRoot } from 'react-dom/client';
import { CartProvider } from './cartState';
import CartFloatingButton from './CartFloatingButton';
import CartDrawer from './CartDrawer';

// Mount a global cart UI into document.body so it is available app-wide without modifying App providers.
const id = '__global_cart_mount__';
let container = document.getElementById(id);
if (!container) {
  container = document.createElement('div');
  container.id = id;
  document.body.appendChild(container);
}

const root = createRoot(container);
root.render(
  <CartProvider>
    <CartFloatingButton />
    <CartDrawer />
  </CartProvider>
);

export {};
