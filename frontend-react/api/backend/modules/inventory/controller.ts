import { HTTP_STATUS, success } from '../../api';
import type { ApiMeta, ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { UnauthorizedError } from '../../common/security/errors';
import { ValidationException } from '../../validation';
import { InventoryRepository } from '../../repositories/inventory-repository';
import type { StockMovementType } from '@prisma/client';

type ApiContextFields = Pick<ApiMeta, 'timestamp' | 'requestId' | 'version' | 'locale'>;

export class InventoryController {
  private inventoryRepo = new InventoryRepository();

  public async listInventory(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const query = request.query || {};
      const result = await this.inventoryRepo.findInventoryList({
        status: query.status ? String(query.status) : undefined,
        search: query.search ? String(query.search) : undefined,
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10,
      });

      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async adjustStock(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const body = request.body || {};
      const { productId, type, quantity, reason } = body;

      if (!productId || !type || quantity === undefined) {
        return this.errorResponse('bad_request', 'product_id_type_and_quantity_required', HTTP_STATUS.BAD_REQUEST, ctx);
      }

      const validTypes: StockMovementType[] = ['IN', 'OUT', 'ADJUSTMENT'];
      if (!validTypes.includes(type)) {
        return this.errorResponse('bad_request', 'invalid_movement_type', HTTP_STATUS.BAD_REQUEST, ctx);
      }

      const updated = await this.inventoryRepo.adjustStock(
        productId,
        type as StockMovementType,
        Number(quantity),
        reason ? String(reason) : undefined,
        user.id
      );

      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async listMovements(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const query = request.query || {};
      const inventoryId = query.inventoryId ? String(query.inventoryId) : undefined;
      const movements = await this.inventoryRepo.findMovements(inventoryId);

      return success({ movements }, ctx);
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

export default InventoryController;
