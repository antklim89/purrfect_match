import { UserMessengersSchema } from '@purrfect_match/shared/entities/auth/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { testUtils } from 'better-auth/plugins';

import { accountTable, sessionTable, userTable, verificationTable } from '@/auth/tables';
import { db } from './db';
import { env } from './env';

export const auth = betterAuth({
  user: {
    additionalFields: {
      fullName: { type: 'string', required: false },
      tel: { type: 'string[]', required: false },
      messengers: {
        type: 'json',
        required: false,
        validator: {
          input: UserMessengersSchema,
        },
      },
      address: { type: 'string', required: false },
      description: { type: 'string', required: false },
    },
  },
  experimental: {
    joins: true,
  },
  trustedOrigins() {
    return [env.WEB_URL];
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
});
