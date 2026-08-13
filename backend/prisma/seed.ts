import { PrismaClient, PermissionAction } from '@prisma/client';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function upsertTenant() {
  const slug = process.env.DEFAULT_TENANT_SLUG || 'qutoof';
  return prisma.tenant.upsert({
    where: { slug },
    update: {},
    create: {
      id: randomUUID(),
      name: process.env.DEFAULT_TENANT_NAME || 'Qutoof Nature',
      slug,
    },
  });
}

async function upsertStore(tenantId: string) {
  const slug = process.env.DEFAULT_STORE_SLUG || 'main-store';
  return prisma.store.upsert({
    where: { tenantId_slug: { tenantId, slug } } as any,
    update: {},
    create: {
      id: randomUUID(),
      tenantId,
      name: process.env.DEFAULT_STORE_NAME || 'Main Store',
      slug,
    },
  });
}

async function upsertBranch(storeId: string) {
  const code = process.env.DEFAULT_BRANCH_CODE || 'MAIN';
  return prisma.branch.upsert({
    where: { storeId_code: { storeId, code } } as any,
    update: {},
    create: {
      id: randomUUID(),
      storeId,
      name: process.env.DEFAULT_BRANCH_NAME || 'Main Branch',
      code,
    },
  });
}

async function upsertRoles(tenantId: string) {
  const roleNames = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CUSTOMER'];
  const created: any[] = [];
  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { tenantId_name: { tenantId, name } } as any,
      update: {},
      create: {
        id: randomUUID(),
        tenantId,
        name: name as any,
      },
    });
    created.push(role);
  }
  return created;
}

async function ensurePermissions() {
  const modules = ['users','roles','permissions','products','categories','inventory','orders','customers','suppliers','payments','reports','settings','audit','notifications'];
  const actions = [PermissionAction.CREATE, PermissionAction.READ, PermissionAction.UPDATE, PermissionAction.DELETE, PermissionAction.LIST];
  const perms: any[] = [];
  for (const resource of modules) {
    for (const action of actions) {
      const existing = await prisma.permission.findUnique({ where: { resource_action: { resource, action } } as any }).catch(() => null);
      if (existing) { perms.push(existing); continue; }
      const p = await prisma.permission.create({ data: { id: randomUUID(), resource, action } });
      perms.push(p);
    }
  }
  return perms;
}

async function mapPermissionsToRoles(roles: any[], permissions: any[]) {
  // Least privilege: SUPER_ADMIN gets all, ADMIN gets most, MANAGER gets subset, CUSTOMER gets read/list for relevant modules
  const superAdmin = roles.find(r => r.name === 'SUPER_ADMIN');
  const admin = roles.find(r => r.name === 'ADMIN');
  const manager = roles.find(r => r.name === 'MANAGER');
  const customer = roles.find(r => r.name === 'CUSTOMER');

  const permsByResource = permissions.reduce((acc, p) => { (acc[p.resource] = acc[p.resource] || []).push(p); return acc; }, {} as any);

  // Helper to ensure mapping exists
  async function ensureRolePermission(roleId: string, permissionId: string) {
    const exists = await prisma.rolePermission.findFirst({ where: { roleId, permissionId } });
    if (!exists) {
      await prisma.rolePermission.create({ data: { id: randomUUID(), roleId, permissionId } });
    }
  }

  // SUPER_ADMIN -> all
  if (superAdmin) {
    for (const p of permissions) await ensureRolePermission(superAdmin.id, p.id);
  }

  // ADMIN -> all except maybe audit/permissions management
  if (admin) {
    for (const p of permissions.filter((p:any) => p.resource !== 'audit')) await ensureRolePermission(admin.id, p.id);
  }

  // MANAGER -> products, inventory, orders, customers (CRUD)
  if (manager) {
    for (const res of ['products','inventory','orders','customers']) {
      for (const p of (permsByResource[res] || [])) await ensureRolePermission(manager.id, p.id);
    }
  }

  // CUSTOMER -> customers (read/list), orders (create, read, list)
  if (customer) {
    for (const p of permissions) {
      if (p.resource === 'customers' && [PermissionAction.READ, PermissionAction.LIST].includes(p.action)) await ensureRolePermission(customer.id, p.id);
      if (p.resource === 'orders' && [PermissionAction.CREATE, PermissionAction.READ, PermissionAction.LIST].includes(p.action)) await ensureRolePermission(customer.id, p.id);
    }
  }
}

async function upsertSystemSettings() {
  const settings = [
    { key: 'currency', value: process.env.DEFAULT_CURRENCY || 'USD' },
    { key: 'timezone', value: process.env.DEFAULT_TIMEZONE || 'UTC' },
    { key: 'language', value: process.env.DEFAULT_LANGUAGE || 'en' },
    { key: 'theme', value: process.env.DEFAULT_THEME || 'light' },
    { key: 'invoice_prefix', value: process.env.INVOICE_PREFIX || 'INV' },
    { key: 'order_prefix', value: process.env.ORDER_PREFIX || 'ORD' },
  ];
  for (const s of settings) {
    await prisma.systemSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: { id: randomUUID(), key: s.key, value: s.value } });
  }
}

export async function main() {
  // This seed is safe and idempotent. It requires environment variables for secrets if creating users.
  const tenant = await upsertTenant();
  const store = await upsertStore(tenant.id);
  await upsertBranch(store.id);
  const roles = await upsertRoles(tenant.id);
  const permissions = await ensurePermissions();
  await mapPermissionsToRoles(roles, permissions);
  await upsertSystemSettings();
}

if (require.main === module) {
  main()
    .then(async () => {
      await prisma.$disconnect();
      console.log('Seed completed');
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
