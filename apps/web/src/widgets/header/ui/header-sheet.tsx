import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

import { Button, buttonVariants } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { HeaderLogo } from './header-logo';
import { navLinks } from '../config/nav-links';

export function HeaderSheet() {
  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ size: 'icon', variant: 'ghost', className: 'md:hidden' })}>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent className="px-4 md:hidden">
        <SheetHeader className="flex flex-col items-center">
          <Link href="/">
            <HeaderLogo className="h-11 w-full" />
          </Link>
          <SheetTitle className="sr-only">Purrfect Match</SheetTitle>
          <SheetDescription>Website navigation menu</SheetDescription>
        </SheetHeader>
        <div className="flex gap-y-2">
          {navLinks.map(link => (
            <Link key={link.label} className={buttonVariants({ variant: 'ghost' })} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2">
          <Button className="w-full" variant="outline">
            Sign In
          </Button>
          <Button className="w-full">Get Started</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
