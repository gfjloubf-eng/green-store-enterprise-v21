import fs from 'node:fs';
import path from 'node:path';
import prismaClientPackage from '@prisma/client';
import type { PrismaClient as PrismaClientType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = prismaClientPackage;

function loadEnvFile(): void {
  if (process.env.DATABASE_URL) return;

  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, '.env.local'),
    path.resolve(cwd, '.env'),
    path.resolve(cwd, 'backend/.env.local'),
    path.resolve(cwd, 'backend/.env'),
    path.resolve(cwd, '../.env.local'),
    path.resolve(cwd, '../.env'),
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

    if (process.env.DATABASE_URL) {
      return;
    }
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var __prismaClient: PrismaClientType | undefined;
}

export class PrismaService {
  private static client: PrismaClientType | undefined;

  static getClient(): PrismaClientType {
    if (!PrismaService.client) {
      loadEnvFile();

      if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED && process.env.DATABASE_URL?.includes('sslmode=require')) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      }

      const configuredDatabaseUrl = process.env.DATABASE_URL?.trim();
      if (!configuredDatabaseUrl) {
        throw new Error('DATABASE_URL is required for the API database connection');
      }

      let connectionString = configuredDatabaseUrl;
      
      // تحسين رابط الاتصال لـ Vercel/Serverless
      if (process.env.NODE_ENV === 'production' && !connectionString.includes('pgbouncer=')) {
        const separator = connectionString.includes('?') ? '&' : '?';
        connectionString = `${connectionString}${separator}pgbouncer=true&connection_limit=1`;
      }

      const adapter = new PrismaPg({ connectionString });
      const createClient = () => new PrismaClient({ 
        log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
        adapter 
      });

      if (process.env.NODE_ENV !== 'production') {
        if (!global.__prismaClient) {
          global.__prismaClient = createClient();
        }
        PrismaService.client = global.__prismaClient as PrismaClientType;
      } else {
        PrismaService.client = createClient();
      }
    }

    return PrismaService.client!;
  }

  static async disconnect(): Promise<void> {
    if (PrismaService.client) {
      await PrismaService.client.$disconnect();
    }
  }

  static async transaction<T>(work: (tx: any) => Promise<T>): Promise<T> {
    const client = PrismaService.getClient();
    return client.$transaction(work as any) as Promise<T>;
  }
}

export default PrismaService;
