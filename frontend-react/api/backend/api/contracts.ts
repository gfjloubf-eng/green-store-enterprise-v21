export type ApiVersion = 'v1';

export interface ApiMeta {
  readonly timestamp: string;
  readonly requestId?: string;
  readonly version: ApiVersion;
  readonly processingTime?: number;
  readonly locale?: string;
}

export interface ApiPaginationResponse<T> {
  readonly data: T[];
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
  };
  readonly meta: ApiMeta;
}

export interface ApiSuccessResponse<T> {
  readonly success: true;
  readonly data: T;
  readonly meta: ApiMeta;
}

export interface ApiErrorResponse {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
  readonly meta: ApiMeta;
}

export interface ApiRequest<TBody = unknown> {
  readonly body?: TBody;
  readonly query?: Record<string, string | string[] | undefined>;
  readonly params?: Record<string, string | undefined>;
  readonly headers?: Record<string, string | string[] | undefined>;
}

export interface ApiResponse<T> {
  readonly statusCode: number;
  readonly body: ApiSuccessResponse<T> | ApiErrorResponse | ApiPaginationResponse<T>;
}

export interface ApiContext {
  readonly requestId?: string;
  readonly correlationId?: string;
  readonly timestamp: string;
  readonly version: ApiVersion;
  readonly locale?: string;
  readonly userContext?: {
    readonly userId?: string;
  };
  readonly tenantContext?: {
    readonly tenantId?: string;
    readonly storeId?: string;
    readonly branchId?: string;
  };
}

export interface ValidatedRequest<TBody = unknown> extends ApiRequest<TBody> {
  readonly context: ApiContext;
}

export interface AuthorizedRequest<TBody = unknown> extends ValidatedRequest<TBody> {
  readonly authorized: boolean;
}

export interface HandledRequest<TBody = unknown> extends AuthorizedRequest<TBody> {
  readonly response: ApiResponse<unknown>;
}
