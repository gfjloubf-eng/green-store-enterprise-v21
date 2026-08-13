import type { OrderStatus } from '@prisma/client';

export interface CreateOrderDto {
  readonly shippingAddressId?: string;
  readonly notes?: string;
}

export interface UpdateOrderStatusDto {
  readonly status: OrderStatus;
}

export interface OrderFilterDto {
  readonly page?: number;
  readonly limit?: number;
  readonly sort?: string;
  readonly order?: 'asc' | 'desc';
  readonly status?: OrderStatus | string;
  readonly search?: string;
  readonly customerId?: string;
}

export interface OrderItemResponseDto {
  readonly id: string;
  readonly orderId: string;
  readonly productId: string;
  readonly variantId?: string | null;
  readonly sku?: string | null;
  readonly name: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly taxAmount: number;
  readonly total: number;
  readonly product?: {
    id: string;
    name: string;
    image?: string | null;
    sku?: string | null;
  } | null;
}

export interface OrderResponseDto {
  readonly id: string;
  readonly tenantId?: string | null;
  readonly storeId?: string | null;
  readonly branchId?: string | null;
  readonly customerId?: string | null;
  readonly code: string;
  readonly status: OrderStatus;
  readonly subtotal: number;
  readonly shipping: number;
  readonly tax: number;
  readonly total: number;
  readonly currency: string;
  readonly placedAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly items: OrderItemResponseDto[];
  readonly customer?: {
    id: string;
    fullName: string;
    email?: string | null;
    phone?: string | null;
  } | null;
}
