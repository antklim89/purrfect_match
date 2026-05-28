/** biome-ignore-all lint/performance/noAwaitInLoops: ok */
import { faker } from '@faker-js/faker';
import { adConfig } from '@purrfect_match/shared/entities/ads/config';
import { sql } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';

import type { AdImageInsertType, AdInsertType } from '@/ad/types';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import * as schema from '@/schema';

const USERS_NUMBER = 2;
const ADS_NUMBER = 5;

export const PLACEHOLDER_BLUR_DATA =
  'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk4vpvDAACgQFIuAF96wAAAABJRU5ErkJggg==';

async function resetDb() {
  await Promise.all(
    Object.values(schema).map(async table => {
      if (table instanceof PgTable) {
        await db.execute(sql`TRUNCATE TABLE ${table} CASCADE`);
      }
    }),
  );
}

async function createUsers() {
  for (let index = 0; index < USERS_NUMBER; index++) {
    const ctx = await auth.$context;
    const user = await ctx.test.saveUser(ctx.test.createUser());
    await ctx.test.login({ userId: user.id });
  }
}

async function createAd() {
  const users = await db.query.userTable.findMany({ columns: { id: true } });
  const breeds = faker.helpers.multiple(() => faker.lorem.word(), { count: 9 });
  const type = faker.helpers.multiple(() => faker.animal.type(), { count: 9 });

  const ads: AdInsertType[] = Array.from({ length: ADS_NUMBER }, () => {
    return {
      id: faker.string.uuid({ version: 7 }),
      name: faker.animal.petName(),
      breed: faker.helpers.arrayElement(breeds),
      type: faker.helpers.arrayElement(type),
      description: faker.lorem.sentence({ min: 20, max: 2000 }).slice(0, adConfig.description.max),
      price: faker.number.float({ min: adConfig.price.min, max: adConfig.price.max, multipleOf: 0.02 }),
      userId: faker.helpers.arrayElement(users).id,
      createdAt: faker.date.past({ years: 7 }).toISOString(),
      isPublished: true,
    };
  });

  await db.insert(schema.adTable).values(ads);
}

async function createAdImages() {
  const ads = await db.query.adTable.findMany({ columns: { id: true } });
  const adImages = await Array.fromAsync(new Bun.Glob('*').scan({ onlyFiles: true, cwd: 'media/development/ads' }));

  const adsImages: AdImageInsertType[] = ads.flatMap(ad =>
    faker.helpers.arrayElements(adImages).flatMap(adImageSrc => {
      return {
        url: `/development/ads/${adImageSrc}`,
        adId: ad.id,
        blurDataUrl: PLACEHOLDER_BLUR_DATA,
      };
    }),
  );

  await db.insert(schema.adImageTable).values(adsImages);
}

await resetDb();
await createUsers();
await createAd();
await createAdImages();
