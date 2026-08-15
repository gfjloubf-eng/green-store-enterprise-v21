import type { ApiResponse } from '../api';
import type { ControllerContext, ControllerExecutionResult, ControllerRequest } from './types';

export interface Controller<TInput = unknown, TOutput = unknown, TContext extends ControllerContext = ControllerContext> {
  execute(request: ControllerRequest<TInput>, context?: TContext): Promise<ControllerExecutionResult<TOutput>>;
}

export interface CrudController<TInput = unknown, TOutput = unknown, TContext extends ControllerContext = ControllerContext> extends Controller<TInput, TOutput, TContext> {
  create?(request: ControllerRequest<TInput>, context?: TContext): Promise<ControllerExecutionResult<TOutput>>;
  update?(request: ControllerRequest<TInput>, context?: TContext): Promise<ControllerExecutionResult<TOutput>>;
  delete?(request: ControllerRequest<TInput>, context?: TContext): Promise<ControllerExecutionResult<TOutput>>;
}

export interface ReadController<TInput = unknown, TOutput = unknown, TContext extends ControllerContext = ControllerContext> extends Controller<TInput, TOutput, TContext> {
  get?(request: ControllerRequest<TInput>, context?: TContext): Promise<ControllerExecutionResult<TOutput>>;
  list?(request: ControllerRequest<TInput>, context?: TContext): Promise<ControllerExecutionResult<TOutput>>;
}

export interface WriteController<TInput = unknown, TOutput = unknown, TContext extends ControllerContext = ControllerContext> extends Controller<TInput, TOutput, TContext> {
  create?(request: ControllerRequest<TInput>, context?: TContext): Promise<ControllerExecutionResult<TOutput>>;
  update?(request: ControllerRequest<TInput>, context?: TContext): Promise<ControllerExecutionResult<TOutput>>;
  delete?(request: ControllerRequest<TInput>, context?: TContext): Promise<ControllerExecutionResult<TOutput>>;
}

export interface HealthController<TOutput = unknown, TContext extends ControllerContext = ControllerContext> extends Controller<never, TOutput, TContext> {
  health?(context?: TContext): Promise<ControllerExecutionResult<TOutput>>;
}

export interface ControllerResponseBuilder<TOutput = unknown> {
  build(payload: TOutput, context: ControllerContext): ApiResponse<TOutput>;
}
