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
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    fullName: text('full_name').default('').notNull(),
    contacts: jsonb('contacts').default('').notNull().$type<UserContactType[]>(),
    address: text('address').default('').notNull(),
    description: text('description').default('').notNull(),
  },
  (table) => [index('user_id_idx').on(table.id)],
);
