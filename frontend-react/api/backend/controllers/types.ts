import type { ApiRequest, ApiResponse } from '../api';
import type { AuthorizationCheckOptions, AuthorizationContext } from '../authorization';
import type { Permission, PermissionScope, RoleName } from '../rbac';
import type { RequestMetadataDto } from '../dto';
import type { ValidationResult, Validator } from '../validation';

export interface AuthenticatedUser {
  readonly id?: string;
  readonly email?: string;
  readonly roles?: Array<RoleName | string>;
  readonly permissions?: Array<Permission | string>;
  readonly tenantId?: string;
  readonly storeId?: string;
  readonly branchId?: string;
}

export interface TenantContext {
  readonly tenantId?: string;
  readonly storeId?: string;
  readonly branchId?: string;
}

export interface ControllerRequestMetadata extends RequestMetadataDto {
  readonly requestId?: string;
  readonly correlationId?: string;
  readonly timestamp?: string;
  readonly version?: string;
  readonly locale?: string;
}

export interface ControllerContext<TUser = AuthenticatedUser> {
  readonly user?: TUser;
  readonly tenant?: TenantContext;
  readonly metadata: ControllerRequestMetadata;
  readonly authorization?: AuthorizationContext;
}

export interface ControllerRequest<
  TBody = unknown,
  TParams extends Record<string, string | undefined> = Record<string, string | undefined>,
  TQuery extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>,
> extends ApiRequest<TBody> {
  readonly body?: TBody;
  readonly params?: TParams;
  readonly query?: TQuery;
  readonly headers?: Record<string, string | string[] | undefined>;
  readonly context: ControllerContext;
}

export interface ControllerExecutionResult<TBody = unknown> {
  readonly success: boolean;
  readonly response: ApiResponse<TBody>;
}

export interface ControllerHooks<TInput = unknown, TOutput = unknown, TContext extends ControllerContext = ControllerContext> {
  beforeValidation?: (request: ControllerRequest<TInput>, context: TContext) => void | Promise<void>;
  afterValidation?: (request: ControllerRequest<TInput>, result: ValidationResult, context: TContext) => void | Promise<void>;
  beforeExecution?: (request: ControllerRequest<TInput>, context: TContext) => void | Promise<void>;
  afterExecution?: (request: ControllerRequest<TInput>, output: TOutput, context: TContext) => void | Promise<void>;
  beforeResponse?: (request: ControllerRequest<TInput>, output: TOutput, context: TContext) => void | Promise<void>;
  afterResponse?: (request: ControllerRequest<TInput>, response: ApiResponse<TOutput>, context: TContext) => void | Promise<void>;
}

export interface ControllerExecutionPipeline<TInput = unknown, TOutput = unknown, TContext extends ControllerContext = ControllerContext> {
  validator?: Validator<TInput>;
  authorizationContext?: AuthorizationContext;
  authorizationOptions?: AuthorizationCheckOptions;
  execute: (request: ControllerRequest<TInput>, context: TContext) => Promise<TOutput> | TOutput;
  mapResponse?: (output: TOutput, context: TContext) => unknown;
  createResponse?: (payload: unknown, context: TContext) => ApiResponse<unknown>;
}
