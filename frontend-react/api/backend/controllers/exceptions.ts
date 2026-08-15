import { badRequest, conflict, forbidden, internalError, notFound, unauthorized, validationError } from '../api';
import type { ApiMeta } from '../api';
import { ForbiddenError, UnauthorizedError } from '../authorization';
import { ValidationException } from '../validation';
import type { ControllerContext, ControllerExecutionResult } from './types';

export function formatValidationErrors(message: string): string {
  return message || 'validation_failed';
}

export function mapControllerException(error: unknown, context: ControllerContext): ControllerExecutionResult<unknown> {
  if (error instanceof ValidationException) {
    return {
      success: false,
      response: validationError(formatValidationErrors(error.message), createApiContext(context)),
    };
  }

  if (error instanceof UnauthorizedError) {
    return {
      success: false,
      response: unauthorized(error.message, createApiContext(context)),
    };
  }

  if (error instanceof ForbiddenError) {
    return {
      success: false,
      response: forbidden(error.message, createApiContext(context)),
    };
  }

  if (isErrorWithCode(error, 'not_found')) {
    return {
      success: false,
      response: notFound(error.message, createApiContext(context)),
    };
  }

  if (isErrorWithCode(error, 'conflict')) {
    return {
      success: false,
      response: conflict(error.message, createApiContext(context)),
    };
  }

  if (isErrorWithCode(error, 'bad_request')) {
    return {
      success: false,
      response: badRequest(error.message, createApiContext(context)),
    };
  }

  return {
    success: false,
    response: internalError(error instanceof Error ? error.message : 'internal_error', createApiContext(context)),
  };
}

function createApiContext(context: ControllerContext): ApiMeta {
  return {
    timestamp: context.metadata.timestamp ?? new Date().toISOString(),
    requestId: context.metadata.requestId,
    version: (context.metadata.version ?? 'v1') as 'v1',
    locale: context.metadata.locale,
  };
}

function isErrorWithCode(error: unknown, code: string): error is Error & { code: string } {
  return error instanceof Error && 'code' in error && (error as { code?: string }).code === code;
}
