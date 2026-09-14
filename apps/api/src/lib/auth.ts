import { CreateUserSchema } from '@purrfect_match/shared/entities/auth/schemas';
import { APIError, betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { testUtils } from 'better-auth/plugins';

import { accountTable, sessionTable, verificationTable } from '@/entities/auth/tables';
import { userTable } from '@/entities/user/tables';
import { db } from './db';
import { env } from './env';

export const auth = betterAuth({
  experimental: {
    joins: true,
  },
  trustedOrigins() {
    return [env.WEB_URL];
  },
  session: {
    cookieCache: {
      enabled: true,
    },
  },
  baseURL: env.API_URL,
  secret: env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user: userTable, account: accountTable, session: sessionTable, verification: verificationTable },
  }),
  plugins: [testUtils()],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const { success, error } = await CreateUserSchema.safeParseAsync(user);
          if (!success) {
            throw new APIError('BAD_REQUEST', { message: error.issues[0]?.message ?? 'Failed to create user' });
          }
        },
      },
    },
  },
  user: {
    additionalFields: {
      fullName: { type: 'string', defaultValue: '', required: true, returned: false },
      contacts: { type: 'json', defaultValue: '', required: true, returned: false },
      address: { type: 'string', defaultValue: '', required: true, returned: false },
      description: { type: 'string', defaultValue: '', required: true, returned: false },
    },
  },
  advanced: {
    database: {
      generateId: () => Bun.randomUUIDv7(),
    },
  },
});
