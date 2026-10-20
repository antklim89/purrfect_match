import type { User } from 'better-auth';

import type { AdInsertType, AdSelectType } from '@/entities/ad/types';
import { uploadImage } from '@/entities/ad/utils';
import type {
  AnimalBreedInsertType,
  AnimalBreedSelectType,
  AnimalTypeInsertType,
  AnimalTypeSelectType,
} from '@/entities/animal/types';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { adImageTable, adTable, animalBreedTable, animalTypeTable, favoriteTable } from '@/schema';
import {
  createTestAdData,
  createTestAdImageData,
  createTestAnimalBreedData,
  createTestAnimalTypeData,
  createTestUserData,
} from './test-data';

const image = new File([await Bun.file('./src/test/images/placeholder-1.jpg').arrayBuffer()], 'file1.jpg');

export async function registerTestUser(user: Partial<User> = {}) {
  const ctx = await auth.$context;
  const userSaved = await ctx.test.saveUser({ ...createTestUserData(), ...user });
  const loginResult = await ctx.test.login({ userId: userSaved.id });
  const headers = Object.fromEntries(loginResult.headers);

  return { user: loginResult.user, headers };
}

export async function insertAd({
  ad = {},
  breed,
  type,
  user,
}: {
  ad?: Partial<Omit<AdInsertType, 'userId' | 'breedName'>>;
  user?: User;
  breed?: AnimalBreedSelectType;
  type?: AnimalTypeSelectType;
} = {}) {
  const registeredUser = user ? { user, headers: undefined } : await registerTestUser();
  const animalBreed = breed ? breed : await insertAnimalBreed({ type });

  const [adInserted] = await db
    .insert(adTable)
    .values(createTestAdData({ ad, userId: registeredUser.user.id, breedName: animalBreed.name }))
    .returning();

  return {
    ...adInserted!,
    user: registeredUser.user,
    headers: registeredUser.headers,
    breed: animalBreed,
  };
}

export async function insertFavorite({ ad, user }: { ad?: AdSelectType; user?: User } = {}) {
  const registeredUser = user ? { user, headers: undefined } : await registerTestUser();
  const adInserted = ad ? ad : await insertAd();

  const [favoriteInserted] = await db
    .insert(favoriteTable)
    .values({ adId: adInserted.id!, userId: registeredUser.user.id })
    .returning();

  return {
    ...favoriteInserted!,
    ...registeredUser,
    ad: adInserted!,
  };
}

export async function insertAdImage({ ad, user }: { ad?: AdSelectType; user?: User }) {
  const registeredUser = user ? { user, headers: undefined } : await registerTestUser();
  const adInserted = ad ? ad : await insertAd();

  const { data } = await uploadImage({ image, adId: adInserted.id!, userId: registeredUser.user.id });

  const [adImageInserted] = await db
    .insert(adImageTable)
    .values(createTestAdImageData({ adId: adInserted.id!, adImage: data! }))
    .returning();

  return {
    ...adImageInserted!,
    ad: adInserted,
    user: registeredUser.user,
    headers: registeredUser.headers,
  };
}

export async function insertAnimalBreed({
  type,
  breed,
}: {
  breed?: Partial<Omit<AnimalBreedInsertType, 'animalType'>>;
  type?: AnimalTypeSelectType;
} = {}) {
  const animalTypeInserted = type ? type : await insertAnimalType({});

  const [animalBreedInserted] = await db
    .insert(animalBreedTable)
    .values(createTestAnimalBreedData({ animalTypeName: animalTypeInserted.name, breed }))
    .returning();

  return { ...animalBreedInserted!, animalType: animalTypeInserted };
}

export async function insertAnimalType({ type }: { type?: Partial<AnimalTypeInsertType> } = {}) {
  const [animalTypeInserted] = await db.insert(animalTypeTable).values(createTestAnimalTypeData(type)).returning();

  return animalTypeInserted!;
}
