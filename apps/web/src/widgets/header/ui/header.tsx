'use client';

import Link from 'next/link';

import { useScroll } from '@/shared/lib/hooks/use-scroll';
import { cn } from '@/shared/lib/utils';
import { Button, buttonVariants } from '@/shared/ui/button';
import { HeaderLogo } from './header-logo';
import { HeaderSheet } from './header-sheet';
import { navLinks } from '../config/nav-links';

export function Header() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full max-w-4xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out',
        {
          'border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow':
            scrolled,
        },
      )}
    >
      <nav
        className={cn('flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out', {
          'md:px-2': scrolled,
        })}
      >
        <Link className="rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50" href="/">
          <HeaderLogo className="h-12 w-full" />
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <div>
            {navLinks.map(link => (
              <a key={link.label} className={buttonVariants({ size: 'sm', variant: 'ghost' })} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <Button size="sm" variant="outline">
            Sign In
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
        <HeaderSheet />
      </nav>
    </header>
  );
}
