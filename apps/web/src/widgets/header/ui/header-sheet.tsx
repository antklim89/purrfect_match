import type { ReactNode } from 'react';
import { MenuIcon } from 'lucide-react';

import { buttonVariants } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';

export function HeaderSheet({ children, logoSlot }: { children: ReactNode; logoSlot: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ size: 'icon', variant: 'ghost', className: 'md:hidden' })}>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent className="px-4 md:hidden">
        <SheetHeader className="flex flex-col items-center">
          {logoSlot}
          <SheetTitle className="sr-only">Purrfect Match</SheetTitle>
          <SheetDescription>Website navigation menu</SheetDescription>
        </SheetHeader>

        <div className="mt-12 flex flex-col gap-2 *:w-full">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
