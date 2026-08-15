import type { Permission, PermissionScope, RoleName } from '../rbac';
import type { AuthorizationContext, AuthorizationResult } from '../authorization';

export interface AuthenticatedUser {
  id?: string;
  roles?: Array<RoleName | string>;
  permissions?: Array<Permission | string>;
  scope?: PermissionScope;
  tenantId?: string;
  storeId?: string;
  branchId?: string;
}

export interface PermissionRequest {
  requiredPermissions?: Array<Permission | string>;
  requiredRoles?: Array<RoleName | string>;
  requiredScope?: PermissionScope;
  requireAllPermissions?: boolean;
}

export interface AuthorizationMetadata {
  user?: AuthenticatedUser;
  request?: PermissionRequest;
  context?: AuthorizationContext;
}

export interface MiddlewareResult extends AuthorizationResult {
  requiredPermissions: Permission[];
}

export interface PermissionMiddlewareContract {
  requirePermission(user: AuthenticatedUser | undefined, request: PermissionRequest): MiddlewareResult;
  requireAnyPermission(user: AuthenticatedUser | undefined, permissions: Array<Permission | string>, request?: PermissionRequest): MiddlewareResult;
  requireAllPermissions(user: AuthenticatedUser | undefined, permissions: Array<Permission | string>, request?: PermissionRequest): MiddlewareResult;
  requireRole(user: AuthenticatedUser | undefined, role: RoleName | string, request?: PermissionRequest): MiddlewareResult;
  requireAnyRole(user: AuthenticatedUser | undefined, roles: Array<RoleName | string>, request?: PermissionRequest): MiddlewareResult;
  requireSuperAdmin(user: AuthenticatedUser | undefined, request?: PermissionRequest): MiddlewareResult;
  evaluateScope(user: AuthenticatedUser | undefined, requiredScope: PermissionScope): MiddlewareResult;
}
