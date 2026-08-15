import type { StockMovementType } from '@prisma/client';

export interface AdjustStockDto {
  readonly productId: string;
  readonly warehouseId?: string;
  readonly type: StockMovementType;
  readonly quantity: number;
  readonly reason?: string;
}

export interface InventoryFilterDto {
  readonly page?: number;
  readonly limit?: number;
  readonly status?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'ALL';
  readonly search?: string;
  readonly warehouseId?: string;
}

export interface InventoryResponseDto {
  readonly id: string;
  readonly warehouseId: string;
  readonly productId: string;
  readonly quantity: number;
  readonly reservedQuantity: number;
  readonly availableQuantity: number;
  readonly lowStockThreshold: number;
  readonly isLowStock: boolean;
  readonly isOutOfStock: boolean;
  readonly product?: {
    id: string;
    name: string;
    sku?: string | null;
  } | null;
  readonly warehouse?: {
    id: string;
    name: string;
  } | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
