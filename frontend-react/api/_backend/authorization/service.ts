import {
  hasAnyPermission as hasRbacAnyPermission,
  hasPermission as hasRbacPermission,
} from '../rbac';
import type { Permission, PermissionScope, RoleName } from '../rbac';
import {
  ForbiddenError,
  PermissionDeniedError,
  RoleDeniedError,
  UnauthorizedError,
} from './errors';
import type { AuthorizationCheckOptions, AuthorizationContext, AuthorizationEngine, AuthorizationResult } from './types';

export class AuthorizationService implements AuthorizationEngine {
  public evaluate(context: AuthorizationContext, options: AuthorizationCheckOptions = {}): AuthorizationResult {
    const requiredPermissions = this.normalizePermissions(options.requiredPermissions);
    const requiredRoles = this.normalizeRoles(options.requiredRoles);
    const requiredScope = options.requiredScope ?? context.requiredScope;

    const roleMatches = this.hasRequiredRoles(context.roles, requiredRoles);
    const missingRoles = this.getMissingRoles(context.roles, requiredRoles);

    const permissions = this.normalizePermissions(context.permissions);
    const missingPermissions = this.getMissingPermissions(permissions, requiredPermissions, options.requireAllPermissions !== false);

    if (!requiredRoles.length && !requiredPermissions.length && !requiredScope) {
      return this.createResult(true, 'authorized', [], [], this.getPrimaryRole(context.roles), context.scope ?? null);
    }

    if (requiredRoles.length > 0 && missingRoles.length > 0) {
      return this.createResult(false, 'missing_roles', [], missingRoles, this.getPrimaryRole(context.roles), context.scope ?? null);
    }

    if (requiredPermissions.length > 0 && missingPermissions.length > 0) {
      return this.createResult(false, 'missing_permissions', missingPermissions, [], this.getPrimaryRole(context.roles), context.scope ?? null);
    }

    if (requiredScope && !this.evaluateScope(context, requiredScope)) {
      return this.createResult(false, 'scope_denied', [], [], this.getPrimaryRole(context.roles), requiredScope);
    }

    const authorized = roleMatches && requiredRoles.length === 0 ? true : roleMatches;

    return this.createResult(authorized, 'authorized', [], [], this.getPrimaryRole(context.roles), context.scope ?? null);
  }

  public can(context: AuthorizationContext, permission: Permission | string, options: Omit<AuthorizationCheckOptions, 'requiredPermissions'> = {}): AuthorizationResult {
    return this.evaluate(context, { ...options, requiredPermissions: [permission] });
  }

  public cannot(context: AuthorizationContext, permission: Permission | string, options: Omit<AuthorizationCheckOptions, 'requiredPermissions'> = {}): AuthorizationResult {
    const result = this.can(context, permission, options);
    return {
      ...result,
      authorized: !result.authorized,
      reason: result.authorized ? 'forbidden' : 'authorized',
    };
  }

  public hasPermission(context: AuthorizationContext, permission: Permission | string, options: AuthorizationCheckOptions = {}): AuthorizationResult {
    return this.evaluate(context, { ...options, requiredPermissions: [permission] });
  }

  public hasAnyPermission(context: AuthorizationContext, permissions: Array<Permission | string>, options: AuthorizationCheckOptions = {}): AuthorizationResult {
    return this.evaluate(context, { ...options, requiredPermissions: permissions, requireAllPermissions: false });
  }

  public hasAllPermissions(context: AuthorizationContext, permissions: Array<Permission | string>, options: AuthorizationCheckOptions = {}): AuthorizationResult {
    return this.evaluate(context, { ...options, requiredPermissions: permissions, requireAllPermissions: true });
  }

  public hasRole(context: AuthorizationContext, role: RoleName | string, options: Omit<AuthorizationCheckOptions, 'requiredRoles'> = {}): AuthorizationResult {
    return this.evaluate(context, { ...options, requiredRoles: [role] });
  }

