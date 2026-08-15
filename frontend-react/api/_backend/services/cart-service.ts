import BaseService from './base-service';
import type { CartServiceContract } from './cart-service-contract';
import type { CartRepositoryContract } from '../repositories/contracts/cart-repository-contract';
import type { AddToCartDto, CartResponseDto, CartItemResponseDto, UpdateCartItemDto } from '../dto/cart';
import { NotFoundException, ValidationException } from '../repositories/exceptions';
import { ForbiddenError } from '../authorization/errors';

export class CartService extends BaseService implements CartServiceContract {
  constructor(private readonly cartRepo: CartRepositoryContract) {
    super();
  }

  private createNotFound(message: string): NotFoundException {
    const err = new NotFoundException(message);
    (err as any).code = 'not_found';
    return err;
  }

  private async getCustomerAndCart(userId: string, email?: string) {
    if (!userId) {
      throw new ValidationException('user_id_required');
    }

    let customer = await this.cartRepo.findCustomerByUserIdOrEmail(userId, email);
    if (!customer) {
      customer = await this.cartRepo.createCustomerForUser(userId, email);
    }

    const cart = await this.cartRepo.findOrCreateCartByCustomerId(customer.id);
    return { customer, cart };
  }

  private formatCartResponse(cart: Awaited<ReturnType<CartRepositoryContract['findOrCreateCartByCustomerId']>>): CartResponseDto {
    const formattedItems: CartItemResponseDto[] = (cart.items ?? []).map((item) => {
      const lineTotal = Number((item.quantity * item.unitPrice).toFixed(2));
      return {
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal,
        product: item.product
          ? {
              id: item.product.id,
              name: item.product.name,
              sku: item.product.sku,
            }
          : null,
        createdAt: item.createdAt.toISOString(),
      };
    });

    const subtotal = Number(formattedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
    const totalQuantity = formattedItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = subtotal;

    return {
      id: cart.id,
      customerId: cart.customerId,
      items: formattedItems,
      subtotal,
      totalQuantity,
      total,
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString(),
    };
  }

  async getCartForUser(userId: string, email?: string): Promise<CartResponseDto> {
    const { cart } = await this.getCustomerAndCart(userId, email);
    return this.formatCartResponse(cart);
  }

  async addItem(userId: string, data: AddToCartDto, email?: string): Promise<CartResponseDto> {
    if (!data || typeof data !== 'object') {
      throw new ValidationException('cart_item_required');
    }

    if (!data.productId || typeof data.productId !== 'string' || !data.productId.trim()) {
      throw new ValidationException('product_id_required');
    }

    const quantity = data.quantity ?? 1;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationException('invalid_quantity');
    }

    const product = await this.cartRepo.findProductById(data.productId.trim());
    if (!product || product.deletedAt !== null) {
      throw this.createNotFound('product_not_found');
    }

    const { cart } = await this.getCustomerAndCart(userId, email);
    const unitPrice = 0; // Default or pricing lookup if variant/product price exists

    await this.cartRepo.addItem(cart.id, product.id, data.variantId ?? null, quantity, unitPrice);

    return this.getCartForUser(userId, email);
  }

  async updateItemQuantity(userId: string, cartItemId: string, data: UpdateCartItemDto, email?: string): Promise<CartResponseDto> {
    if (!cartItemId || typeof cartItemId !== 'string') {
      throw new ValidationException('cart_item_id_invalid');
    }

    if (!data || typeof data.quantity !== 'number' || !Number.isInteger(data.quantity) || data.quantity < 0) {
      throw new ValidationException('invalid_quantity');
    }

    const existingItem = await this.cartRepo.findCartItemById(cartItemId);
    if (!existingItem) {
      throw this.createNotFound('cart_item_not_found');
    }

    const { cart } = await this.getCustomerAndCart(userId, email);
    if (existingItem.cartId !== cart.id) {
      throw new ForbiddenError('cart_item_forbidden');
    }

    if (data.quantity === 0) {
      await this.cartRepo.removeItem(cartItemId);
    } else {
      await this.cartRepo.updateItemQuantity(cartItemId, data.quantity);
    }

    return this.getCartForUser(userId, email);
  }

  async removeItem(userId: string, cartItemId: string, email?: string): Promise<CartResponseDto> {
    if (!cartItemId || typeof cartItemId !== 'string') {
      throw new ValidationException('cart_item_id_invalid');
    }

    const existingItem = await this.cartRepo.findCartItemById(cartItemId);
    if (!existingItem) {
      throw this.createNotFound('cart_item_not_found');
    }

    const { cart } = await this.getCustomerAndCart(userId, email);
    if (existingItem.cartId !== cart.id) {
      throw new ForbiddenError('cart_item_forbidden');
    }

    await this.cartRepo.removeItem(cartItemId);
    return this.getCartForUser(userId, email);
  }

  async clearCart(userId: string, email?: string): Promise<CartResponseDto> {
    const { cart } = await this.getCustomerAndCart(userId, email);
    await this.cartRepo.clearCart(cart.id);
    return this.getCartForUser(userId, email);
  }
}

export default CartService;
