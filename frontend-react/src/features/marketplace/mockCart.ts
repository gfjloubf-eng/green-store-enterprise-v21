import type { CartItem } from './cartTypes';
import type { ProductDTO } from '../products/domain/productDTO';
import { MOCK_PRODUCTS } from '../products/mock/products';

// Simple mock: first two products mapped to the cart DTO contract.
export const mockCart: CartItem[] = MOCK_PRODUCTS.slice(0, 2).map((product, index) => {
  const cartProduct: ProductDTO = {
    ...product,
    description: product.name,
    tax: 0,
    discount: 0,
    minStock: 0,
    maxStock: 0,
    trackInventory: false,
  };

  return {
    product: cartProduct,
    quantity: index === 0 ? 2 : 1,
  };
});
