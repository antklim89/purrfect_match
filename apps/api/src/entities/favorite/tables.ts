import { index, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

import { adTable } from '@/entities/ad/tables';
import { userTable } from '@/entities/user/tables';

export const favoriteTable = pgTable(
  'favorite',
  {
    userId: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    adId: uuid('ad_id')
      .notNull()
      .references(() => adTable.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.adId, table.userId] }),
    index('favorite_userId_adId_idx').on(table.userId, table.adId),
  ],
);
