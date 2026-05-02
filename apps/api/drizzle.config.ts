import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: ['./src/schema.ts'],
  out: './db/migrations',
  dbCredentials: {
    url: 'db/database.db',
  },
});
