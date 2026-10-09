/** biome-ignore-all lint/performance/noAwaitInLoops: ok */
/** biome-ignore-all lint/style/noNonNullAssertion: ok */
/** biome-ignore-all lint/suspicious/noConsole: ok */

import { faker } from '@faker-js/faker';
import type { InferInsertModel } from 'drizzle-orm';
import type { PgTable, TableConfig } from 'drizzle-orm/pg-core';

import type { AdImageInsertType, AdInsertType } from '@/entities/ad/types';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { adImageTable, adTable, animalBreedTable, animalTypeTable } from '@/schema';
import animalTypes from './animals.json' with { type: 'json' };
import birdBreed from './bird.json' with { type: 'json' };
import catBreed from './cat.json' with { type: 'json' };
import dogBreed from './dog.json' with { type: 'json' };
import exoticBreed from './exotic.json' with { type: 'json' };
import fishBreed from './fish.json' with { type: 'json' };
import rodentBreed from './rodent.json' with { type: 'json' };

const USERS_NUMBER = 20;
const ADS_NUMBER = 1000;
const contacts = [
  { number: '1 (555) 555 44 55', type: 'phone' },
  { number: '1 (555) 555 33 55', type: 'whatsapp' },
  { number: '4 (999) 555 22 55', type: 'telegram' },
  { number: '71 (888) 555 11 55', type: 'viber' },
];

const animalBreedsMap: Record<string, { name: string; description: string }[]> = {
  Cat: catBreed,
  Dog: dogBreed,
  Bird: birdBreed,
  Exotic: exoticBreed,
  Fish: fishBreed,
  Rodent: rodentBreed,
};

export const PLACEHOLDER_BLUR_DATA =
  'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk4vpvDAACgQFIuAF96wAAAABJRU5ErkJggg==';

function insertChunks<Table extends PgTable<TableConfig>, Insert extends InferInsertModel<Table>>(
  table: Table,
  arr: Insert[],
  size = 100,
) {
  return Promise.all(
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size)).flatMap(
      (item) => db.insert(table).values(item).onConflictDoNothing(),
    ),
  );
}

async function createUsers() {
  for (let index = 0; index < USERS_NUMBER; index++) {
    await auth.api.signUpEmail({
      body: {
        email: index === 0 ? 'admin@mail.com' : faker.internet.email(),
        name: faker.person.firstName(),
        password: 'qwer1234',
        fullName: faker.person.fullName(),
        address: `${faker.location.country()} ${faker.location.city()} ${faker.location.streetAddress()}`,
        description: faker.lorem.text(),
        contacts: faker.helpers.multiple(() => ({
          number: faker.phone.number(),
          type: faker.helpers.arrayElement(contacts.map((i) => i.type)),
        })),
      },
    });
  }
  console.log('Users inserted');
}

async function createAd() {
  const users = await db.query.userTable.findMany({ columns: { id: true } });

  const ads: AdInsertType[] = Array.from({ length: ADS_NUMBER }, () => {
    const type = faker.helpers.arrayElement(animalTypes);
    const breed = faker.helpers.arrayElement(animalBreedsMap[type.name]!);

    return {
      id: faker.string.uuid({ version: 7 }),
      name: faker.animal.petName(),
      breed: breed.name,
      type: type.name,
      description: faker.lorem.sentence({ min: 20, max: 1000 }).slice(0, 38000),
      price: faker.number.float({ min: 0, max: 1000000, multipleOf: 0.02 }),
      userId: faker.helpers.arrayElement(users).id,
      createdAt: new Date('2010-01-01T12:40:40.408Z').toISOString(),
      publishedAt: faker.date.past({ years: 7 }).toISOString(),
      contacts: faker.helpers.arrayElements(contacts),
      status: 'PUBLISHED',
    };
  });

  await insertChunks(adTable, ads);
  console.log('Ads inserted');
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

  await insertChunks(adImageTable, adsImages);
  console.log('Images inserted');
}

async function createAnimal() {
  await insertChunks(animalTypeTable, animalTypes);
  console.log('Animal types inserted');
}

async function createBreed() {
  const insertedAnimalTypes = await db.query.animalTypeTable.findMany({ columns: { name: true } });

  const insertAnimalBreeds = insertedAnimalTypes.flatMap((animalType) => {
    return animalBreedsMap[animalType.name]!.map((i) => ({
      ...i,
      animalTypeName: animalType.name,
    }));
  });

  await insertChunks(animalBreedTable, insertAnimalBreeds);
  console.log('Animal breeds inserted');
}

await createUsers();
await createAnimal();
await createBreed();
await createAd();
await createAdImages();
await db.$client.end();
