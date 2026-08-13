import type { Permission, PermissionScope, RoleName } from '../rbac';
import type { AuthenticatedUser, PermissionRequest } from '../middleware';

export type RouteProtectionMode = 'public' | 'private';

export interface RoutePermission {
  permission: Permission;
}

export interface RouteRole {
  role: RoleName;
}

export interface RouteSecurityMetadata {
  readonly name: string;
  readonly path: string;
  readonly mode: RouteProtectionMode;
  readonly authenticationRequired: boolean;
  readonly requiredPermissions?: readonly Permission[];
  readonly requiredRoles?: readonly RoleName[];
  readonly requiredScope?: PermissionScope;
  readonly requireAllPermissions?: boolean;
}

export interface ProtectedRoute {
  readonly name: string;
  readonly path: string;
  readonly metadata: Readonly<RouteSecurityMetadata>;
}

export interface RouteProtectionResult {
  readonly authorized: boolean;
  readonly reason: 'authorized' | 'public' | 'unauthorized' | 'forbidden' | 'missing_roles' | 'missing_permissions' | 'scope_denied';
  readonly requiredRole?: RoleName;
  readonly requiredPermission?: Permission;
  readonly scope?: PermissionScope;
  readonly metadata: Readonly<RouteSecurityMetadata>;
}

export interface RouteProtectionContext {
  user?: AuthenticatedUser;
  request?: PermissionRequest;
  route: ProtectedRoute;
}
