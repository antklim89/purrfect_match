import { describe, expect, it } from 'vitest';

import { auth } from '@/lib/auth';

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