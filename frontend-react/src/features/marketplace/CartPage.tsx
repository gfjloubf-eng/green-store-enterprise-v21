import CartDrawer from './CartDrawer';
import CartFloatingButton from './CartFloatingButton';
import { CartProvider } from './cartState';

export default function CartPage() {
  return (
    <CartProvider>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">سلة التسوق</h2>
        <p className="mb-6">استخدم زر العائمة في الأسفل لفتح سلة التسوق، أو افتحها من أي مكان في التطبيق.</p>
        <CartFloatingButton />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
