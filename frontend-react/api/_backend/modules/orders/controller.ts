import { HTTP_STATUS, success, created } from '../../api';
import type { ApiMeta, ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { UnauthorizedError } from '../../common/security/errors';
import { ValidationException } from '../../validation';
import { OrderRepository } from '../../repositories/order-repository';
import CartRepository from '../../repositories/cart-repository';
import type { OrderStatus } from '@prisma/client';

type ApiContextFields = Pick<ApiMeta, 'timestamp' | 'requestId' | 'version' | 'locale'>;

export class OrderController {
  private orderRepo = new OrderRepository();
  private cartRepo = new CartRepository();

  public async createOrder(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      // Resolve or create linked customer record
      let customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
      if (!customer) {
        customer = await this.cartRepo.createCustomerForUser(user.id, user.email);
      }

      const body = request.body || {};
      const order = await this.orderRepo.createOrderFromCart(customer.id, {
        shippingAddressId: body.shippingAddressId,
        notes: body.notes,
      });

      return created(order, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async listOrders(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const query = request.query || {};
      const isCustomerOnly = user.role === 'CUSTOMER' && !this.hasManagementPermissions(user);

      let customerIdFilter: string | undefined = undefined;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return success({ items: [], total: 0, page: 1, limit: 10, totalPages: 0 }, ctx);
        }
        customerIdFilter = customer.id;
      } else if (query.customerId) {
        customerIdFilter = String(query.customerId);
      }

      const result = await this.orderRepo.findOrders({
        customerId: customerIdFilter,
        status: query.status ? String(query.status) : undefined,
        search: query.search ? String(query.search) : undefined,
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10,
        sort: query.sort ? String(query.sort) : 'createdAt',
        order: query.order === 'asc' ? 'asc' : 'desc',
      });

      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async getOrderById(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const orderId = request.params?.id;
      if (!orderId) {
        return this.errorResponse('bad_request', 'order_id_required', HTTP_STATUS.BAD_REQUEST, ctx);
      }

      const isCustomerOnly = user.role === 'CUSTOMER' && !this.hasManagementPermissions(user);
      let customerIdCheck: string | undefined = undefined;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return this.errorResponse('not_found', 'order_not_found', HTTP_STATUS.NOT_FOUND, ctx);
        }
        customerIdCheck = customer.id;
      }

      const order = await this.orderRepo.findOrderById(orderId, customerIdCheck);
      if (!order) {
        return this.errorResponse('not_found', 'order_not_found', HTTP_STATUS.NOT_FOUND, ctx);
      }

      return success(order, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async updateStatus(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const orderId = request.params?.id;
      const status = request.body?.status as OrderStatus;

      if (!orderId || !status) {
        return this.errorResponse('bad_request', 'order_id_and_status_required', HTTP_STATUS.BAD_REQUEST, ctx);
      }

      const isCustomerOnly = user.role === 'CUSTOMER' && !this.hasManagementPermissions(user);
      let customerIdCheck: string | undefined = undefined;

      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return this.errorResponse('not_found', 'order_not_found', HTTP_STATUS.NOT_FOUND, ctx);
        }
        customerIdCheck = customer.id;
      }

      const updatedOrder = await this.orderRepo.updateOrderStatus(orderId, status, customerIdCheck);
      return success(updatedOrder, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async cancelOrder(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const cancelReq: ControllerRequest<any> = {
      ...request,
      body: { ...((request.body as any) || {}), status: 'CANCELED' },
    };
    return this.updateStatus(cancelReq);
  }

  private hasManagementPermissions(user: any): boolean {
    if (!user || !user.permissions || !Array.isArray(user.permissions)) return false;
    return user.permissions.some((p: any) => {
      const formatted = typeof p === 'string' ? p : `${p.resource}:${p.action}`;
      return formatted === 'orders:update' || formatted === 'orders:delete' || formatted === '*';
    });
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

export default OrderController;
