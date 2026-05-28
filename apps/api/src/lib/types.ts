import type { User } from 'better-auth';
import type { BunSQLDatabase } from 'drizzle-orm/bun-sql';
import type { Context } from 'hono';

import type { auth } from './auth';

export interface AppEnv {
  Variables: {
    db: BunSQLDatabase<typeof import('../schema')> & {
      $client: Bun.SQL;
    };
    user: User;
    auth: typeof auth;
  };
}

export type AppContext = Context<AppEnv>;
