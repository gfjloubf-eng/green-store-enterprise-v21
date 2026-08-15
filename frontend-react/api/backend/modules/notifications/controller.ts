import { HTTP_STATUS, success } from '../../api';
import type { ApiMeta, ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { UnauthorizedError } from '../../common/security/errors';
import { ValidationException } from '../../validation';
import { NotificationRepository } from '../../repositories/notification-repository';

type ApiContextFields = Pick<ApiMeta, 'timestamp' | 'requestId' | 'version' | 'locale'>;

export class NotificationsController {
  private notificationRepo = new NotificationRepository();

  public async listUserNotifications(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const result = await this.notificationRepo.findUserNotifications(user.id);
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async markAsRead(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const notificationId = request.params?.id;
      if (!notificationId) {
        return this.errorResponse('bad_request', 'notification_id_required', HTTP_STATUS.BAD_REQUEST, ctx);
      }

      const updated = await this.notificationRepo.markAsRead(notificationId, user.id);
      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async markAllAsRead(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const count = await this.notificationRepo.markAllAsRead(user.id);
      return success({ count }, ctx);
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

export default NotificationsController;
