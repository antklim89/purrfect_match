import { testClient } from 'hono/testing';
import { describe, expect, it } from 'vitest';

import app from '@/app';
import { profileTable } from './tables';
import { db } from '../lib/db';
import { registerTestUser } from '../test/insert-data';

const client = testClient(app);

const testProfile = {
  address: 'Address',
  description: 'Lorem ipsum',
  fullName: 'Foo Bar',
  messengers: [{ messenger: 'phone', number: '7 (555) 555-55-55' }],
};

describe('[GET] /api/auth/get-profile', () => {
  it('should get profile if not exists', async () => {
    const { headers, user } = await registerTestUser();
    const response = await client.api.auth['get-profile'].$get(undefined, { headers });
    const { error, result } = await response.json();
    if (error) return expect(error).toBeNull();
    expect(result.id).toEqual(user.id);
  });

  it('should get profile if exists', async () => {
    const { headers, user } = await registerTestUser();
    await db.insert(profileTable).values({ id: user.id, fullName: 'Foo Bar' });
    const response = await client.api.auth['get-profile'].$get(undefined, { headers });
    const { error, result } = await response.json();
    if (error) return expect(error).toBeNull();

    expect(result.id).toEqual(user.id);
    expect(result.fullName).toEqual('Foo Bar');
  });
});

describe('[POST] /api/auth/update-profile', () => {
  it('should update profile if not exists', async () => {
    const { headers, user } = await registerTestUser();
    const response = await client.api.auth['update-profile'].$post({ json: testProfile }, { headers });
    const { error } = await response.json();
    if (error) return expect(error).toBeNull();

    const updatedProfile = await db.query.profileTable.findFirst({
      where: (fields, operators) => operators.eq(fields.id, user.id),
    });

    expect(updatedProfile).toMatchObject({ id: user.id, ...testProfile });
  });

  it('should update profile if exists', async () => {
    const { headers, user } = await registerTestUser();
    await db.insert(profileTable).values({ id: user.id, fullName: 'Foo Baz' });
    const response = await client.api.auth['update-profile'].$post({ json: testProfile }, { headers });
    const { error } = await response.json();
    if (error) return expect(error).toBeNull();

    const updatedProfile = await db.query.profileTable.findFirst({
      where: (fields, operators) => operators.eq(fields.id, user.id),
    });

    expect(updatedProfile).toMatchObject({ id: user.id, ...testProfile });
  });
});