  public hasAnyRole(context: AuthorizationContext, roles: Array<RoleName | string>, options: Omit<AuthorizationCheckOptions, 'requiredRoles'> = {}): AuthorizationResult {
    return this.evaluate(context, { ...options, requiredRoles: roles });
  }

  public isSuperAdmin(context: AuthorizationContext, options: Omit<AuthorizationCheckOptions, 'requiredRoles'> = {}): AuthorizationResult {
    return this.evaluate(context, { ...options, requiredRoles: ['SUPER_ADMIN'] });
  }

  public assertAuthorized(context: AuthorizationContext, options: AuthorizationCheckOptions = {}): AuthorizationResult {
    const result = this.evaluate(context, options);
    if (!result.authorized) {
      throw this.toError(result);
    }
    return result;
  }

  private createResult(
    authorized: boolean,
    reason: AuthorizationResult['reason'],
    missingPermissions: Permission[],
    missingRoles: RoleName[],
    evaluatedRole: RoleName | null,
    evaluatedScope: PermissionScope | null,
  ): AuthorizationResult {
    return {
      authorized,
      reason,
      missingPermissions,
      missingRoles,
      evaluatedRole,
      evaluatedScope,
    };
  }

  private normalizePermissions(permissions: Array<Permission | string> | undefined): Permission[] {
    return (permissions ?? []).map((permission) => permission.toString().toLowerCase() as Permission);
  }

  private normalizeRoles(roles: Array<RoleName | string> | undefined): RoleName[] {
    return (roles ?? []).map((role) => role.toString().toUpperCase() as RoleName);
  }

  private getMissingPermissions(
    grantedPermissions: Permission[],
    requiredPermissions: Permission[],
    requireAllPermissions: boolean,
  ): Permission[] {
    if (!requiredPermissions.length) {
      return [];
    }

    if (!requireAllPermissions) {
      return requiredPermissions.filter((permission) => !hasRbacAnyPermission(grantedPermissions, permission));
    }

    return requiredPermissions.filter((permission) => !hasRbacPermission(grantedPermissions, permission));
  }

  private getMissingRoles(grantedRoles: Array<RoleName | string> | undefined, requiredRoles: RoleName[]): RoleName[] {
    if (!requiredRoles.length) {
      return [];
    }

    return requiredRoles.filter((role) => !this.normalizeRoles(grantedRoles).includes(role));
  }

  private hasRequiredRoles(grantedRoles: Array<RoleName | string> | undefined, requiredRoles: RoleName[]): boolean {
    if (!requiredRoles.length) {
      return true;
    }

    return requiredRoles.some((role) => this.normalizeRoles(grantedRoles).includes(role));
  }

  private getPrimaryRole(grantedRoles: Array<RoleName | string> | undefined): RoleName | null {
    const normalized = this.normalizeRoles(grantedRoles);
    return normalized[0] ?? null;
  }

  private evaluateScope(context: AuthorizationContext, requiredScope: PermissionScope): boolean {
    if (requiredScope === 'self') {
      return Boolean(context.actorId && context.resourceOwnerId && context.actorId === context.resourceOwnerId);
    }

    const actorScope = context.scope;
    if (!actorScope) {
      return false;
    }

    const scopeRank: Record<PermissionScope, number> = {
      self: 1,
      branch: 2,
      store: 3,
      tenant: 4,
    };

    return scopeRank[actorScope] >= scopeRank[requiredScope];
  }

  private toError(result: AuthorizationResult): Error {
    if (result.reason === 'missing_permissions') {
      return new PermissionDeniedError(result.missingPermissions.join(', '));
    }

    if (result.reason === 'missing_roles') {
      return new RoleDeniedError(result.missingRoles.join(', '));
    }

    if (result.reason === 'scope_denied') {
      return new ForbiddenError('scope_denied');
    }

    if (result.reason === 'unauthorized') {
      return new UnauthorizedError('authorization_context_missing');
    }

    return new ForbiddenError('authorization_denied');
  }
}

export default new AuthorizationService();
