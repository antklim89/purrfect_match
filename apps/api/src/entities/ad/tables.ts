import { relations, sql } from 'drizzle-orm';
import { numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { userTable } from '@/entities/user/tables';

export const adTable = pgTable('ad', {
  id: uuid().default(sql`uuidv7()`).primaryKey(),

  name: text().notNull(),
  description: text().notNull(),
  breed: text().notNull(),
  type: text().notNull(),
  price: numeric({ precision: 10, scale: 2, mode: 'number' }).notNull(),

  status: text({ enum: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'] })
    .notNull()
    .default('DRAFT'),

  userId: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { mode: 'string', withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp('published_at', { mode: 'string', withTimezone: true }).defaultNow().notNull(),
});

export const adImageTable = pgTable('ad_image', {
  id: uuid().default(sql`uuidv7()`).primaryKey(),

  url: text().notNull(),
  blurDataUrl: text().notNull(),

  adId: uuid()
    .notNull()
    .references(() => adTable.id, { onDelete: 'cascade' }),
});

export const adRelations = relations(adTable, ({ many, one }) => ({
  images: many(adImageTable),
  user: one(userTable, {
    fields: [adTable.userId],
    references: [userTable.id],
  }),
}));

export const adImageRelations = relations(adImageTable, ({ one }) => ({
  ad: one(adTable, {
    fields: [adImageTable.adId],
    references: [adTable.id],
  }),
}));
