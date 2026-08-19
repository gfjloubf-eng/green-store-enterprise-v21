import { defineConfig } from 'prisma/config';

export default defineConfig({
  // Schema path is project-root relative for clarity in multi-folder layout
  schema: 'backend/prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
  },
  migrations: {
    path: 'backend/prisma/migrations',
  },
});
