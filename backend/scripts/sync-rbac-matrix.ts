import { PrismaClient, PermissionAction, RoleName } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

function loadEnvFile() {
  if (process.env.DATABASE_URL) return;
  const candidates = [
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../.env'),
  ];
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    const content = fs.readFileSync(candidate, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([^=\s]+)=(.*)$/);
      if (!match) continue;
      const [, key, value] = match;
      if (process.env[key] === undefined) process.env[key] = value.replace(/(^"|"$)/g, '');
    }
    if (process.env.DATABASE_URL) return;
  }
}

loadEnvFile();
if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED && process.env.DATABASE_URL?.includes('sslmode=require')) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const slug = process.env.DEFAULT_TENANT_SLUG || 'qutoof';
  let tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        id: randomUUID(),
        name: process.env.DEFAULT_TENANT_NAME || 'Qutoof Nature',
        slug,
      },
    });
  }

  const roleNames: RoleName[] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER'];
  const existingRoles = await prisma.role.findMany({ where: { tenantId: tenant.id } });
  const roleMap: Record<string, any> = {};

  for (const name of roleNames) {
    let r = existingRoles.find((e) => e.name === name);
    if (!r) {
      r = await prisma.role.create({
        data: { id: randomUUID(), tenantId: tenant.id, name },
      });
    }
    roleMap[name] = r;
  }

  const modules = [
    'users',
    'roles',
    'permissions',
    'products',
    'categories',
    'inventory',
    'orders',
    'customers',
    'suppliers',
    'payments',
    'reports',
    'settings',
    'audit',
    'notifications',
    'carts',
  ];
  const actions = [
    PermissionAction.CREATE,
    PermissionAction.READ,
    PermissionAction.UPDATE,
    PermissionAction.DELETE,
    PermissionAction.LIST,
  ];

  const existingPermissions = await prisma.permission.findMany();
  const permMap: Record<string, any> = {};

  for (const resource of modules) {
    for (const action of actions) {
      const key = `${resource}:${action.toLowerCase()}`;
      let p = existingPermissions.find((e) => e.resource === resource && e.action === action);
      if (!p) {
        p = await prisma.permission.create({
          data: {
            id: randomUUID(),
            resource,
            action,
            description: `${action} on ${resource}`,
          },
        });
      }
      permMap[key] = p;
    }
  }

  const existingRolePermissions = await prisma.rolePermission.findMany();
  const existingRpSet = new Set(existingRolePermissions.map((rp) => `${rp.roleId}_${rp.permissionId}`));

  const toCreate: Array<{ id: string; roleId: string; permissionId: string }> = [];

  function addMapping(roleName: string, permKey: string) {
    const role = roleMap[roleName];
    const perm = permMap[permKey];
    if (role && perm) {
      const pair = `${role.id}_${perm.id}`;
      if (!existingRpSet.has(pair)) {
        existingRpSet.add(pair);
        toCreate.push({ id: randomUUID(), roleId: role.id, permissionId: perm.id });
      }
    }
  }

  // SUPER_ADMIN -> ALL
  for (const key of Object.keys(permMap)) {
    addMapping('SUPER_ADMIN', key);
  }

  // ADMIN -> ALL except audit
  for (const key of Object.keys(permMap)) {
    if (!key.startsWith('audit:')) {
      addMapping('ADMIN', key);
    }
  }

  // MANAGER -> products, inventory, orders, customers, categories, reports
  const managerModules = ['products', 'inventory', 'orders', 'customers', 'categories', 'reports'];
  for (const key of Object.keys(permMap)) {
    if (managerModules.includes(key.split(':')[0])) {
      addMapping('MANAGER', key);
    }
  }

  // EMPLOYEE (STAFF)
  const employeeKeys = [
    'products:read', 'products:list',
    'customers:read', 'customers:list',
    'orders:read', 'orders:list', 'orders:update',
    'inventory:read', 'inventory:list',
  ];
  for (const k of employeeKeys) {
    addMapping('EMPLOYEE', k);
  }

  // CUSTOMER
  const customerKeys = [
    'customers:read', 'customers:update', 'customers:list',
    'orders:create', 'orders:read', 'orders:list',
    'carts:create', 'carts:read', 'carts:update', 'carts:delete', 'carts:list',
    'products:read', 'products:list',
  ];
  for (const k of customerKeys) {
    addMapping('CUSTOMER', k);
  }

  if (toCreate.length > 0) {
    await prisma.rolePermission.createMany({ data: toCreate, skipDuplicates: true });
  }

  console.log(JSON.stringify({ status: 'RBAC_SYNC_COMPLETE', createdRolePermissions: toCreate.length }));
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
