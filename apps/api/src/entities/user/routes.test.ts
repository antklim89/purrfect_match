import { testClient } from 'hono/testing';
import { describe, expect, it } from 'vitest';

import app from '@/app';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { testApiCall } from '@/test/api-call';
import { registerTestUser } from '@/test/insert-data';

const client = testClient(app);

const testProfile = {
  name: 'Updated',
  address: 'Updated Address',
  description: 'Updated Lorem ipsum',
  fullName: 'Updated Full Name',
  contacts: [{ type: 'phone', number: '7 (999) 555-55-55' }],
};

describe('[AUTH] signUpEmail', () => {
  it('should sign up with email', async () => {
    const { user } = await auth.api.signUpEmail({
      body: { email: 'mail@mail.ru', name: 'Name', password: 'qwer1234' },
    });
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name', 'Name');
    expect(user).toHaveProperty('email', 'mail@mail.ru');
  });

  it('should not sign up with invalid email', async () => {
    const data = auth.api.signUpEmail({
      body: { email: 'x', name: 'Name', password: 'qwer1234' },
    });
    await expect(data).rejects.toHaveProperty('message', '[body.email] Invalid email address');
  });

  it('should not sign up with invalid name', async () => {
    const data = auth.api.signUpEmail({
      body: { email: 'mail@mail.ru', name: '1', password: 'qwer1234' },
    });
    await expect(data).rejects.toHaveProperty('message', 'Too small: expected name to have >= 2 characters');
  });

  it('should not sign up with invalid password', async () => {
    const data = auth.api.signUpEmail({
      body: { email: 'mail@mail.ru', name: 'Name', password: 'x' },
    });
    await expect(data).rejects.toHaveProperty('message', 'Password too short');
  });
});

describe('[GET] /api/auth/:id/get-user', () => {
  it('should get profile', async () => {
    const { user } = await registerTestUser();
    const { data } = await testApiCall(client.api.user[':userId']['get-user'].$get({ param: { userId: user.id } }));

    expect(data).toStrictEqual({
      address: '',
      contacts: '',
      fullName: '',
      description: '',
      name: 'Brielle',
      image: null,
    });
  });
});

describe('[POST] /api/auth/update-profile', () => {
  it('should update profile', async () => {
    const { headers, user } = await registerTestUser();
    const { error, data } = await testApiCall(client.api.user['update-user'].$post({ json: testProfile }, { headers }));
    if (error) return expect(error).toBeNull();

    const updatedProfile = await db.query.userTable.findFirst({
      where: (fields, operators) => operators.eq(fields.id, user.id),
    });

    expect(data).toBeNull();
    expect(updatedProfile).toStrictEqual({
      id: user.id,
      name: testProfile.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: null,
      fullName: testProfile.fullName,
      contacts: testProfile.contacts,
      address: testProfile.address,
      description: testProfile.description,
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
    });
  });
});
