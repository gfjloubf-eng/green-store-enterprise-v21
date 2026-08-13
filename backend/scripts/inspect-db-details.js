const fs = require('fs');
const path = require('path');
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
      if (process.env[key] === undefined) process.env[key] = value.replace(/(^"|"$)/g, '');
    }
    if (process.env.DATABASE_URL) return;
  }
}

async function main() {
  loadEnvFile();
  if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED && process.env.DATABASE_URL?.includes('sslmode=require')) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        roles: {
          select: {
            role: { select: { id: true, name: true } }
          }
        }
      }
    });

    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        permissions: {
          select: {
            permission: { select: { id: true, resource: true, action: true } }
          }
        }
      }
    });

    const customers = await prisma.customer.findMany({
      select: { id: true, email: true, userId: true, customerCode: true }
    });

    console.log(JSON.stringify({ users, roles, customers }, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
