import { HTTP_STATUS, success } from '../../api';
import type { ApiMeta, ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { UnauthorizedError } from '../../common/security/errors';
import { ValidationException } from '../../validation';
import { SettingsRepository } from '../../repositories/settings-repository';

type ApiContextFields = Pick<ApiMeta, 'timestamp' | 'requestId' | 'version' | 'locale'>;

export class SettingsController {
  private settingsRepo = new SettingsRepository();

  public async getPublicSettings(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);
    try {
      const publicSettings = await this.settingsRepo.getPublicSettings();
      return success(publicSettings, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async getAdminSettings(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const allSettings = await this.settingsRepo.getAllSettings();
      return success(allSettings, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async updateAdminSettings(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const body = request.body || {};
      const updated = await this.settingsRepo.updateSettings(body);
      return success(updated, ctx);
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

export default SettingsController;
