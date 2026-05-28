import { getSessionCookie } from 'better-auth/cookies';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { AuthCard } from '@/features/auth';

async function Page() {
  const cookies = getSessionCookie(await headers());
  if (cookies != null) redirect('/');

  return <AuthCard type="signUp" />;
}

export default Page;
