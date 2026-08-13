import type { CartItem } from './cartTypes';

export default function CartItemRow({ item, onSet }: { item: CartItem; onSet: (q: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <img src={item.product.image || '/placeholder.svg'} alt="" className="w-14 h-14 rounded object-cover" />
      <div className="flex-1">
        <div className="font-medium text-sm">{item.product.name}</div>
        <div className="text-xs text-muted">{item.product.category?.name}</div>
      </div>
      <div className="flex flex-col items-end">
        <div className="font-semibold">{(item.product.sellingPrice * item.quantity).toFixed(2)} ر.س</div>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => onSet(Math.max(0, item.quantity - 1))} className="w-8 h-8 bg-gray-100 rounded">−</button>
          <div className="w-10 text-center">{item.quantity}</div>
          <button onClick={() => onSet(item.quantity + 1)} className="w-8 h-8 bg-green-600 text-white rounded">+</button>
        </div>
      </div>
    </div>
  );
}
