export type AppRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'CUSTOMER' | 'USER';

const LEGACY_ROLE_ALIASES: Record<string, AppRole> = {
  super_admin: 'SUPER_ADMIN',
  superadmin: 'SUPER_ADMIN',
  admin: 'ADMIN',
  manager: 'MANAGER',
  employee: 'EMPLOYEE',
  staff: 'EMPLOYEE',
  customer: 'CUSTOMER',
  user: 'USER',
};

export function normalizeAppRole(value: unknown): AppRole | string {
  const key = String(value ?? '').trim().toLowerCase();
  return LEGACY_ROLE_ALIASES[key] ?? String(value ?? '').trim().toUpperCase();
}

export function normalizeAppRoles(values: unknown): string[] {
  const source = Array.isArray(values) ? values : values ? [values] : [];
  return Array.from(new Set(source.map(normalizeAppRole).filter(Boolean)));
}

export function isManagementRole(value: unknown): boolean {
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE'].includes(normalizeAppRole(value));
}

export function isAdminRole(value: unknown): boolean {
  return ['SUPER_ADMIN', 'ADMIN'].includes(normalizeAppRole(value));
}

export function isOperationsManagerRole(value: unknown): boolean {
  return ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(normalizeAppRole(value));
}

export const ADMIN_DASHBOARD_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE'] as const;
