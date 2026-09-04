/** biome-ignore-all lint/performance/noAwaitInLoops: ok */
import { faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';

import type { AdImageInsertType, AdInsertType } from '@/entities/ad/types';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import * as schema from '@/schema';

const USERS_NUMBER = 20;
const ADS_NUMBER = 50;
const contacts = [
  { number: '1 (555) 555 44 55', type: 'phone' },
  { number: '1 (555) 555 33 55', type: 'whatsapp' },
  { number: '4 (999) 555 22 55', type: 'telegram' },
  { number: '71 (888) 555 11 55', type: 'viber' },
];

const types = ['dog', 'cat', 'bird', 'hamster', 'horse', 'rabbit', 'fish', 'turtle', 'duck', 'snake', 'lizard'];

const breeds = [
  'Bulldog',
  'Poodle',
  'Beagle',
  'Dachshund',
  'German Shepherd Dog',
  'Golden Retriever',
  'Bichon Frise',
  'Labrador',
  'Pug',
  'Boxer',
  'Rottweiler',
  'Goldendoodle',
  'Border Collie',
  'Great Dane',
];

export const PLACEHOLDER_BLUR_DATA =
  'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk4vpvDAACgQFIuAF96wAAAABJRU5ErkJggg==';

async function resetDb() {
  await Promise.all(
    Object.values(schema).map(async (table) => {
      if (table instanceof PgTable) {
        await db.execute(sql`TRUNCATE TABLE ${table} CASCADE`);
      }
    }),
  );
}

async function createUsers() {
  await auth.api.signUpEmail({ body: { email: 'admin@mail.com', name: 'Admin', password: 'qwer1234' } });

  for (let index = 0; index < USERS_NUMBER; index++) {
    await auth.api.signUpEmail({
      body: { email: faker.internet.email(), name: faker.person.firstName(), password: 'qwer1234' },
    });
  }
}

async function createAd() {
  const users = await db.query.userTable.findMany({ columns: { id: true } });

  const ads: AdInsertType[] = Array.from({ length: ADS_NUMBER }, () => {
    return {
      id: faker.string.uuid({ version: 7 }),
      name: faker.animal.petName(),
      breed: faker.helpers.arrayElement(breeds),
      type: faker.helpers.arrayElement(types),
      description: faker.lorem.sentence({ min: 20, max: 1000 }).slice(0, 38000),
      price: faker.number.float({ min: 0, max: 1000000, multipleOf: 0.02 }),
      userId: faker.helpers.arrayElement(users).id,
      createdAt: faker.date.past({ years: 7 }).toISOString(),
      contacts: faker.helpers.arrayElements(contacts),
      isPublished: true,
    };
  });

  await db.insert(schema.adTable).values(ads);
}

async function createAdImages() {
  const ads = await db.query.adTable.findMany({ columns: { id: true } });
  const adImages = await Array.fromAsync(new Bun.Glob('*').scan({ onlyFiles: true, cwd: 'media/development/ads' }));

  const adsImages: AdImageInsertType[] = ads.flatMap((ad) =>
    faker.helpers.arrayElements(adImages, { min: 2, max: 6 }).flatMap((adImageSrc) => {
      return {
        url: `/media/development/ads/${adImageSrc}`,
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
