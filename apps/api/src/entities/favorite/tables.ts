// biome-ignore lint/suspicious/noDeprecatedImports: only one overload deprecated
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

import { adTable } from '@/entities/ad/tables';
import { userTable } from '@/entities/user/tables';

export const favoriteTable = pgTable(
  'favorite',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    adId: uuid('ad_id')
      .notNull()
      .references(() => adTable.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.adId, t.userId] })],
);
