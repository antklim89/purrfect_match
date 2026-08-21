import type { ContactType } from '@purrfect_match/shared/entities/contact/types';
import { relations } from 'drizzle-orm';
import { boolean, index, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable(
  'user',
  {
    id: text('id').primaryKey(),

    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),

    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [index('session_id_idx').on(table.id)],
);

export const sessionTable = pgTable(
  'session',
  {
    id: text('id').primaryKey(),

    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),

    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [index('session_userId_idx').on(table.userId), index('session_token_idx').on(table.token)],
);

export const accountTable = pgTable(
  'account',
  {
    id: text('id').primaryKey(),

    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),

    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [index('account_userId_idx').on(table.userId)],
);

export const verificationTable = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),

    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),

    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [index('verification_identifier_idx').on(table.identifier)],
);

export const profileTable = pgTable('profile', {
  id: text('id')
    .primaryKey()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  fullName: text('full_name'),
  tel: text('tel').array(),
  contacts: jsonb('contacts').$type<ContactType[]>(),
  address: text('address'),
  description: text('description'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' })
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
  accounts: many(accountTable),
}));

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const accountRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}));
