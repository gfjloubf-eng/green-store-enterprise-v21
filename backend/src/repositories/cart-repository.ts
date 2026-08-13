import BaseRepository from './base-repository';
import type { CartRepositoryContract, CartWithItems } from './contracts/cart-repository-contract';
import type { Cart, CartItem, Customer, Product } from '@prisma/client';
import PrismaService from './prisma-service';

export class CartRepository extends BaseRepository implements CartRepositoryContract {
  constructor() {
    super('cart');
  }

  async findOrCreateCartByCustomerId(customerId: string): Promise<CartWithItems> {
    let cart = await this.client.cart.findFirst({
      where: { customerId },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!cart) {
      cart = await this.client.cart.create({
        data: { customerId },
        include: {
          items: {
            include: {
              product: true,
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
    }

    return cart as CartWithItems;
  }

  async findCartByCustomerId(customerId: string): Promise<CartWithItems | null> {
    return this.client.cart.findFirst({
      where: { customerId },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    }) as Promise<CartWithItems | null>;
  }

  async findCartItemById(cartItemId: string): Promise<(CartItem & { cart: Cart; product: Product }) | null> {
    return this.client.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        product: true,
      },
    });
  }

  async findCartItemByCartAndProduct(cartId: string, productId: string, variantId?: string | null): Promise<CartItem | null> {
    return this.client.cartItem.findFirst({
      where: {
        cartId,
        productId,
        ...(variantId ? { variantId } : {}),
      },
    });
  }

  async addItem(cartId: string, productId: string, variantId: string | null, quantity: number, unitPrice: number): Promise<CartItem> {
    const existing = await this.findCartItemByCartAndProduct(cartId, productId, variantId);
    if (existing) {
      return this.client.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + quantity,
          unitPrice,
        },
      });
    }

    return this.client.cartItem.create({
      data: {
        cartId,
        productId,
        variantId: variantId ?? null,
        quantity,
        unitPrice,
      },
    });
  }

  async updateItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    return this.client.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async removeItem(cartItemId: string): Promise<void> {
    await this.client.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(cartId: string): Promise<void> {
    await this.client.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async findCustomerByUserIdOrEmail(userId: string, email?: string): Promise<Customer | null> {
    if (userId) {
      const byUser = await this.client.customer.findFirst({
        where: { userId, deletedAt: null },
      });
      if (byUser) return byUser;
    }
    if (email) {
      const byEmail = await this.client.customer.findFirst({
        where: { email, deletedAt: null },
      });
      if (byEmail) return byEmail;
    }
    return null;
  }

  async createCustomerForUser(userId: string, email?: string): Promise<Customer> {
    const code = `CUST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const user = await this.client.user.findUnique({ where: { id: userId } });
    const nameParts = user?.displayName?.split(' ') ?? ['User', 'Customer'];
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || 'Customer';

    return this.client.customer.create({
      data: {
        userId,
        customerCode: code,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`.trim(),
        email: email || user?.email || null,
        phone: user?.phone || null,
        status: 'ACTIVE',
      },
    });
  }

  async findProductById(productId: string): Promise<Product | null> {
    return this.client.product.findUnique({
      where: { id: productId },
    });
  }
}

export default CartRepository;
