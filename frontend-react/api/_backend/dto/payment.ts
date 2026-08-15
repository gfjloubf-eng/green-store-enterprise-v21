import type { PaymentStatus } from '@prisma/client';

export interface CreatePaymentDto {
  readonly orderId: string;
  readonly paymentMethod: 'CASH_ON_DELIVERY' | 'CARD' | 'BANK_TRANSFER' | 'OFFLINE_MANUAL';
  readonly idempotencyKey?: string;
}

export interface VerifyPaymentDto {
  readonly paymentId: string;
  readonly providerReference?: string;
  readonly status?: PaymentStatus;
}

export interface PaymentResponseDto {
  readonly id: string;
  readonly orderId: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: PaymentStatus;
  readonly paymentMethod: string;
  readonly provider: string;
  readonly providerReference: string | null;
  readonly idempotencyKey: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
