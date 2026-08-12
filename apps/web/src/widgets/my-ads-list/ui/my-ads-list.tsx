import type { ReactNode } from 'react';

import { ItemGroup } from '@/shared/ui/item';

export function MyAdsList({ children }: { children: ReactNode }) {
  return (
    <div>
      <h1 className="text-4xl mb-8">My Ads</h1>
      <ItemGroup>{children}</ItemGroup>
    </div>
  );
}
