import { defineRelations } from 'drizzle-orm';

import { adImageTable, adTable } from './entities/ad/tables';
import { animalBreedTable, animalTypeTable } from './entities/animal/tables';
import { accountTable, sessionTable, verificationTable } from './entities/auth/tables';
import { favoriteTable } from './entities/favorite/tables';
import { userTable } from './entities/user/tables';

export {
  accountTable,
  adImageTable,
  adTable,
  animalBreedTable,
  animalTypeTable,
  favoriteTable,
  sessionTable,
  userTable,
  verificationTable,
};

export const relations = defineRelations(
  {
    accountTable,
    adImageTable,
    adTable,
    favoriteTable,
    sessionTable,
    userTable,
    verificationTable,
    animalTypeTable,
    animalBreedTable,
  },
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
    animalTypeTable: {
      breeds: r.many.animalBreedTable({
        from: r.animalTypeTable.name,
        to: r.animalBreedTable.animalTypeName,
      }),
    },

    animalBreedTable: {
      type: r.one.animalTypeTable({
        from: r.animalBreedTable.animalTypeName,
        to: r.animalTypeTable.name,
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
