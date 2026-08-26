import { type ReactNode, Suspense } from 'react';

import { AdCatalogSheet } from './ad-catalog-sheet';

export function AdCatalog({ children, filtersSlot }: { children: ReactNode; filtersSlot: ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-64 hidden xl:block">
        <Suspense>{filtersSlot}</Suspense>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="self-end xl:hidden">
          <AdCatalogSheet>
            <Suspense>{filtersSlot}</Suspense>
          </AdCatalogSheet>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
