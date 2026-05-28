import { Suspense } from 'react';
import Link from 'next/link';

import { buttonVariants } from '@/shared/ui/button';
import { SheetClose } from '@/shared/ui/sheet';
import { HeaderAuth } from './header-auth';
import { HeaderContainer } from './header-container';
import { HeaderLogo } from './header-logo';
import { HeaderSheet } from './header-sheet';

export function Header() {
  return (
    <HeaderContainer>
      <Link href="/">
        <HeaderLogo />
      </Link>

      <div className="hidden items-center gap-2 md:flex">
        <Link className={buttonVariants({ variant: 'ghost' })} href="/about">
          About
        </Link>
        <Suspense>
          <HeaderAuth className={buttonVariants({ variant: 'ghost', className: 'w-22' })} />
        </Suspense>
        <Link className={buttonVariants()} href="/">
          Explore
        </Link>
      </div>

      <HeaderSheet
        logoSlot={
          <SheetClose
            nativeButton={false}
            render={
              <Link href="/">
                <HeaderLogo />
              </Link>
            }
          />
        }
      >
        <SheetClose
          nativeButton={false}
          render={
            <Link className={buttonVariants({ variant: 'outline' })} href="/about">
              About
            </Link>
          }
        />
        <Suspense>
          <SheetClose nativeButton={false} render={<HeaderAuth className={buttonVariants({ variant: 'outline' })} />} />
        </Suspense>
        <SheetClose
          nativeButton={false}
          render={
            <Link className={buttonVariants()} href="/">
              Explore
            </Link>
          }
        />
      </HeaderSheet>
    </HeaderContainer>
  );
}
