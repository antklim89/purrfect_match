import type { Metadata } from 'next';
import { getSessionCookie } from 'better-auth/cookies';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { AuthCard } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign In',
};

async function Page() {
  const cookies = getSessionCookie(await headers());
  if (cookies != null) redirect('/');

  return <AuthCard type="signIn" />;
}

export default Page;
