import type { Metadata } from 'next';

import { SignUpCard } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign Up',
};

async function Page() {
  return <SignUpCard />;
}

export default Page;
