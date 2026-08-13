const fs = require('node:fs');
const path = require('node:path');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

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
      if (process.env[key] === undefined) {
        process.env[key] = value.replace(/(^"|"$)/g, '');
      }
    }
    if (process.env.DATABASE_URL) return;
  }
}

async function main(){
  loadEnvFile();
  if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED && process.env.DATABASE_URL?.includes('sslmode=require')) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  try {
    const counts = {};
    counts.users = await prisma.user.count({});
        counts.roles = await prisma.role.count({});
        counts.permissions = await prisma.permission.count({});
        counts.user_roles = await prisma.userRole.count({});
        counts.role_permissions = await prisma.rolePermission.count({});
        counts.products = await prisma.product.count({});

    // Output JSON only (no secrets)
    console.log(JSON.stringify({ snapshot: counts }));
  } catch (err) {
    console.error('ERROR', err && err.stack ? err.stack : err);
    process.exitCode = 2;
  } finally {
    try { await require('@prisma/client').PrismaClient.prototype.$disconnect(); } catch(e){}
  }
}

main();
