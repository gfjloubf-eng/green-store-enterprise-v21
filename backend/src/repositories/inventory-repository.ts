import BaseRepository from './base-repository';
import { NotFoundException } from './exceptions';
import { ValidationException } from '../validation';

export class InventoryRepository extends BaseRepository {
  constructor() {
    super('inventory');
  }

  async findOrCreateDefaultWarehouse() {
    let warehouse = await this.client.warehouse.findFirst({
      where: { code: 'DEFAULT' },
    });
    if (!warehouse) {
      warehouse = await this.client.warehouse.create({
        data: {
          name: 'المستودع الرئيسي (Default Warehouse)',
          code: 'DEFAULT',
        },
      });
    }
    return warehouse;
  }

  async findOrCreateInventory(productId: string, warehouseId?: string, productVariantId?: string) {
    let targetWarehouseId = warehouseId;
    if (!targetWarehouseId) {
      const defaultW = await this.findOrCreateDefaultWarehouse();
      targetWarehouseId = defaultW.id;
    }

    let inv = await this.client.inventory.findFirst({
      where: { productId, warehouseId: targetWarehouseId, productVariantId: productVariantId ?? null },
      include: {
        product: { select: { id: true, name: true, sku: true } },
        warehouse: { select: { id: true, name: true } },
      },
    });

    if (!inv) {
      inv = await this.client.inventory.create({
        data: {
            productId,
            productVariantId: productVariantId ?? null,
            warehouseId: targetWarehouseId,
          quantity: 0,
          reserved: 0,
          available: 0,
          safetyStock: 10,
        },
        include: {
          product: { select: { id: true, name: true, sku: true } },
          warehouse: { select: { id: true, name: true } },
        },
      });
    }

    return inv;
  }

  async reserveStockForOrder(tx: any, productId: string, qty: number, orderId: string, productVariantId?: string | null): Promise<void> {
    if (!Number.isInteger(qty) || qty <= 0) throw new ValidationException('quantity_must_be_positive_integer');
    const inv = await tx.inventory.findFirst({
      where: {
        productId,
        productVariantId: productVariantId ?? null,
        warehouse: { code: 'DEFAULT' },
      },
    });

    if (!inv) {
      throw new ValidationException(`inventory_not_found_for_product_${productId}`);
    }

    if (inv.available < qty) {
      throw new ValidationException(`insufficient_stock_for_product_${productId}`);
    }

    const newReserved = inv.reserved + qty;
    const newAvailable = Math.max(0, inv.quantity - newReserved);

    await tx.inventory.update({
      where: { id: inv.id },
      data: {
        reserved: newReserved,
        available: newAvailable,
      },
    });

    await tx.stockMovement.create({
      data: {
        inventoryId: inv.id,
        type: 'RESERVATION',
        quantity: qty,
        referenceId: orderId,
      },
    });
  }

  async releaseStockForOrder(tx: any, productId: string, qty: number, orderId: string, productVariantId?: string | null): Promise<void> {
    if (!Number.isInteger(qty) || qty <= 0) throw new ValidationException('quantity_must_be_positive_integer');
    const inv = await tx.inventory.findFirst({
      where: {
        productId,
        productVariantId: productVariantId ?? null,
        warehouse: { code: 'DEFAULT' },
      },
    });

    if (!inv) return;

    const newReserved = Math.max(0, inv.reserved - qty);
    const newAvailable = Math.max(0, inv.quantity - newReserved);

    await tx.inventory.update({
      where: { id: inv.id },
      data: {
        reserved: newReserved,
        available: newAvailable,
      },
    });

    await tx.stockMovement.create({
      data: {
        inventoryId: inv.id,
        type: 'RELEASE',
        quantity: qty,
        referenceId: orderId,
      },
    });
  }

  async deductStockForShipment(tx: any, productId: string, qty: number, orderId: string, productVariantId?: string | null): Promise<void> {
    if (!Number.isInteger(qty) || qty <= 0) throw new ValidationException('quantity_must_be_positive_integer');
    const inv = await tx.inventory.findFirst({
      where: {
        productId,
        productVariantId: productVariantId ?? null,
        warehouse: { code: 'DEFAULT' },
      },
    });

    if (!inv) return;

    if (inv.reserved < qty || inv.quantity < qty) {
      throw new ValidationException(`insufficient_reserved_stock_for_product_${productId}`);
    }

    const newReserved = inv.reserved - qty;
    const newQuantity = inv.quantity - qty;
    const newAvailable = Math.max(0, newQuantity - newReserved);

    await tx.inventory.update({
      where: { id: inv.id },
      data: {
        quantity: newQuantity,
        reserved: newReserved,
        available: newAvailable,
      },
    });

    await tx.stockMovement.create({
      data: {
        inventoryId: inv.id,
        type: 'OUT',
        quantity: qty,
        referenceId: orderId,
      },
    });
  }

  async deductStockForOrder(tx: any, productId: string, qty: number, orderId: string, productVariantId?: string | null): Promise<void> {
    return this.deductStockForShipment(tx, productId, qty, orderId, productVariantId);
  }

