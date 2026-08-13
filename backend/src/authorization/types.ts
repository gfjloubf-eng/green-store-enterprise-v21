import type { Permission, PermissionScope, RoleName } from '../rbac';

export interface AuthorizationContext {
  roles?: Array<RoleName | string>;
  permissions?: Array<Permission | string>;
  scope?: PermissionScope;
  requiredScope?: PermissionScope;
  actorId?: string;
  resourceOwnerId?: string;
  tenantId?: string;
  storeId?: string;
  branchId?: string;
}

export type AuthorizationDecisionReason =
  | 'authorized'
  | 'missing_permissions'
  | 'missing_roles'
  | 'scope_denied'
  | 'unauthorized'
  | 'forbidden';

export interface AuthorizationResult {
  authorized: boolean;
  reason: AuthorizationDecisionReason;
  missingPermissions: Permission[];
  missingRoles: RoleName[];
  evaluatedRole: RoleName | null;
  evaluatedScope: PermissionScope | null;
}

export interface AuthorizationCheckOptions {
  requiredRoles?: Array<RoleName | string>;
  requiredPermissions?: Array<Permission | string>;
  requiredScope?: PermissionScope;
  requireAllPermissions?: boolean;
}

export interface AuthorizationEngine {
  evaluate(context: AuthorizationContext, options?: AuthorizationCheckOptions): AuthorizationResult;
  can(context: AuthorizationContext, permission: Permission | string, options?: Omit<AuthorizationCheckOptions, 'requiredPermissions'>): AuthorizationResult;
  cannot(context: AuthorizationContext, permission: Permission | string, options?: Omit<AuthorizationCheckOptions, 'requiredPermissions'>): AuthorizationResult;
  hasPermission(context: AuthorizationContext, permission: Permission | string, options?: AuthorizationCheckOptions): AuthorizationResult;
  hasAnyPermission(context: AuthorizationContext, permissions: Array<Permission | string>, options?: AuthorizationCheckOptions): AuthorizationResult;
  hasAllPermissions(context: AuthorizationContext, permissions: Array<Permission | string>, options?: AuthorizationCheckOptions): AuthorizationResult;
  hasRole(context: AuthorizationContext, role: RoleName | string, options?: Omit<AuthorizationCheckOptions, 'requiredRoles'>): AuthorizationResult;
  hasAnyRole(context: AuthorizationContext, roles: Array<RoleName | string>, options?: Omit<AuthorizationCheckOptions, 'requiredRoles'>): AuthorizationResult;
  isSuperAdmin(context: AuthorizationContext, options?: Omit<AuthorizationCheckOptions, 'requiredRoles'>): AuthorizationResult;
  assertAuthorized(context: AuthorizationContext, options?: AuthorizationCheckOptions): AuthorizationResult;
}
