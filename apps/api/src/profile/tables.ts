import type { ContactType } from '@purrfect_match/shared/entities/contact/types';
import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { userTable } from '../auth/tables';

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
