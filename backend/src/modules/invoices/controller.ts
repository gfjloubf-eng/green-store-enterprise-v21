import { createHmac, timingSafeEqual } from 'node:crypto';
import type { ControllerRequest } from '../../controllers';
import { success, validationError, notFound, internalError } from '../../api';
import type { ApiResponse } from '../../api';
import { PrismaService } from '../../repositories/prisma-service';

const INVOICE_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;

function getInvoiceSecret(): string {
  const secret = String(process.env.PUBLIC_INVOICE_SECRET ?? '').trim();
  if (secret.length < 32) throw new Error('public_invoice_secret_not_configured');
  return secret;
}

function signature(invoiceId: string, expiresAt: number): string {
  return createHmac('sha256', getInvoiceSecret()).update(`${invoiceId}.${expiresAt}`).digest('hex');
}

export function invoicePublicToken(invoiceId: string, nowSeconds = Math.floor(Date.now() / 1000)): string {
  const expiresAt = nowSeconds + INVOICE_TOKEN_TTL_SECONDS;
  return `${expiresAt}.${signature(invoiceId, expiresAt)}`;
}

function validToken(invoiceId: string, token: string): boolean {
  const [expiryText, provided] = String(token).split('.');
  const expiresAt = Number(expiryText);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000) || !/^[a-f0-9]{64}$/i.test(provided || '')) return false;
  const expected = signature(invoiceId, expiresAt);
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(provided, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

export class InvoicesController {
  private readonly prisma = PrismaService.getClient();
  async getPublic(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = { timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(), requestId: request.context?.metadata?.requestId, version: 'v1' as const };
    const id = request.params?.id;
    const token = Array.isArray(request.query?.token) ? request.query?.token[0] : request.query?.token;
    if (!id || typeof token !== 'string') return validationError('invoice_link_invalid_or_expired', ctx);
    try {
      if (!validToken(id, token)) return validationError('invoice_link_invalid_or_expired', ctx);
    } catch (error) {
      if (error instanceof Error && error.message === 'public_invoice_secret_not_configured') return internalError(error.message, ctx);
      return validationError('invoice_link_invalid_or_expired', ctx);
    }
    try {
      const invoice = await this.prisma.invoice.findUnique({ where: { id }, include: { order: { include: { items: true, customer: { select: { fullName: true, phone: true } }, branch: { select: { name: true, phone: true } } } } } }) as any;
      if (!invoice) return notFound('invoice_not_found', ctx);
      let businessLogoUrl: string | null = null;
      let notificationPhone: string | null = null;
      try {
        const settings = await this.prisma.$queryRawUnsafe<Array<{ key: string; value: string }>>('SELECT "key", "value" FROM "system_settings" WHERE "key" IN ($1, $2)', 'business_logo_url', 'notification_phone');
        businessLogoUrl = settings.find((item) => item.key === 'business_logo_url')?.value || null;
        notificationPhone = settings.find((item) => item.key === 'notification_phone')?.value || null;
      } catch {
        // Keep public invoice available if optional settings are unavailable.
      }
      return success({ id: invoice.id, number: invoice.number, issuedAt: invoice.issuedAt, total: invoice.total, order: { code: invoice.order.code, subtotal: invoice.order.subtotal, shipping: invoice.order.shipping, tax: invoice.order.tax, total: invoice.order.total, currency: invoice.order.currency, customer: invoice.order.customer, items: invoice.order.items }, company: { name: invoice.order.branch?.name || 'قطوف الطبيعة', logoUrl: businessLogoUrl, phone: invoice.order.branch?.phone || notificationPhone } }, ctx);
    } catch {
      return internalError('invoice_unavailable', ctx);
    }
  }
}
export default InvoicesController;
