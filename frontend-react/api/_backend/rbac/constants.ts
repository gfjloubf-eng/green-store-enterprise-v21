import type {
  Permission,
  PermissionAction,
  PermissionDefinition,
  PermissionGroup,
  PermissionModule,
  PermissionScope,
  RoleDefinition,
  RoleName,
  RolePermission,
} from './types';

const MODULE_SCOPES: Record<PermissionModule, PermissionScope> = {
  users: 'tenant',
  roles: 'tenant',
  permissions: 'tenant',
  products: 'tenant',
  categories: 'tenant',
  inventory: 'tenant',
  orders: 'tenant',
  customers: 'tenant',
  branches: 'tenant',
  stores: 'tenant',
  suppliers: 'tenant',
  payments: 'tenant',
  reports: 'tenant',
  settings: 'tenant',
  audit: 'tenant',
  notifications: 'tenant',
  carts: 'tenant',
};

function createPermissionDefinition(module: PermissionModule, action: PermissionAction, description: string): PermissionDefinition {
  return {
    key: `${module}:${action}` as Permission,
    module,
    action,
    scope: MODULE_SCOPES[module],
    description,
  };
}

function createPermissionMap(module: PermissionModule, descriptions: Record<PermissionAction, string>): Record<PermissionAction, PermissionDefinition> {
  return {
    create: createPermissionDefinition(module, 'create', descriptions.create),
    read: createPermissionDefinition(module, 'read', descriptions.read),
    update: createPermissionDefinition(module, 'update', descriptions.update),
    delete: createPermissionDefinition(module, 'delete', descriptions.delete),
    list: createPermissionDefinition(module, 'list', descriptions.list),
  };
}

export const PERMISSION_DEFINITIONS: Record<PermissionModule, Record<PermissionAction, PermissionDefinition>> = {
  users: createPermissionMap('users', {
    create: 'Create users',
    read: 'Read users',
    update: 'Update users',
    delete: 'Delete users',
    list: 'List users',
  }),
  roles: createPermissionMap('roles', {
    create: 'Create roles',
    read: 'Read roles',
    update: 'Update roles',
    delete: 'Delete roles',
    list: 'List roles',
  }),
  permissions: createPermissionMap('permissions', {
    create: 'Create permissions',
    read: 'Read permissions',
    update: 'Update permissions',
    delete: 'Delete permissions',
    list: 'List permissions',
  }),
  products: createPermissionMap('products', {
    create: 'Create products',
    read: 'Read products',
    update: 'Update products',
    delete: 'Delete products',
    list: 'List products',
  }),
  categories: createPermissionMap('categories', {
    create: 'Create categories',
    read: 'Read categories',
    update: 'Update categories',
    delete: 'Delete categories',
    list: 'List categories',
  }),
  inventory: createPermissionMap('inventory', {
    create: 'Create inventory records',
    read: 'Read inventory records',
    update: 'Update inventory records',
    delete: 'Delete inventory records',
    list: 'List inventory records',
  }),
  orders: createPermissionMap('orders', {
    create: 'Create orders',
    read: 'Read orders',
    update: 'Update orders',
    delete: 'Delete orders',
    list: 'List orders',
  }),
  customers: createPermissionMap('customers', {
    create: 'Create customers',
    read: 'Read customers',
    update: 'Update customers',
    delete: 'Delete customers',
    list: 'List customers',
  }),
  branches: createPermissionMap('branches', {
    create: 'Create branches',
    read: 'Read branches',
    update: 'Update branches',
    delete: 'Delete branches',
    list: 'List branches',
  }),
  stores: createPermissionMap('stores', {
    create: 'Create stores',
    read: 'Read stores',
    update: 'Update stores',
    delete: 'Delete stores',
    list: 'List stores',
  }),
  suppliers: createPermissionMap('suppliers', {
    create: 'Create suppliers',
    read: 'Read suppliers',
    update: 'Update suppliers',
    delete: 'Delete suppliers',
    list: 'List suppliers',
  }),
  payments: createPermissionMap('payments', {
    create: 'Create payments',
    read: 'Read payments',
    update: 'Update payments',
    delete: 'Delete payments',
    list: 'List payments',
  }),
  reports: createPermissionMap('reports', {
    create: 'Create reports',
    read: 'Read reports',
    update: 'Update reports',
    delete: 'Delete reports',
    list: 'List reports',
  }),
  settings: createPermissionMap('settings', {
    create: 'Create settings',
    read: 'Read settings',
    update: 'Update settings',
    delete: 'Delete settings',
    list: 'List settings',
  }),
  audit: createPermissionMap('audit', {
    create: 'Create audit entries',
    read: 'Read audit entries',
    update: 'Update audit entries',
    delete: 'Delete audit entries',
    list: 'List audit entries',
  }),
  notifications: createPermissionMap('notifications', {
    create: 'Create notifications',
    read: 'Read notifications',
    update: 'Update notifications',
    delete: 'Delete notifications',
    list: 'List notifications',
  }),
  carts: createPermissionMap('carts', {
    create: 'Create cart items',
    read: 'Read cart',
    update: 'Update cart items',
    delete: 'Delete cart items',
    list: 'List cart items',
  }),
};

