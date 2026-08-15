import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

function loadEnvFile(): void {
  if (process.env.DATABASE_URL) return;

  const candidates = [
    path.resolve(__dirname, '../../../.env.local'),
    path.resolve(__dirname, '../../../.env'),
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(__dirname, '../../.env'),
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
  var __prismaClient: PrismaClient | undefined;
}

const prismaClient = ((): PrismaClient => {
  loadEnvFile();

  if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED && process.env.DATABASE_URL?.includes('sslmode=require')) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const createClient = () => new PrismaClient({ log: ['error'], adapter });

  if (process.env.NODE_ENV !== 'production') {
    if (!global.__prismaClient) {
      global.__prismaClient = createClient();
    }
    return global.__prismaClient as PrismaClient;
  }

  return createClient();
})();

export class PrismaService {
  private static client = prismaClient;

  static getClient(): PrismaClient {
    return PrismaService.client;
  }

  static async disconnect(): Promise<void> {
    await PrismaService.client.$disconnect();
  }

  static async transaction<T>(work: (tx: any) => Promise<T>): Promise<T> {
      return PrismaService.client.$transaction(work as any) as Promise<T>;
  }
}

export default PrismaService;
