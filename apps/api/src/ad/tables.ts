import type { ContactType } from '@purrfect_match/shared/entities/contact/types';
import { relations, sql } from 'drizzle-orm';
import { jsonb, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { userTable } from '@/auth/tables';

export const adTable = pgTable('ad', {
  id: uuid().default(sql`uuidv7()`).primaryKey(),

  name: text().notNull(),
  description: text().notNull(),
  breed: text().notNull(),
  type: text().notNull(),
  price: numeric({ precision: 10, scale: 2, mode: 'number' }).notNull(),
  contacts: jsonb().$type<ContactType[]>().notNull(),

  status: text('status', { enum: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'] })
    .notNull()
    .default('DRAFT'),

  userId: text()
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { mode: 'string', withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp('published_at', { mode: 'string', withTimezone: true }),
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
