import { createHmac, timingSafeEqual } from 'node:crypto';
import type { ControllerRequest } from '../../controllers';
import { success, validationError, notFound, internalError } from '../../api';
import type { ApiResponse } from '../../api';
import { PrismaService } from '../../repositories/prisma-service';

export function invoicePublicToken(invoiceId: string): string {
  const secret = process.env.PUBLIC_INVOICE_SECRET || process.env.JWT_SECRET || 'qutoof-public-invoice-secret-change-me';
  return createHmac('sha256', secret).update(invoiceId).digest('hex');
}
function validToken(invoiceId: string, token: string): boolean {
  const expected = invoicePublicToken(invoiceId);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export class InvoicesController {
  private readonly prisma = PrismaService.getClient();
  async getPublic(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = { timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(), requestId: request.context?.metadata?.requestId, version: 'v1' as const };
    const id = request.params?.id;
    const token = Array.isArray(request.query?.token) ? request.query?.token[0] : request.query?.token;
    if (!id || typeof token !== 'string' || !validToken(id, token)) return validationError('invoice_link_invalid_or_expired', ctx);
    try {
      const invoice = await this.prisma.invoice.findUnique({ where: { id }, include: { order: { include: { items: true, customer: { select: { fullName: true, phone: true } }, branch: { select: { name: true, phone: true } } } } } }) as any;
      if (!invoice) return notFound('invoice_not_found', ctx);
      return success({ id: invoice.id, number: invoice.number, issuedAt: invoice.issuedAt, total: invoice.total, order: { code: invoice.order.code, subtotal: invoice.order.subtotal, shipping: invoice.order.shipping, tax: invoice.order.tax, total: invoice.order.total, currency: invoice.order.currency, customer: invoice.order.customer, items: invoice.order.items }, company: { name: invoice.order.branch?.name || 'قطوف الطبيعة', logoUrl: null, phone: invoice.order.branch?.phone || null } }, ctx);
    } catch {
      return internalError('invoice_unavailable', ctx);
    }
  }
}
export default InvoicesController;
