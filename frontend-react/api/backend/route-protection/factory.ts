import { PermissionMiddleware } from '../middleware';
import type { PermissionMiddlewareContract } from '../middleware';
import type { Permission, RoleName } from '../rbac';
import type { ProtectedRoute, RouteProtectionContext, RouteProtectionResult, RouteSecurityMetadata } from './types';

export class RouteProtectionFactory {
  constructor(private readonly permissionMiddleware: PermissionMiddlewareContract = new PermissionMiddleware()) {}

  public protectRoute(context: RouteProtectionContext): RouteProtectionResult {
    const metadata = context.route.metadata;

    if (metadata.mode === 'public') {
      return this.createResult(true, 'public', metadata);
    }

    if (!metadata.authenticationRequired || !context.user) {
      return this.createResult(false, 'unauthorized', metadata);
    }

    const middlewareResult = this.permissionMiddleware.requirePermission(context.user, {
      requiredPermissions: metadata.requiredPermissions ? [...metadata.requiredPermissions] : undefined,
      requiredRoles: metadata.requiredRoles ? [...metadata.requiredRoles] : undefined,
      requiredScope: metadata.requiredScope,
      requireAllPermissions: metadata.requireAllPermissions,
    });

    return {
      authorized: middlewareResult.authorized,
      reason: middlewareResult.authorized ? 'authorized' : middlewareResult.reason === 'missing_roles' ? 'missing_roles' : middlewareResult.reason === 'missing_permissions' ? 'missing_permissions' : middlewareResult.reason === 'scope_denied' ? 'scope_denied' : 'forbidden',
      requiredRole: metadata.requiredRoles?.[0],
      requiredPermission: metadata.requiredPermissions?.[0],
      scope: metadata.requiredScope,
      metadata,
    };
  }

  public protectPublicRoute(route: ProtectedRoute): ProtectedRoute {
    return {
      ...route,
      metadata: {
        ...route.metadata,
        mode: 'public',
        authenticationRequired: false,
      },
    };
  }

  public protectPrivateRoute(route: ProtectedRoute): ProtectedRoute {
    return {
      ...route,
      metadata: {
        ...route.metadata,
        mode: 'private',
        authenticationRequired: true,
      },
    };
  }

  public protectRole(route: ProtectedRoute, role: RoleName): ProtectedRoute {
    return {
      ...route,
      metadata: {
        ...route.metadata,
        requiredRoles: [role],
      },
    };
  }

  public protectPermission(route: ProtectedRoute, permission: Permission): ProtectedRoute {
    return {
      ...route,
      metadata: {
        ...route.metadata,
        requiredPermissions: [permission],
      },
    };
  }

  private createResult(authorized: boolean, reason: RouteProtectionResult['reason'], metadata: RouteSecurityMetadata): RouteProtectionResult {
    return {
      authorized,
      reason,
      metadata,
    };
  }
}

export default new RouteProtectionFactory();
