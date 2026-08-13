import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  // Schema path is project-root relative for clarity in multi-folder layout
  schema: 'backend/prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    path: 'backend/prisma/migrations',
  },
});
