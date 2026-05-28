'use client';

import type { ReactNode } from 'react';

import { useScroll } from '@/shared/lib/hooks/use-scroll';
import { cn } from '@/shared/lib/utils';

export function HeaderContainer({ children }: { children: ReactNode }) {
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
        {children}
      </nav>
    </header>
  );
}
