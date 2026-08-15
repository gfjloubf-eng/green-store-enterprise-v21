import BaseRepository from './base-repository';
import type { Payment, PaymentStatus } from '@prisma/client';
import { NotFoundException } from './exceptions';
import { ValidationException } from '../validation';

export interface CreatePaymentParams {
  orderId: string;
  paymentMethod: string;
  idempotencyKey?: string;
  customerIdCheck?: string;
}

export class PaymentRepository extends BaseRepository {
  constructor() {
    super('payment');
  }

  async createPaymentTransaction(params: CreatePaymentParams): Promise<Payment> {
    const { orderId, paymentMethod, idempotencyKey, customerIdCheck } = params;

    // Retrieve Order to enforce server-side price integrity
    const order = await this.client.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      throw new NotFoundException('order_not_found');
    }

    if (customerIdCheck && order.customerId !== customerIdCheck) {
      throw new NotFoundException('order_not_found');
    }

    // Check existing payment transaction for order to protect idempotency
    const existing = await this.client.payment.findFirst({
      where: { orderId: order.id },
      orderBy: { createdAt: 'desc' },
    });
    if (existing) {
      return existing;
    }

    // Payment Amount comes strictly from Database Order.total
    const amount = order.total;
    if (amount <= 0) {
      throw new ValidationException('invalid_order_amount');
    }

    const initialStatus: PaymentStatus = paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'COMPLETED';
    const providerRef = `PAY-REF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const transaction = await this.client.payment.create({
      data: {
        orderId: order.id,
        amount,
        status: initialStatus,
        method: paymentMethod,
        providerRef,
        paidAt: initialStatus === 'COMPLETED' ? new Date() : null,
      },
    });

    // If payment completed immediately (e.g. Card/Simulated), advance order status to CONFIRMED
    if (initialStatus === 'COMPLETED' && order.status === 'PENDING') {
      await this.client.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED' },
      });
    }

    return transaction;
  }

  async verifyPaymentTransaction(
    paymentId: string,
    targetStatus: PaymentStatus = 'COMPLETED',
    providerReference?: string
  ): Promise<Payment> {
    const existing = await this.client.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!existing) {
      throw new NotFoundException('payment_transaction_not_found');
    }

    const updated = await this.client.payment.update({
      where: { id: paymentId },
      data: {
        status: targetStatus,
        providerRef: providerReference ?? existing.providerRef,
        paidAt: targetStatus === 'COMPLETED' ? new Date() : existing.paidAt,
      },
    });

    if (targetStatus === 'COMPLETED' && existing.order && existing.order.status === 'PENDING') {
      await this.client.order.update({
        where: { id: existing.orderId! },
        data: { status: 'CONFIRMED' },
      });
    }

    return updated;
  }

  async findPaymentByOrderId(orderId: string, customerIdCheck?: string): Promise<Payment | null> {
    const order = await this.client.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return null;
    if (customerIdCheck && order.customerId !== customerIdCheck) return null;

    return this.client.payment.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default PaymentRepository;
