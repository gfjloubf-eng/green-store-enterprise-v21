import BaseRepository from './base-repository';
import SupportRepository from './support-repository';
import type { OrderStatus } from '@prisma/client';

export class ReportsRepository extends BaseRepository {
  private supportRepo = new SupportRepository();

  constructor() {
    super('order');
  }

  async getDashboardKpis() {
    const [
      ordersAgg,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalCustomers,
      totalProducts,
      inventories,
      supportTickets,
    ] = await Promise.all([
      this.client.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELED' } },
      }),
      this.client.order.count(),
      this.client.order.count({ where: { status: 'DELIVERED' } }),
      this.client.order.count({ where: { status: 'PENDING' } }),
      this.client.customer.count(),
      this.client.product.count({ where: { isPublished: true } }),
      this.client.inventory.findMany(),
      this.supportRepo.findAllTickets(),
    ]);

    const totalRevenue = ordersAgg._sum?.total ?? 0;
    const lowStockProducts = inventories.filter((i) => i.available <= i.safetyStock).length;
    const openSupportTickets = supportTickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

    return {
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      openSupportTickets,
    };
  }

  async getSalesReport(startDate?: string, endDate?: string, status?: string) {
    const where: any = {};
    if (status) where.status = status as OrderStatus;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [agg, count, orders] = await Promise.all([
      this.client.order.aggregate({
        _sum: { total: true },
        _avg: { total: true },
        where,
      }),
      this.client.order.count({ where }),
      this.client.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { customer: true },
      }),
    ]);

    return {
      totalOrders: count,
      totalRevenue: agg._sum?.total ?? 0,
      averageOrderValue: Math.round((agg._avg?.total ?? 0) * 100) / 100,
      recentOrders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.code,
        customerName: o.customer?.fullName || o.customer?.email || 'عميل',
        status: o.status,
        total: o.total,
        createdAt: o.createdAt,
      })),
    };
  }

  async getProductAnalytics() {
    const [totalProducts, lowStockItems, topItems] = await Promise.all([
      this.client.product.count(),
      this.client.inventory.findMany({
        where: { available: { lte: 5 } },
        include: { product: true },
        take: 20,
      }),
      this.client.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      }),
    ]);

    const productIds = topItems.map((i) => i.productId);
    const products = await this.client.product.findMany({
      where: { id: { in: productIds } },
    });

    const bestSellers = topItems.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      return {
        id: item.productId,
        name: prod?.name || 'منتج',
        sku: prod?.sku || '-',
        totalQuantitySold: item._sum?.quantity ?? 0,
        totalRevenue: item._sum?.total ?? 0,
      };
    });

    return {
      totalProducts,
      lowStockCount: lowStockItems.length,
      lowStockList: lowStockItems.map((i) => ({
        id: i.id,
        productName: i.product.name,
        available: i.available,
        safetyStock: i.safetyStock,
      })),
      bestSellers,
    };
  }

  async getInventoryAnalytics() {
    const inventories = await this.client.inventory.findMany({
      include: { product: true },
    });

    let totalUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const inv of inventories) {
      totalUnits += inv.quantity;
      if (inv.available <= 0) outOfStockCount++;
      else if (inv.available <= inv.safetyStock) lowStockCount++;
    }

    return {
      totalItems: inventories.length,
      totalUnits,
      lowStockCount,
      outOfStockCount,
      items: inventories.map((i) => ({
        id: i.id,
        productName: i.product.name,
        sku: i.product.sku,
        quantity: i.quantity,
        reserved: i.reserved,
        available: i.available,
      })),
    };
  }

  async getCustomerAnalytics() {
    const [totalCustomers, customers] = await Promise.all([
      this.client.customer.count(),
      this.client.customer.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { orders: true },
      }),
    ]);

    return {
      totalCustomers,
      recentCustomers: customers.map((c) => ({
        id: c.id,
        name: c.fullName || c.email,
        email: c.email,
        ordersCount: c.orders.length,
        createdAt: c.createdAt,
      })),
    };
  }

  async getPaymentAnalytics() {
    const payments = await this.client.payment.findMany();

    let completedTotal = 0;
    let pendingTotal = 0;
    let failedTotal = 0;

    for (const p of payments) {
      if (p.status === 'COMPLETED') completedTotal += p.amount;
      else if (p.status === 'PENDING') pendingTotal += p.amount;
      else failedTotal += p.amount;
    }

    return {
      totalTransactions: payments.length,
      completedTotal,
      pendingTotal,
      failedTotal,
    };
  }
}

export default ReportsRepository;
