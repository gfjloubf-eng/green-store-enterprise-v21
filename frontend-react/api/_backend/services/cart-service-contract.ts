import type { AddToCartDto, CartResponseDto, UpdateCartItemDto } from '../dto/cart';

export interface CartServiceContract {
  getCartForUser(userId: string, email?: string): Promise<CartResponseDto>;
  addItem(userId: string, data: AddToCartDto, email?: string): Promise<CartResponseDto>;
  updateItemQuantity(userId: string, cartItemId: string, data: UpdateCartItemDto, email?: string): Promise<CartResponseDto>;
  removeItem(userId: string, cartItemId: string, email?: string): Promise<CartResponseDto>;
  clearCart(userId: string, email?: string): Promise<CartResponseDto>;
}
