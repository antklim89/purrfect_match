import type { Metadata } from 'next';

import { AdCreateCard } from '@/features/ad-create';

export const metadata: Metadata = {
  title: 'Create Ad',
};

export default function Page() {
  return <AdCreateCard />;
}
