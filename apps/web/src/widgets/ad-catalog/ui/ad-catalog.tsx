import { type ReactNode, Suspense } from 'react';

import { AdCatalogSheet } from './ad-catalog-sheet';

export function AdCatalog({ children, filtersSlot }: { children: ReactNode; filtersSlot: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="flex flex-col gap-8 xl:flex-row">
        <div className="shrink-0 xl:w-64 hidden xl:block">
          <div className="flex flex-col gap-2">
            <Suspense>{filtersSlot}</Suspense>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-end">
            <AdCatalogSheet>
              <Suspense>{filtersSlot}</Suspense>
            </AdCatalogSheet>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
