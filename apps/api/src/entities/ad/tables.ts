import { genders } from '@purrfect_match/shared/models/gender';
import { type SQL, sql } from 'drizzle-orm';
import { customType, index, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { animalBreedTable } from '@/entities/animal/tables';
import { userTable } from '@/entities/user/tables';

const tsvector = customType<{ data: string }>({ dataType: () => 'tsvector' });

export const adTable = pgTable(
  'ad',
  {
    id: uuid().default(sql`uuidv7()`).primaryKey(),

    name: text().notNull(),
    description: text().notNull(),
    birth: timestamp({ mode: 'string', withTimezone: true }).notNull().defaultNow(),
    gender: text({ enum: genders }).notNull().default('male'),

    tsvector: tsvector()
      .notNull()
      .generatedAlwaysAs((): SQL => sql`to_tsvector('english', ${adTable.description})`),

    price: numeric({ precision: 10, scale: 2, mode: 'number' }).notNull(),

    status: text({ enum: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'] })
      .notNull()
      .default('DRAFT'),

    breedName: text()
      .notNull()
      .references(() => animalBreedTable.name, { onDelete: 'cascade' }),
    userId: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true }).defaultNow().notNull(),
    publishedAt: timestamp('published_at', { mode: 'string', withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('ad_search_idx').using('gin', table.tsvector)],
);

export const adImageTable = pgTable('ad_image', {
  id: uuid().default(sql`uuidv7()`).primaryKey(),

  url: text().notNull(),
  blurDataUrl: text().notNull(),

  adId: uuid()
    .notNull()
    .references(() => adTable.id, { onDelete: 'cascade' }),
});
