import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { user } from '@/api/auth/schema';

export const ad = sqliteTable('ad', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  type: text('type').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .$onUpdate(() => new Date())
    .notNull(),
});
