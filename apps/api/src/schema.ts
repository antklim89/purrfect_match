import { defineRelations } from 'drizzle-orm';

import { adImageTable, adTable } from './entities/ad/tables';
import { accountTable, sessionTable, verificationTable } from './entities/auth/tables';
import { favoriteTable } from './entities/favorite/tables';
import { userTable } from './entities/user/tables';

export { accountTable, adImageTable, adTable, favoriteTable, sessionTable, userTable, verificationTable };

export const relations = defineRelations(
  { accountTable, adImageTable, adTable, favoriteTable, sessionTable, userTable, verificationTable },
  (r) => ({
    adTable: {
      images: r.many.adImageTable(),
      favorites: r.many.favoriteTable(),
      user: r.one.userTable({
        optional: false,
        from: [r.adTable.userId],
        to: [r.userTable.id],
      }),
    },
    adImageTable: {
      ad: r.one.adTable({
        optional: false,
        from: [r.adImageTable.adId],
        to: [r.adTable.id],
      }),
    },
    favoriteTable: {
      ad: r.one.adTable({
        optional: false,
        from: [r.favoriteTable.adId],
        to: [r.adTable.id],
      }),
    },
    userTable: {
      sessions: r.many.sessionTable({
        from: r.userTable.id,
        to: r.sessionTable.userId,
      }),
      accountsTable: r.many.accountTable({
        from: r.userTable.id,
        to: r.accountTable.userId,
      }),
    },
    sessionTable: {
      user: r.one.userTable({
        from: r.sessionTable.userId,
        to: r.userTable.id,
      }),
    },
    accountTable: {
      user: r.one.userTable({
        from: r.accountTable.userId,
        to: r.userTable.id,
      }),
    },
  }),
);
