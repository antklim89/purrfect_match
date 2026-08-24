import type { ReactNode } from 'react';
import { FilterIcon } from 'lucide-react';

import { buttonVariants } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';

export function AdCatalogSheet({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger aria-label="toggle navigation menu" className={buttonVariants({ className: 'xl:hidden' })}>
        <FilterIcon data-icon="inline-start" /> Filters
      </SheetTrigger>
      <SheetContent side="left" className="px-4 xl:hidden">
        <SheetHeader className="flex flex-col items-center">
          <SheetTitle>Ad Filter</SheetTitle>
          <SheetDescription className="sr-only">Ad filters</SheetDescription>
        </SheetHeader>

        <div className="mt-12 flex flex-col gap-2 *:w-full">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
