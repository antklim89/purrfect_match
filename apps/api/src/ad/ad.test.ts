import { describe, it, mock } from 'bun:test';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { testClient } from 'hono/testing';

import app from '@/api/app';
import { account, session, user, verification } from '@/api/auth/schema';
import { auth } from '@/api/lib/auth';
import { db } from '@/api/lib/db';

const client = testClient(app);

async function mockAuthenticatedUser() {
  auth.options.database = drizzleAdapter(db, {
    provider: 'sqlite',
    schema: { user, account, session, verification },
  });
  const x = await auth.api.signUpEmail({ body: { name: 'TestUser', email: 'example3@mail.ru', password: 'qwer1234' } });
  console.log('🚀 ~ x: \n%o\n', x);
  mock.module('@/api/lib/auth', () => ({ auth: { api: { getSession: () => ({ user: x.user }) } } }));
}

describe('test', () => {
  it('create ad', async () => {
    await mockAuthenticatedUser();
    // const result = await client.api.ad.$post({
    //   json: {
    //     category: 'cats',
    //     name: 'john',
    //     description: 'it`s a cat',
    //     type: 'mammals',
    //   },
    // });
    // console.log('🚀 ~ result: \n%o\n', await result.json());
  });

  // it('create ad 2', async () => {
  //   await mockAuthenticatedUser();
  //   const result = await client.api.ad.$post({
  //     json: {
  //       category: 'cats',
  //       name: 'john',
  //       description: 'it`s a cat',
  //       type: 'mammals',
  //     },
  //   });
  //   console.log('🚀 ~ result: \n%o\n', await result.json());
  // });
});
