import type { ReactNode } from 'react';
import { PanelLeftIcon } from 'lucide-react';

import { buttonVariants } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';

export function AdCatalogSheet({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger aria-label="toggle ad filters menu" className={buttonVariants({ size: 'lg' })}>
        <PanelLeftIcon data-icon="inline-start" /> Filters
      </SheetTrigger>
      <SheetContent side="left" className="px-4">
        <SheetHeader className="flex flex-col items-center">
          <SheetTitle>Ad Filters</SheetTitle>
          <SheetDescription className="sr-only">Ad filters</SheetDescription>
        </SheetHeader>

        <div>{children}</div>
      </SheetContent>
    </Sheet>
  );
}
