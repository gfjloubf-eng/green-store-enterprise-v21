import type { ApiVersion } from '../api';
import type { Permission, PermissionScope, RoleName } from '../rbac';
import type { RouteProtectionMode } from '../route-protection';

export type RouteMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
export type RouteVersion = ApiVersion | (string & {});

export interface RouteMetadata {
  readonly name: string;
  readonly path: string;
  readonly version: RouteVersion;
  readonly mode: RouteProtectionMode;
  readonly tags: readonly string[];
  readonly authenticationRequired: boolean;
  readonly authorizationRequired: boolean;
  readonly publicRoute: boolean;
  readonly privateRoute: boolean;
  readonly requiredPermissions: readonly Permission[];
  readonly requiredRoles: readonly RoleName[];
  readonly requiredScope?: PermissionScope;
  readonly requireAllPermissions: boolean;
  readonly tenantScope?: PermissionScope;
  readonly middleware: readonly string[];
}

export interface RouteOptions {
  readonly name?: string;
  readonly path?: string;
  readonly version?: RouteVersion;
  readonly mode?: RouteProtectionMode;
  readonly tags?: readonly string[];
  readonly authenticationRequired?: boolean;
  readonly authorizationRequired?: boolean;
  readonly publicRoute?: boolean;
  readonly privateRoute?: boolean;
  readonly requiredPermissions?: readonly Permission[];
  readonly requiredRoles?: readonly RoleName[];
  readonly requiredScope?: PermissionScope;
  readonly requireAllPermissions?: boolean;
  readonly tenantScope?: PermissionScope;
  readonly middleware?: readonly string[];
}

export interface RouteExecutionContext {
  readonly name: string;
  readonly method: RouteMethod;
  readonly path: string;
  readonly version: RouteVersion;
  readonly metadata: Readonly<RouteMetadata>;
  readonly body?: unknown;
  readonly query?: Record<string, string | string[] | undefined>;
  readonly params?: Record<string, string | undefined>;
  readonly headers?: Record<string, string | string[] | undefined>;
}

export type RouteHandler = (context: RouteExecutionContext) => unknown | Promise<unknown>;

export interface RouteDefinition {
  readonly name: string;
  readonly method: RouteMethod;
  readonly path: string;
  readonly version: RouteVersion;
  readonly handler: RouteHandler;
  readonly metadata: Readonly<RouteMetadata>;
}

export interface RouteGroup {
  readonly name: string;
  readonly prefix: string;
  readonly version?: RouteVersion;
  readonly metadata?: Partial<RouteOptions>;
  readonly routes: readonly RouteDefinition[];
}
