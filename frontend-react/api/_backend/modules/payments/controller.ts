import { HTTP_STATUS, success, created } from '../../api';
import type { ApiMeta, ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { UnauthorizedError } from '../../common/security/errors';
import { ValidationException } from '../../validation';
import { NotFoundException } from '../../repositories/exceptions';
import { PaymentRepository } from '../../repositories/payment-repository';
import CartRepository from '../../repositories/cart-repository';

type ApiContextFields = Pick<ApiMeta, 'timestamp' | 'requestId' | 'version' | 'locale'>;

export class PaymentController {
  private paymentRepo = new PaymentRepository();
  private cartRepo = new CartRepository();

  public async createPayment(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const body = request.body || {};
      const { orderId, paymentMethod, idempotencyKey } = body;

      if (!orderId || !paymentMethod) {
        return this.errorResponse('bad_request', 'order_id_and_payment_method_required', HTTP_STATUS.BAD_REQUEST, ctx);
      }

      const isCustomerOnly = user.role === 'CUSTOMER';
      let customerIdCheck: string | undefined = undefined;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return this.errorResponse('not_found', 'order_not_found', HTTP_STATUS.NOT_FOUND, ctx);
        }
        customerIdCheck = customer.id;
      }

      const transaction = await this.paymentRepo.createPaymentTransaction({
        orderId: String(orderId),
        paymentMethod: String(paymentMethod),
        idempotencyKey: idempotencyKey ? String(idempotencyKey) : undefined,
        customerIdCheck,
      });

      return created(transaction, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async getPaymentForOrder(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const orderId = request.params?.orderId;
      if (!orderId) {
        return this.errorResponse('bad_request', 'order_id_required', HTTP_STATUS.BAD_REQUEST, ctx);
      }

      const isCustomerOnly = user.role === 'CUSTOMER';
      let customerIdCheck: string | undefined = undefined;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return this.errorResponse('not_found', 'payment_not_found', HTTP_STATUS.NOT_FOUND, ctx);
        }
        customerIdCheck = customer.id;
      }

      const payment = await this.paymentRepo.findPaymentByOrderId(orderId, customerIdCheck);
      if (!payment) {
        return this.errorResponse('not_found', 'payment_not_found', HTTP_STATUS.NOT_FOUND, ctx);
      }

      return success(payment, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async verifyPayment(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const body = request.body || {};
      const { paymentId, status, providerReference } = body;

      if (!paymentId) {
        return this.errorResponse('bad_request', 'payment_id_required', HTTP_STATUS.BAD_REQUEST, ctx);
      }

      const verified = await this.paymentRepo.verifyPaymentTransaction(
        String(paymentId),
        status ? (String(status) as any) : 'COMPLETED',
        providerReference ? String(providerReference) : undefined
      );

      return success(verified, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  private createApiContext(request: ControllerRequest): ApiContextFields {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as ApiMeta['version'],
      locale: request.context?.metadata?.locale,
    };
  }

  private mapError(error: unknown, ctx: ApiContextFields): ApiResponse<never> {
    if (error instanceof NotFoundException) {
      return this.errorResponse('not_found', error.message || 'not_found', HTTP_STATUS.NOT_FOUND, ctx);
    }
    if (error instanceof ValidationException) {
      return this.errorResponse('bad_request', error.message || 'bad_request', HTTP_STATUS.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse('unauthorized', error.message || 'unauthorized', HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      'internal_error',
      error instanceof Error ? error.message : 'internal_error',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ctx
    );
  }

  private errorResponse(code: string, message: string, statusCode: number, ctx: ApiContextFields): ApiResponse<never> {
    return {
      statusCode,
      body: {
        success: false,
        error: { code, message },
        meta: {
          timestamp: ctx.timestamp,
          requestId: ctx.requestId,
          version: ctx.version,
          locale: ctx.locale,
        },
      },
    };
  }
}

export default PaymentController;
