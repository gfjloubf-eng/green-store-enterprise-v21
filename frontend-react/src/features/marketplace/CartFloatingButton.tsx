import { useCart } from './useCart';

export default function CartFloatingButton() {
  const { items, totals } = useCart();
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="fixed right-4 bottom-6 md:hidden z-50">
      <button
        aria-label="Open cart"
        title="Cart"
        className="bg-green-700 text-white rounded-full shadow-lg px-4 py-3 flex items-center gap-3"
        onClick={() => {
          // Emit simple event to open drawer — CartDrawer listens for it
          window.dispatchEvent(new CustomEvent('cart:open'));
        }}
      >
        <div className="flex flex-col text-left leading-none">
          <span className="text-sm font-semibold">{itemCount} items</span>
          <span className="text-xs opacity-90">{totals.total.toFixed(2)} ر.س</span>
        </div>
        <div className="bg-white/10 rounded-full w-11 h-11 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7m5-7v7m6-7v7m-9 0h10" />
          </svg>
        </div>
      </button>
    </div>
  );
}
