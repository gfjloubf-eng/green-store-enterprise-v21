import type { Cart, CartItem, Product, Customer } from '@prisma/client';

export type CartWithItems = Cart & {
  items: (CartItem & { product: Product })[];
};

export interface CartRepositoryContract {
  findOrCreateCartByCustomerId(customerId: string): Promise<CartWithItems>;
  findCartByCustomerId(customerId: string): Promise<CartWithItems | null>;
  findCartItemById(cartItemId: string): Promise<(CartItem & { cart: Cart; product: Product }) | null>;
  findCartItemByCartAndProduct(cartId: string, productId: string, variantId?: string | null): Promise<CartItem | null>;
  addItem(cartId: string, productId: string, variantId: string | null, quantity: number, unitPrice: number): Promise<CartItem>;
  updateItemQuantity(cartItemId: string, quantity: number): Promise<CartItem>;
  removeItem(cartItemId: string): Promise<void>;
  clearCart(cartId: string): Promise<void>;
  findCustomerByUserIdOrEmail(userId: string, email?: string): Promise<Customer | null>;
  createCustomerForUser(userId: string, email?: string): Promise<Customer>;
  findProductById(productId: string): Promise<Product | null>;
}
