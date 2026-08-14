import type { Metadata } from 'next';

import { AuthCard } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign Up',
};

async function Page() {
  return <AuthCard type="signUp" />;
}

export default Page;
