import { HTTP_STATUS, success } from '../../api';
import type { ApiMeta, ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { UnauthorizedError } from '../../common/security/errors';
import { ValidationException } from '../../validation';
import { AuditRepository } from '../../repositories/audit-repository';

type ApiContextFields = Pick<ApiMeta, 'timestamp' | 'requestId' | 'version' | 'locale'>;

export class AuditController {
  private auditRepo = new AuditRepository();

  public async listAuditLogs(request: ControllerRequest<any>): Promise<ApiResponse<any>> {
    const ctx = this.createApiContext(request);

    try {
      const user = (request as any).user;
      if (!user || !user.id) {
        return this.errorResponse('unauthorized', 'authentication_required', HTTP_STATUS.UNAUTHORIZED, ctx);
      }

      const { resource, action, actorId, page, limit } = request.query || {};
      const result = await this.auditRepo.findAuditLogs({
        resource: resource ? String(resource) : undefined,
        action: action ? String(action) : undefined,
        actorId: actorId ? String(actorId) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });

      return success(result, ctx);
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

export default AuditController;
