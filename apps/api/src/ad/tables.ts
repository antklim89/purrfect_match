import { relations, sql } from 'drizzle-orm';
import { boolean, check, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { userTable } from '@/auth/tables';

export const adTable = pgTable(
  'ad',
  {
    id: uuid().default(sql`uuidv7()`).primaryKey(),
    isPublished: boolean().default(false),
    name: text().notNull(),
    description: text().notNull(),
    breed: text('breed').notNull(),
    type: text().notNull(),
    price: numeric({ precision: 10, scale: 2, mode: 'number' }).notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true }).defaultNow().notNull(),
  },
  table => [
    check('price', sql`${table.price} >= 0 AND ${table.price} <= 1000000`),
    check('name', sql`length(${table.name}) <= 200`),
    check('description', sql`length(${table.description}) <= 4000`),
  ],
);

export const adImageTable = pgTable('ad_image', {
  id: uuid().default(sql`uuidv7()`).primaryKey(),
  url: text().notNull(),
  blurDataUrl: text('blur_data_url').notNull(),
  adId: uuid('ad_id')
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
