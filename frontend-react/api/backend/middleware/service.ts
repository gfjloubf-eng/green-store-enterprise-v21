import AuthorizationService from '../authorization/service';
import type { AuthorizationEngine } from '../authorization';
import type { Permission, PermissionScope, RoleName } from '../rbac';
import type { AuthenticatedUser, MiddlewareResult, PermissionMiddlewareContract, PermissionRequest } from './types';
import { buildAuthorizationContext, extractUserPermissions, extractUserRoles, normalizePermissions, normalizeRoles } from './utils';

export class PermissionMiddleware implements PermissionMiddlewareContract {
  constructor(private readonly authorizationService: AuthorizationEngine = AuthorizationService) {}

  public requirePermission(user: AuthenticatedUser | undefined, request: PermissionRequest): MiddlewareResult {
    const context = buildAuthorizationContext(user, request);
    const result = this.authorizationService.evaluate(context, {
      requiredPermissions: request.requiredPermissions,
      requiredRoles: request.requiredRoles,
      requiredScope: request.requiredScope,
      requireAllPermissions: request.requireAllPermissions,
    });

    return {
      ...result,
      requiredPermissions: normalizePermissions(request.requiredPermissions),
    };
  }

  public requireAnyPermission(user: AuthenticatedUser | undefined, permissions: Array<Permission | string>, request: PermissionRequest = {}): MiddlewareResult {
    const context = buildAuthorizationContext(user, request);
    const result = this.authorizationService.hasAnyPermission(context, permissions, {
      requiredRoles: request.requiredRoles,
      requiredScope: request.requiredScope,
    });

    return {
      ...result,
      requiredPermissions: normalizePermissions(permissions),
    };
  }

  public requireAllPermissions(user: AuthenticatedUser | undefined, permissions: Array<Permission | string>, request: PermissionRequest = {}): MiddlewareResult {
    const context = buildAuthorizationContext(user, request);
    const result = this.authorizationService.hasAllPermissions(context, permissions, {
      requiredRoles: request.requiredRoles,
      requiredScope: request.requiredScope,
    });

    return {
      ...result,
      requiredPermissions: normalizePermissions(permissions),
    };
  }

  public requireRole(user: AuthenticatedUser | undefined, role: RoleName | string, request: PermissionRequest = {}): MiddlewareResult {
    const context = buildAuthorizationContext(user, request);
    const result = this.authorizationService.hasRole(context, role, { requiredScope: request.requiredScope });

    return {
      ...result,
      requiredPermissions: [],
    };
  }

  public requireAnyRole(user: AuthenticatedUser | undefined, roles: Array<RoleName | string>, request: PermissionRequest = {}): MiddlewareResult {
    const context = buildAuthorizationContext(user, request);
    const result = this.authorizationService.hasAnyRole(context, roles, { requiredScope: request.requiredScope });

    return {
      ...result,
      requiredPermissions: [],
    };
  }

  public requireSuperAdmin(user: AuthenticatedUser | undefined, request: PermissionRequest = {}): MiddlewareResult {
    const context = buildAuthorizationContext(user, request);
    const result = this.authorizationService.isSuperAdmin(context, { requiredScope: request.requiredScope });

    return {
      ...result,
      requiredPermissions: [],
    };
  }

  public evaluateScope(user: AuthenticatedUser | undefined, requiredScope: PermissionScope): MiddlewareResult {
    const context = buildAuthorizationContext(user, { requiredScope });
    const result = this.authorizationService.evaluate(context, { requiredScope });

    return {
      ...result,
      requiredPermissions: [],
    };
  }

  public extractUserPermissions(user?: AuthenticatedUser): Permission[] {
    return extractUserPermissions(user);
  }

  public extractUserRoles(user?: AuthenticatedUser): RoleName[] {
    return extractUserRoles(user);
  }

  public normalizePermissions(permissions?: Array<Permission | string>): Permission[] {
    return normalizePermissions(permissions);
  }

  public normalizeRoles(roles?: Array<RoleName | string>): RoleName[] {
    return normalizeRoles(roles);
  }
}

export default new PermissionMiddleware();
