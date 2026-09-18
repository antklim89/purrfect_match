// import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { userTable } from '../user/tables';

export const sessionTable = pgTable(
  'session',
  {
    id: uuid('id').primaryKey(),

    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),

    userId: uuid('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('session_userId_idx').on(table.userId), index('session_token_idx').on(table.token)],
);

export const accountTable = pgTable(
  'account',
  {
    id: uuid('id').primaryKey(),

    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),

    userId: uuid('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);

export const verificationTable = pgTable(
  'verification',
  {
    id: uuid('id').primaryKey(),

    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),

    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

// export const userRelations = relations(userTable, ({ many }) => ({
//   sessions: many(sessionTable),
//   accounts: many(accountTable),
// }));

// export const sessionRelations = relations(sessionTable, ({ one }) => ({
//   user: one(userTable, {
//     fields: [sessionTable.userId],
//     references: [userTable.id],
//   }),
// }));

// export const accountRelations = relations(accountTable, ({ one }) => ({
//   user: one(userTable, {
//     fields: [accountTable.userId],
//     references: [userTable.id],
//   }),
// }));
