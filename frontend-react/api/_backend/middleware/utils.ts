import type { Permission, PermissionScope, RoleName } from '../rbac';
import type { AuthenticatedUser, PermissionRequest } from './types';

export function extractUserPermissions(user?: AuthenticatedUser): Permission[] {
  return (user?.permissions ?? []).map((permission) => permission.toString() as Permission);
}

export function extractUserRoles(user?: AuthenticatedUser): RoleName[] {
  return (user?.roles ?? []).map((role) => role.toString().toUpperCase() as RoleName);
}

export function normalizePermissions(permissions?: Array<Permission | string>): Permission[] {
  return (permissions ?? []).map((permission) => permission.toString() as Permission);
}

export function normalizeRoles(roles?: Array<RoleName | string>): RoleName[] {
  return (roles ?? []).map((role) => role.toString().toUpperCase() as RoleName);
}

export function buildAuthorizationContext(user?: AuthenticatedUser, request?: PermissionRequest): import('../authorization').AuthorizationContext {
  return {
    roles: user?.roles,
    permissions: user?.permissions,
    scope: user?.scope,
    requiredScope: request?.requiredScope,
    actorId: user?.id,
    tenantId: user?.tenantId,
    storeId: user?.storeId,
    branchId: user?.branchId,
  };
}

export function normalizeScope(scope?: PermissionScope): PermissionScope | undefined {
  return scope;
}
