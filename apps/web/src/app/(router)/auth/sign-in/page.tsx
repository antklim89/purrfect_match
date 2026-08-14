import type { Metadata } from 'next';

import { AuthCard } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign In',
};

async function Page() {
  return <AuthCard type="signIn" />;
}

export default Page;
