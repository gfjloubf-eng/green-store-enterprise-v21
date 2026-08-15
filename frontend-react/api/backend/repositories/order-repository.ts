import BaseRepository from './base-repository';
import type { OrderRepositoryContract } from './contracts/order-repository-contract';
import type { Order, OrderItem, OrderStatus, Product } from '@prisma/client';
import { NotFoundException } from './exceptions';
import { ValidationException } from '../validation';
import { InventoryRepository } from './inventory-repository';

export type OrderWithRelations = Order & {
  items: (OrderItem & { product?: Product | null })[];
  customer?: { id: string; fullName: string; email?: string | null; phone?: string | null } | null;
};

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: ['PENDING', 'CONFIRMED', 'CANCELED'],
  PENDING: ['CONFIRMED', 'CANCELED'],
  CONFIRMED: ['PACKED', 'SHIPPED', 'CANCELED'],
  PACKED: ['SHIPPED', 'CANCELED'],
  SHIPPED: ['DELIVERED', 'RETURNED'],
  DELIVERED: ['RETURNED', 'REFUNDED'],
  CANCELED: [],
  RETURNED: ['REFUNDED'],
  REFUNDED: [],
};

export class OrderRepository extends BaseRepository implements OrderRepositoryContract {
  constructor() {
    super('order');
  }

  async createOrderFromCart(
    customerId: string,
    options?: { shippingAddressId?: string; notes?: string }
  ): Promise<OrderWithRelations> {
    const cart = await this.client.cart.findFirst({
      where: { customerId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new ValidationException('cart_is_empty');
    }

    // Validate Products & Quantities
    for (const item of cart.items) {
      if (!item.product || item.product.deletedAt !== null || (item.product as any).isActive === false) {
        throw new ValidationException(`product_unavailable_${item.productId}`);
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new ValidationException('invalid_item_quantity');
      }
    }

    // Server-Side Price Calculation (Never trust client prices)
    let subtotal = 0;
    const preparedItems = cart.items.map((item) => {
      const unitPrice = typeof (item.product as any).price === 'number' ? (item.product as any).price : (item.unitPrice || 0);
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.productId,
        variantId: item.variantId ?? null,
        sku: item.product.sku ?? null,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice,
        taxAmount: 0,
        total: itemTotal,
      };
    });

    const tax = 0;
    const shipping = 0;
    const total = subtotal + tax + shipping;
    const code = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Execute in an Atomic Database Transaction
    const createdOrder = await this.client.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          code,
          customerId,
          status: 'PENDING',
          subtotal,
          tax,
          shipping,
          total,
          currency: 'SAR',
          placedAt: new Date(),
        },
      });

      for (const pItem of preparedItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            ...pItem,
          },
        });

        // Reserve stock for item in atomic transaction
        const invRepo = new InventoryRepository();
        await invRepo.reserveStockForOrder(tx, pItem.productId, pItem.quantity, order.id);
      }

      // Finalize Cart (Clear all items from customer cart)
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: {
            include: { product: true },
          },
          customer: {
            select: { id: true, fullName: true, email: true, phone: true },
          },
        },
      });
    });

    if (!createdOrder) {
      throw new Error('order_creation_failed');
    }

    return createdOrder as OrderWithRelations;
  }

  async findOrders(options: {
    customerId?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(options.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(options.limit ?? 10)));
    const skip = (page - 1) * limit;
    const sortField = options.sort ?? 'createdAt';
    const sortOrder = options.order ?? 'desc';

    const where: any = {
      deletedAt: null,
    };

    if (options.customerId) {
      where.customerId = options.customerId;
    }

    if (options.status) {
      where.status = options.status as OrderStatus;
    }

    if (options.search) {
      where.OR = [
        { code: { contains: options.search, mode: 'insensitive' } },
        { items: { some: { name: { contains: options.search, mode: 'insensitive' } } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.client.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
        include: {
          items: {
            include: { product: true },
          },
          customer: {
            select: { id: true, fullName: true, email: true, phone: true },
          },
        },
      }),
      this.client.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOrderById(orderId: string, customerId?: string): Promise<OrderWithRelations | null> {
    const order = await this.client.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
        customer: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
      },
    });

    if (!order || order.deletedAt !== null) return null;

    // Enforce Ownership Isolation
    if (customerId && order.customerId !== customerId) {
      return null;
    }

    return order as OrderWithRelations;
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus, customerId?: string): Promise<OrderWithRelations> {
    const order = await this.client.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.deletedAt !== null) {
      throw new NotFoundException('order_not_found');
    }

    // Ownership & Customer Cancellation Validation
    if (customerId) {
      if (order.customerId !== customerId) {
        throw new NotFoundException('order_not_found');
      }
      if (newStatus !== 'CANCELED') {
        throw new ValidationException('customer_cannot_set_status');
      }
      if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
        throw new ValidationException('order_cannot_be_cancelled');
      }
    }

    // Validate Lifecycle Status Transition
    const allowed = ALLOWED_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(newStatus)) {
      throw new ValidationException(`invalid_status_transition_${order.status}_to_${newStatus}`);
    }

    const orderWithItems = await this.client.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    const invRepo = new InventoryRepository();
    if (orderWithItems && orderWithItems.items) {
      if (newStatus === 'CANCELED') {
        for (const item of orderWithItems.items) {
          await invRepo.releaseStockForOrder(this.client, item.productId, item.quantity, orderId);
        }
      } else if (newStatus === 'SHIPPED' || newStatus === 'DELIVERED') {
        for (const item of orderWithItems.items) {
          await invRepo.deductStockForOrder(this.client, item.productId, item.quantity, orderId);
        }
      }
    }

    const updated = await this.client.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: {
        items: {
          include: { product: true },
        },
        customer: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
      },
    });

    return updated as OrderWithRelations;
  }
}

export default OrderRepository;
