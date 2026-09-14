import type { UserContactType } from '@purrfect_match/shared/entities/user/types';
import { boolean, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const userTable = pgTable(
  'user',
  {
    id: uuid('id').primaryKey(),

    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),

    fullName: text('full_name').notNull().default(''),
    contacts: jsonb('contacts').$type<UserContactType[]>().notNull().default([]),
    address: text('address').notNull().default(''),
    description: text('description').notNull().default(''),

    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('user_id_idx').on(table.id)],
);
