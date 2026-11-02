import { genders } from '@purrfect_match/shared/models/gender';
import { type SQL, sql } from 'drizzle-orm';
import { customType, date, index, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { animalBreedTable } from '@/entities/animal/tables';
import { userTable } from '@/entities/user/tables';

const tsvector = customType<{ data: string }>({ dataType: () => 'tsvector' });

export const adTable = pgTable(
  'ad',
  {
    id: uuid().default(sql`uuidv7()`).primaryKey(),

    name: text().notNull(),
    description: text().notNull(),
    birth: date({ mode: 'string' }).notNull().defaultNow(),
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
  (table) => [
    index('ad_search_idx').using('gin', table.tsvector),
    index('ad_status_idx').on(table.status),
    index('ad_breedName_idx').on(table.breedName),
  ],
);

export const adImageTable = pgTable(
  'ad_image',
  {
    id: uuid().default(sql`uuidv7()`).primaryKey(),

    url: text().notNull(),
    blurDataUrl: text().notNull(),

    adId: uuid()
      .notNull()
      .references(() => adTable.id, { onDelete: 'cascade' }),
  },
  (table) => [index('ad_image_adId_idx').on(table.adId)],
);
