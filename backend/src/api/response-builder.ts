import type { ApiContext, ApiErrorResponse, ApiMeta, ApiPaginationResponse, ApiResponse, ApiSuccessResponse } from './contracts';
import { HTTP_STATUS } from './status';

function createMeta(context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiMeta {
  return {
    timestamp: context.timestamp,
    requestId: context.requestId,
    version: context.version,
    locale: context.locale,
  };
}

export function success<T>(data: T, context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiResponse<T> {
  return {
    statusCode: HTTP_STATUS.OK,
    body: {
      success: true,
      data,
      meta: createMeta(context),
    } satisfies ApiSuccessResponse<T>,
  };
}

export function created<T>(data: T, context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiResponse<T> {
  return {
    statusCode: HTTP_STATUS.CREATED,
    body: {
      success: true,
      data,
      meta: createMeta(context),
    } satisfies ApiSuccessResponse<T>,
  };
}

export function accepted(context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiResponse<null> {
  return {
    statusCode: HTTP_STATUS.ACCEPTED,
    body: {
      success: true,
      data: null,
      meta: createMeta(context),
    } satisfies ApiSuccessResponse<null>,
  };
}

export function noContent(context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiResponse<null> {
  return {
    statusCode: HTTP_STATUS.NO_CONTENT,
    body: {
      success: true,
      data: null,
      meta: createMeta(context),
    } satisfies ApiSuccessResponse<null>,
  };
}

export function badRequest(message: string, context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiResponse<null> {
  return errorResponse('bad_request', message, HTTP_STATUS.BAD_REQUEST, context);
}

export function unauthorized(message: string, context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiResponse<null> {
  return errorResponse('unauthorized', message, HTTP_STATUS.UNAUTHORIZED, context);
}

export function forbidden(message: string, context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiResponse<null> {
  return errorResponse('forbidden', message, HTTP_STATUS.FORBIDDEN, context);
}

export function notFound(message: string, context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiResponse<null> {
  return errorResponse('not_found', message, HTTP_STATUS.NOT_FOUND, context);
}

export function conflict(message: string, context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiResponse<null> {
  return errorResponse('conflict', message, HTTP_STATUS.CONFLICT, context);
}

export function validationError(message: string, context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiResponse<null> {
  return errorResponse('validation_error', message, HTTP_STATUS.UNPROCESSABLE_ENTITY, context);
}

export function internalError(message: string, context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiResponse<null> {
  return errorResponse('internal_error', message, HTTP_STATUS.INTERNAL_SERVER_ERROR, context);
}

function errorResponse(code: string, message: string, statusCode: number, context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>): ApiResponse<null> {
  return {
    statusCode,
    body: {
      success: false,
      error: {
        code,
        message,
      },
      meta: createMeta(context),
    } satisfies ApiErrorResponse,
  };
}

export function paginated<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  context: Pick<ApiContext, 'timestamp' | 'requestId' | 'version' | 'locale'>,
): ApiResponse<T> {
  return {
    statusCode: HTTP_STATUS.OK,
    body: {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / Math.max(limit, 1))),
      },
      meta: createMeta(context),
    } satisfies ApiPaginationResponse<T>,
  };
}
