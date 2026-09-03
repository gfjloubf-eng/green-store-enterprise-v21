import BaseRepository from './base-repository';
import type { OrderRepositoryContract } from './contracts/order-repository-contract';
import type { Order, OrderItem, OrderStatus, Product } from '@prisma/client';
import { NotFoundException } from './exceptions';
import { ValidationException } from '../validation';
import { InventoryRepository } from './inventory-repository';
import NotificationRepository from './notification-repository';
import { invoicePublicToken } from '../modules/invoices/controller';

export type OrderWithRelations = Order & {
  items: (OrderItem & { product?: Product | null })[];
  invoices?: { id: string; orderId: string; number: string; issuedAt: Date; dueAt?: Date | null; total: number; publicUrl?: string }[];
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

// In-memory scoped idempotency store (24-hour cache limit)
const idempotencyStore = new Map<string, { order: OrderWithRelations; createdAt: number }>();

export class OrderRepository extends BaseRepository implements OrderRepositoryContract {
  constructor() {
    super('order');
  }

  async createOrderFromCart(
    customerId: string,
    options?: {
      shippingAddressId?: string;
      notes?: string;
      idempotencyKey?: string;
      tenantId?: string;
      storeId?: string;
      branchId?: string;
    }
  ): Promise<OrderWithRelations> {
    // 1. Server-Side Order Idempotency Check
    const tenantKey = options?.tenantId || 'default';
    const idempotencyKey = options?.idempotencyKey;
    const cacheKey = idempotencyKey ? `${tenantKey}:${customerId}:${idempotencyKey}` : null;

    if (cacheKey && idempotencyStore.has(cacheKey)) {
      const cached = idempotencyStore.get(cacheKey)!;
      // Retain cache if less than 24 hours old
      if (Date.now() - cached.createdAt < 24 * 3600 * 1000) {
        return cached.order;
      }
      idempotencyStore.delete(cacheKey);
    }

    // 2. Branch & Scope Validation
    if (options?.branchId && options?.storeId) {
      const branch = await this.client.branch.findUnique({
        where: { id: options.branchId },
      });
      if (branch && branch.storeId !== options.storeId) {
        throw new ValidationException('invalid_branch_scope');
      }
    }

    const cart = await this.client.cart.findFirst({
      where: { customerId },
      include: {
        items: {
          include: {
            // variants are the pricing source of truth (products table has no
            // price column) — used below when a cart line has no stored price.
            product: {
              include: {
                variants: {
                  orderBy: { createdAt: 'asc' as const },
                  take: 1,
                },
              },
            },
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

    // 3. Server-Side Price Calculation & Historical Offer Snapshot
    let subtotal = 0;
    const now = new Date();
    const preparedItems = cart.items.map((item) => {
      const p = item.product as any;

      // Products have no price column: the selling price lives on
      // product_variants (mirrors the public catalog's default-variant
      // pricing). Prefer a positive stored line price; otherwise snapshot the
      // first variant price as the order's authoritative unit price.
      const defaultVariantPrice =
        Array.isArray(p?.variants) && p.variants.length > 0
          ? Number(p.variants[0].price)
          : NaN;
      let unitPrice =
        typeof item.unitPrice === 'number' && item.unitPrice > 0
          ? item.unitPrice
          : Number.isFinite(defaultVariantPrice) && defaultVariantPrice > 0
            ? defaultVariantPrice
            : 0;

      // A line without a computable positive price must never be charged at
      // zero: fail loudly instead of silently completing a free order.
      if (!(unitPrice > 0)) {
        throw new ValidationException(`unpriced_product_in_cart_${item.productId}`);
      }

      // Offer snapshot evaluation
      if (p.offer && p.offer.active) {
        const startValid = !p.offer.startDate || new Date(p.offer.startDate) <= now;
        const endValid = !p.offer.endDate || new Date(p.offer.endDate) >= now;
        if (startValid && endValid) {
          if (p.offer.offerPrice && p.offer.offerPrice > 0 && p.offer.offerPrice < unitPrice) {
            unitPrice = p.offer.offerPrice;
          } else if (p.offer.type === 'percentage' && p.offer.discountValue > 0) {
            unitPrice = Math.max(0.01, unitPrice * (1 - p.offer.discountValue / 100));
          } else if (p.offer.type === 'fixed' && p.offer.discountValue > 0) {
            unitPrice = Math.max(0.01, unitPrice - p.offer.discountValue);
          }
          unitPrice = Math.round(unitPrice * 100) / 100;
        }
      }

      const itemTotal = Math.round(unitPrice * item.quantity * 100) / 100;
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

    subtotal = Math.round(subtotal * 100) / 100;
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
          tenantId: options?.tenantId || null,
          storeId: options?.storeId || null,
          branchId: options?.branchId || null,
          status: 'PENDING',
          subtotal,
          tax,
          shipping,
          total,
          currency: 'YER',
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
        await invRepo.reserveStockForOrder(tx, pItem.productId, pItem.quantity, order.id, pItem.variantId);
      }

      await tx.invoice.create({
        data: {
          orderId: order.id,
          number: `INV-${code}`,
          issuedAt: new Date(),
          total,
        },
      });

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
          invoices: true,
        },
      });
    });

    if (!createdOrder) {
      throw new Error('order_creation_failed');
    }

    const orderResult = createdOrder as OrderWithRelations;
    const publicAppUrl = String(process.env.PUBLIC_APP_URL || 'https://green-store-enterprise-v21.vercel.app').replace(/\/+$/, '');
    const orderWithInvoiceLinks = {
      ...orderResult,
      invoices: (orderResult.invoices || []).map((invoice) => {
        let publicUrl: string | undefined;
        try {
          publicUrl = `${publicAppUrl}/invoices/${encodeURIComponent(invoice.id)}?token=${invoicePublicToken(invoice.id)}`;
        } catch {
          // Missing invoice secret must not break order creation; the link is omitted until configured.
        }
        return { ...invoice, publicUrl };
      }),
    } as OrderWithRelations;

    // Cache idempotency result after transaction success
    if (cacheKey) {
      idempotencyStore.set(cacheKey, { order: orderWithInvoiceLinks, createdAt: Date.now() });
    }

    try {
      await new NotificationRepository().createForManagementUsers({
        title: 'طلب جديد وصل',
        body: `الطلب ${orderWithInvoiceLinks.code} بقيمة ${Number(orderResult.total).toLocaleString('ar-YE')} ر.ي.`,
        channel: 'admin',
        payload: {
          type: 'order_created',
          orderId: orderWithInvoiceLinks.id,
          orderCode: orderWithInvoiceLinks.code,
          total: orderResult.total,
        },
      });
    } catch {
      // Notification delivery must not make a successful order fail.
    }

    return orderWithInvoiceLinks;
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
          invoices: true,
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
        invoices: true,
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
    return this.client.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order || order.deletedAt !== null) {
        throw new NotFoundException('order_not_found');
      }

      if (customerId) {
        if (order.customerId !== customerId) throw new NotFoundException('order_not_found');
        if (newStatus !== 'CANCELED') throw new ValidationException('customer_cannot_set_status');
        if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
          throw new ValidationException('order_cannot_be_cancelled');
        }
      }

      const allowed = ALLOWED_TRANSITIONS[order.status] ?? [];
      if (!allowed.includes(newStatus)) {
        throw new ValidationException(`invalid_status_transition_${order.status}_to_${newStatus}`);
      }

      const orderWithItems = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      const invRepo = new InventoryRepository();

      if (newStatus === 'CANCELED') {
        for (const item of orderWithItems?.items ?? []) {
          await invRepo.releaseStockForOrder(tx, item.productId, item.quantity, orderId, item.variantId);
        }
      } else if (newStatus === 'SHIPPED') {
        for (const item of orderWithItems?.items ?? []) {
          await invRepo.deductStockForShipment(tx, item.productId, item.quantity, orderId, item.variantId);
        }
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
        include: {
          items: { include: { product: true } },
          customer: { select: { id: true, fullName: true, email: true, phone: true } },
          invoices: true,
        },
      }) as Promise<OrderWithRelations>;
    });
  }
}

export default OrderRepository;
