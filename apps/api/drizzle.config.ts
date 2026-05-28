import { globSync } from 'node:fs';
import { defineConfig } from 'drizzle-kit';

import { env } from './src/lib/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: globSync('src/**/tables.ts'),
  out: './db/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
