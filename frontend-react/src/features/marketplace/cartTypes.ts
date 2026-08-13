import type { ProductDTO } from '../products/domain/productDTO';

export interface CartItem {
  product: ProductDTO;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
}
