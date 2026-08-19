import type { Metadata } from 'next';

import { SignInCard } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign In',
};

async function Page() {
  return <SignInCard />;
}

export default Page;
