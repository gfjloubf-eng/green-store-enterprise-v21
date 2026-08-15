import { ALL_PERMISSIONS, PERMISSION_REGISTRY, ROLE_DEFINITIONS } from './constants';
import type { Permission, RoleName } from './types';

function normalizePermission(permission: Permission | string): Permission {
  const key = permission.toString();
  if (key in PERMISSION_REGISTRY) {
    return key as Permission;
  }
  return key as Permission;
}

function normalizePermissions(permissions?: Iterable<Permission | string>): Permission[] {
  return [...(permissions ?? [])].map((permission) => normalizePermission(permission));
}

export function hasPermission(permissions: Iterable<Permission | string> | undefined, permission: Permission | string): boolean {
  const normalizedPermission = normalizePermission(permission);
  return normalizePermissions(permissions).includes(normalizedPermission);
}

export function hasAnyPermission(permissions: Iterable<Permission | string> | undefined, ...requiredPermissions: Array<Permission | string>): boolean {
  return requiredPermissions.some((permission) => hasPermission(permissions, permission));
}

export function hasAllPermissions(permissions: Iterable<Permission | string> | undefined, ...requiredPermissions: Array<Permission | string>): boolean {
  return requiredPermissions.every((permission) => hasPermission(permissions, permission));
}

export function isSuperAdmin(roles: Iterable<RoleName | string> | undefined): boolean {
  return [...(roles ?? [])].some((role) => role.toString().toUpperCase() === 'SUPER_ADMIN');
}

export function getRolePermissions(role: RoleName | string): Permission[] {
  const normalizedRole = role.toString().toUpperCase() as RoleName;
  const roleDefinition = ROLE_DEFINITIONS.find((definition) => definition.name === normalizedRole);
  return roleDefinition?.permissions ?? [];
}

export function getAllPermissions(): Permission[] {
  return [...ALL_PERMISSIONS];
}
