import { created, noContent, success, validationError } from '../api';
import type { ApiMeta, ApiResponse, ApiVersion } from '../api';
import { ForbiddenError, UnauthorizedError } from '../authorization';
import type { AuthorizationContext, AuthorizationEngine } from '../authorization';
import type { ValidationResult, Validator } from '../validation';
import { ValidationException } from '../validation';
import { mapControllerException } from './exceptions';
import type {
  Controller,
  ControllerResponseBuilder,
} from './contracts';
import type {
  ControllerContext,
  ControllerExecutionPipeline,
  ControllerExecutionResult,
  ControllerHooks,
  ControllerRequest,
} from './types';

export abstract class BaseController<TInput = unknown, TOutput = unknown, TContext extends ControllerContext = ControllerContext>
  implements Controller<TInput, TOutput, TContext>
{
  constructor(
    protected readonly config: {
      readonly hooks?: ControllerHooks<TInput, TOutput, TContext>;
      readonly pipeline?: ControllerExecutionPipeline<TInput, TOutput, TContext>;
      readonly authorizationEngine?: AuthorizationEngine;
      readonly validator?: Validator<TInput>;
      readonly responseBuilder?: ControllerResponseBuilder<TOutput>;
    } = {},
  ) {}

  public async execute(request: ControllerRequest<TInput>, context?: TContext): Promise<ControllerExecutionResult<TOutput>> {
    const resolvedContext = this.resolveContext(request, context);

    try {
      await this.runHook('beforeValidation', request, resolvedContext);
      const validationResult = await this.runValidation(request, resolvedContext);
      if (!validationResult.valid) {
        return {
          success: false,
          response: this.buildValidationResponse(validationResult, resolvedContext),
        };
      }

      await this.runHook('afterValidation', request, resolvedContext, validationResult);
      await this.enforceAuthorization(request, resolvedContext);
      await this.runHook('beforeExecution', request, resolvedContext);

      const output = await this.executeCore(request, resolvedContext);
      await this.runHook('afterExecution', request, resolvedContext, output);

      const mappedOutput = this.mapOutput(output, resolvedContext);
      await this.runHook('beforeResponse', request, resolvedContext, mappedOutput as TOutput);
      const response = this.createResponse(mappedOutput, resolvedContext);
      await this.runHook('afterResponse', request, resolvedContext, response as ApiResponse<TOutput>);

      return {
        success: true,
        response: response as ApiResponse<TOutput>,
      };
    } catch (error) {
      return mapControllerException(error, resolvedContext) as ControllerExecutionResult<TOutput>;
    }
  }

  protected abstract executeCore(request: ControllerRequest<TInput>, context: TContext): Promise<TOutput> | TOutput;

  protected async runValidation(request: ControllerRequest<TInput>, context: TContext): Promise<ValidationResult> {
    const validator = this.config.validator ?? this.config.pipeline?.validator;
    const input = request.body as TInput;

    if (!validator) {
      return { valid: true, errors: [] };
    }

    if (validator.validateAsync) {
      return validator.validateAsync(input);
    }

    return validator.validate(input);
  }

  protected async enforceAuthorization(request: ControllerRequest<TInput>, context: TContext): Promise<void> {
    const pipeline = this.config.pipeline;
    const authorizationEngine = this.config.authorizationEngine;
    const authorizationContext = pipeline?.authorizationContext ?? this.createAuthorizationContext(context);

    if (!authorizationEngine || !authorizationContext) {
      return;
    }

    const result = authorizationEngine.evaluate(authorizationContext, pipeline?.authorizationOptions);
    if (!result.authorized) {
      throw result.reason === 'unauthorized' ? new UnauthorizedError('authorization_required') : new ForbiddenError('authorization_denied');
    }
  }

  protected createAuthorizationContext(context: TContext): AuthorizationContext | undefined {
    const user = context.user;
    if (!user) {
      return undefined;
    }

    return {
      actorId: user.id,
      roles: user.roles,
      permissions: user.permissions,
      tenantId: user.tenantId ?? context.tenant?.tenantId,
      storeId: user.storeId ?? context.tenant?.storeId,
      branchId: user.branchId ?? context.tenant?.branchId,
      scope: 'tenant',
      requiredScope: 'tenant',
    };
  }

  protected mapOutput(output: TOutput, context: TContext): unknown {
    if (this.config.pipeline?.mapResponse) {
      return this.config.pipeline.mapResponse(output, context);
    }

    return output;
  }

  protected createResponse(payload: unknown, context: TContext): ApiResponse<unknown> {
    if (this.config.responseBuilder) {
      return this.config.responseBuilder.build(payload as TOutput, context) as ApiResponse<unknown>;
    }

    if (this.config.pipeline?.createResponse) {
      return this.config.pipeline.createResponse(payload, context);
    }

    return success(payload, this.createApiContext(context));
  }

  protected createSuccessResponse(payload: unknown, context: TContext): ApiResponse<unknown> {
    return success(payload, this.createApiContext(context));
  }

  protected createCreatedResponse(payload: unknown, context: TContext): ApiResponse<unknown> {
    return created(payload, this.createApiContext(context));
  }

  protected createAcceptedResponse(context: TContext): ApiResponse<unknown> {
    return noContent(this.createApiContext(context));
  }

  protected buildValidationResponse(result: ValidationResult, context: TContext): ApiResponse<TOutput> {
    const message = result.errors.map((error) => error.message).join('; ') || 'validation_failed';
    return validationError(message, this.createApiContext(context)) as ApiResponse<TOutput>;
  }

  protected createApiContext(context: TContext): Pick<ApiMeta, 'timestamp' | 'requestId' | 'version' | 'locale'> {
    return {
      timestamp: context.metadata.timestamp ?? new Date().toISOString(),
      requestId: context.metadata.requestId,
      version: (context.metadata.version ?? 'v1') as ApiVersion,
      locale: context.metadata.locale,
    };
  }

  protected async runHook(
    hookName: keyof ControllerHooks<TInput, TOutput, TContext>,
    request: ControllerRequest<TInput>,
    context: TContext,
    value?: unknown,
  ): Promise<void> {
    const hooks = this.config.hooks;
    if (!hooks) {
      return;
    }

    switch (hookName) {
      case 'beforeValidation':
        if (hooks.beforeValidation) {
          await hooks.beforeValidation(request, context);
        }
        break;
      case 'afterValidation':
        if (hooks.afterValidation && value !== undefined) {
          await hooks.afterValidation(request, value as ValidationResult, context);
        }
        break;
      case 'beforeExecution':
        if (hooks.beforeExecution) {
          await hooks.beforeExecution(request, context);
        }
        break;
      case 'afterExecution':
        if (hooks.afterExecution && value !== undefined) {
          await hooks.afterExecution(request, value as TOutput, context);
        }
        break;
      case 'beforeResponse':
        if (hooks.beforeResponse && value !== undefined) {
          await hooks.beforeResponse(request, value as TOutput, context);
        }
        break;
      case 'afterResponse':
        if (hooks.afterResponse && value !== undefined) {
          await hooks.afterResponse(request, value as ApiResponse<TOutput>, context);
        }
        break;
      default:
        break;
    }
  }

  protected resolveContext(request: ControllerRequest<TInput>, context?: TContext): TContext {
    return context ?? (request.context as TContext);
  }
}