export const PERMISSION_GROUPS: PermissionGroup[] = (Object.entries(PERMISSION_DEFINITIONS) as Array<[PermissionModule, Record<PermissionAction, PermissionDefinition>]>).map(
  ([module, definitions]) => ({
    module,
    scope: MODULE_SCOPES[module],
    permissions: Object.values(definitions),
  }),
);

export const PERMISSION_REGISTRY: Readonly<Record<Permission, PermissionDefinition>> = PERMISSION_GROUPS.reduce(
  (registry, group) => {
    for (const permission of group.permissions) {
      registry[permission.key] = permission;
    }
    return registry;
  },
  {} as Record<Permission, PermissionDefinition>,
);

export const ALL_PERMISSIONS: Permission[] = Object.keys(PERMISSION_REGISTRY) as Permission[];

export const SUPPORTED_ROLES: readonly RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER'];

function createRoleDefinition(name: RoleName, description: string, permissions: Permission[]): RoleDefinition {
  return {
    name,
    description,
    scope: 'tenant',
    permissions,
  };
}

function getModulePermissions(module: PermissionModule): Permission[] {
  return Object.values(PERMISSION_DEFINITIONS[module]).map((permission) => permission.key);
}

function getPermissionsForModules(modules: PermissionModule[]): Permission[] {
  return modules.flatMap((module) => getModulePermissions(module));
}

function getPermissionsForModuleActions(module: PermissionModule, actions: PermissionAction[]): Permission[] {
  return Object.values(PERMISSION_DEFINITIONS[module])
    .filter((permission) => actions.includes(permission.action))
    .map((permission) => permission.key);
}

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  createRoleDefinition('SUPER_ADMIN', 'Full access across every module', [...ALL_PERMISSIONS]),
  createRoleDefinition('ADMIN', 'Administrative access with audit excluded', ALL_PERMISSIONS.filter((permission) => !permission.startsWith('audit:'))),
  createRoleDefinition('MANAGER', 'Operational access for products, inventory, orders, and customers', getPermissionsForModules(['products', 'inventory', 'orders', 'customers'])),
  createRoleDefinition('EMPLOYEE', 'Staff operational access for reading products, customers, inventory, and updating orders', [
    ...getPermissionsForModuleActions('products', ['read', 'list']),
    ...getPermissionsForModuleActions('customers', ['read', 'list']),
    ...getPermissionsForModuleActions('orders', ['read', 'list', 'update']),
    ...getPermissionsForModuleActions('inventory', ['read', 'list']),
  ]),
  createRoleDefinition('CUSTOMER', 'Read and create access for self-service orders and customer profile', [
    ...getPermissionsForModuleActions('customers', ['read', 'list']),
    ...getPermissionsForModuleActions('orders', ['create', 'read', 'list']),
    ...getPermissionsForModules(['carts']),
  ]),
];

export const ROLE_PERMISSION_REGISTRY: RolePermission[] = ROLE_DEFINITIONS.flatMap((role) =>
  role.permissions.map((permission) => ({ role: role.name, permission })),
);