  async adjustStock(
    productId: string,
    type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'RESERVATION',
    qty: number,
    reason?: string,
    performedById?: string,
    warehouseId?: string,
    productVariantId?: string
  ): Promise<any> {
    if (qty < 0) {
      throw new ValidationException('quantity_cannot_be_negative');
    }

    const targetWarehouse = warehouseId
      ? await this.client.warehouse.findUnique({ where: { id: warehouseId } })
      : await this.findOrCreateDefaultWarehouse();
    if (!targetWarehouse) throw new NotFoundException('warehouse_not_found');

    const { updated } = await this.client.$transaction(
      async (tx) => {
      let inv = await tx.inventory.findFirst({
        where: { productId, warehouseId: targetWarehouse.id, productVariantId: productVariantId ?? null },
      });
      if (!inv) {
        inv = await tx.inventory.create({
          data: {
            productId,
            productVariantId: productVariantId ?? null,
            warehouseId: targetWarehouse.id,
            quantity: 0,
            reserved: 0,
            available: 0,
            safetyStock: 10,
          },
        });
      }

      let up: any;
      if (type === 'IN') {
        up = await tx.inventory.update({
          where: { id: inv.id },
          data: {
            quantity: { increment: qty },
            available: { increment: qty },
          },
          include: {
            product: { select: { id: true, name: true, sku: true } },
            warehouse: { select: { id: true, name: true } },
          },
        });
      } else if (type === 'OUT') {
        if (inv.available < qty || inv.quantity < qty) {
          throw new ValidationException('insufficient_available_stock');
        }
        up = await tx.inventory.update({
          where: { id: inv.id },
          data: {
            quantity: { decrement: qty },
            available: { decrement: qty },
          },
          include: {
            product: { select: { id: true, name: true, sku: true } },
            warehouse: { select: { id: true, name: true } },
          },
        });
      } else if (type === 'ADJUSTMENT') {
        if (qty < inv.reserved) {
          throw new ValidationException('adjustment_below_reserved_quantity');
        }
        const newQty = qty;
        const newAvail = Math.max(0, newQty - inv.reserved);
        up = await tx.inventory.update({
          where: { id: inv.id },
          data: {
            quantity: newQty,
            available: newAvail,
          },
          include: {
            product: { select: { id: true, name: true, sku: true } },
            warehouse: { select: { id: true, name: true } },
          },
        });
      }

      await tx.stockMovement.create({
        data: {
          inventoryId: inv.id,
          type,
          quantity: qty,
          referenceId: reason ?? null,
          performedById: performedById ?? null,
        },
      });

      return { updated: up };
    }, { maxWait: 10000, timeout: 20000 });

    const avail = updated.available ?? (updated.quantity - updated.reserved);
    return {
      ...updated,
      reservedQuantity: updated.reserved,
      availableQuantity: avail,
      lowStockThreshold: updated.safetyStock,
      isLowStock: avail <= updated.safetyStock,
      isOutOfStock: avail <= 0,
    };
  }

  async findInventoryList(options: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    warehouseId?: string;
    productVariantId?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, Number(options.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(options.limit ?? 10)));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.warehouseId) where.warehouseId = options.warehouseId;
    if (options.productVariantId) where.productVariantId = options.productVariantId;
    if (options.search) {
      where.product = {
        OR: [
          { name: { contains: options.search, mode: 'insensitive' } },
          { sku: { contains: options.search, mode: 'insensitive' } },
        ],
      };
    }

    const [items, total] = await Promise.all([
      this.client.inventory.findMany({
        where,
        include: {
          product: { select: { id: true, name: true, sku: true } },
          warehouse: { select: { id: true, name: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.client.inventory.count({ where }),
    ]);

    let filteredItems = items;
    if (options.status === 'LOW_STOCK') {
      filteredItems = items.filter((i) => i.available > 0 && i.available <= i.safetyStock);
    } else if (options.status === 'OUT_OF_STOCK') {
      filteredItems = items.filter((i) => i.available <= 0);
    } else if (options.status === 'IN_STOCK') {
      filteredItems = items.filter((i) => i.available > i.safetyStock);
    }

    return {
      items: filteredItems.map((inv) => {
        const avail = inv.available ?? (inv.quantity - inv.reserved);
        return {
          ...inv,
          reservedQuantity: inv.reserved,
          availableQuantity: avail,
          lowStockThreshold: inv.safetyStock,
          isLowStock: avail <= inv.safetyStock,
          isOutOfStock: avail <= 0,
        };
      }),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findStockMovements(options: {
    inventoryId?: string;
    productId?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(options.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(options.limit ?? 20)));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.inventoryId) where.inventoryId = options.inventoryId;
    if (options.type) where.type = options.type;
    if (options.productId) where.inventory = { productId: options.productId };

    const [items, total] = await Promise.all([
      this.client.stockMovement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.client.stockMovement.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findMovements(options: any) {
    return this.findStockMovements(options);
  }
}

export default InventoryRepository;
