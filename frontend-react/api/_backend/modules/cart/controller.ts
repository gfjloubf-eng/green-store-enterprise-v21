import { forbidden, notFound, success, validationError, HTTP_STATUS } from '../../api';
import type { ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { NotFoundException, ValidationException } from '../../repositories/exceptions';
import { ForbiddenError } from '../../authorization/errors';
import { ServiceFactory } from '../../services/service-factory';
import type { AddToCartDto, UpdateCartItemDto } from '../../dto/cart';

export class CartController {
  private readonly service = ServiceFactory.createCartService();

  private context(request: ControllerRequest) {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as 'v1',
      locale: request.context?.metadata?.locale,
    };
  }

  private getUserInfo(request: ControllerRequest) {
    const user = request.context?.user;
    if (!user || typeof user !== 'object' || !user.id) {
      throw new ValidationException('authentication_required');
    }
    return {
      id: String(user.id),
      email: user.email ? String(user.email) : undefined,
    };
  }

  async getCart(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const user = this.getUserInfo(request);
      const cart = await this.service.getCartForUser(user.id, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async addItem(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const user = this.getUserInfo(request);
      const cart = await this.service.addItem(user.id, request.body as AddToCartDto, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async updateItem(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const user = this.getUserInfo(request);
      const itemId = request.params?.id ?? '';
      const cart = await this.service.updateItemQuantity(user.id, itemId, request.body as UpdateCartItemDto, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async removeItem(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const user = this.getUserInfo(request);
      const itemId = request.params?.id ?? '';
      const cart = await this.service.removeItem(user.id, itemId, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  async clearCart(request: ControllerRequest): Promise<ApiResponse<unknown>> {
    const ctx = this.context(request);
    try {
      const user = this.getUserInfo(request);
      const cart = await this.service.clearCart(user.id, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }

  private error(error: unknown, ctx: ReturnType<CartController['context']>): ApiResponse<unknown> {
    if (error instanceof ValidationException) return validationError(error.message, ctx);
    if (error instanceof NotFoundException || (error as any)?.code === 'not_found') return notFound(error instanceof Error ? error.message : 'not_found', ctx);
    if (error instanceof ForbiddenError || (error as any)?.code === 'forbidden') return forbidden(error instanceof Error ? error.message : 'forbidden', ctx);
    return {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      body: { success: false, error: { code: 'internal_error', message: error instanceof Error ? error.message : 'internal_error' }, meta: ctx },
    };
  }
}

export default CartController;
