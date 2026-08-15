export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'list';

export type PermissionModule =
  | 'users'
  | 'roles'
  | 'permissions'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'branches'
  | 'stores'
  | 'suppliers'
  | 'payments'
  | 'reports'
  | 'settings'
  | 'audit'
  | 'notifications'
  | 'carts';

export type PermissionScope = 'tenant' | 'store' | 'branch' | 'self';

export type RoleName = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'CUSTOMER';

export type Permission = `${PermissionModule}:${PermissionAction}`;

export interface PermissionDefinition {
  key: Permission;
  module: PermissionModule;
  action: PermissionAction;
  scope: PermissionScope;
  description: string;
}

export interface PermissionGroup {
  module: PermissionModule;
  scope: PermissionScope;
  permissions: PermissionDefinition[];
}

export interface RoleDefinition {
  name: RoleName;
  description: string;
  scope: PermissionScope;
  permissions: Permission[];
}

export interface RolePermission {
  role: RoleName;
  permission: Permission;
}
