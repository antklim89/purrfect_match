import { type ReactNode, Suspense } from 'react';

import { AdCatalogSheet } from './ad-catalog-sheet';

export function AdCatalog({
  children,
  filtersSlot,
  sortSlot,
  paginationSlot,
}: {
  children: ReactNode;
  filtersSlot: ReactNode;
  sortSlot: ReactNode;
  paginationSlot?: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-64 hidden xl:block">
        <Suspense>{filtersSlot}</Suspense>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex gap-4 items-center justify-end">
          <div className="w-full">{paginationSlot}</div>

          <Suspense>{sortSlot}</Suspense>

          <div className="self-end xl:hidden">
            <AdCatalogSheet>
              <Suspense>{filtersSlot}</Suspense>
            </AdCatalogSheet>
          </div>
        </div>

        <div>{children}</div>

        <div className="w-full">{paginationSlot}</div>
      </div>
    </div>
  );
}
