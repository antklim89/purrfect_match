import type { ReactNode } from 'react';

import { SignOutButton } from '@/features/auth';
import { buttonVariants } from '@/shared/ui/button';
import { NavLink } from '@/shared/ui/nav-link';

export function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container my-8 flex gap-4 flex-col md:flex-row">
      <div className="flex flex-wrap md:flex-col gap-2 *:grow *:min-w-38 self-start">
        <NavLink
          href="/profile/info"
          className={buttonVariants({ variant: 'outline' })}
          activeClassName={buttonVariants({ variant: 'default' })}
        >
          User
        </NavLink>
        <NavLink
          href="/profile/create"
          className={buttonVariants({ variant: 'outline' })}
          activeClassName={buttonVariants({ variant: 'default' })}
        >
          Create Ad
        </NavLink>
        <NavLink
          href="/profile/my-ads"
          className={buttonVariants({ variant: 'outline' })}
          activeClassName={buttonVariants({ variant: 'default' })}
        >
          My Ads
        </NavLink>
        <NavLink
          href="/profile/favorites"
          className={buttonVariants({ variant: 'outline' })}
          activeClassName={buttonVariants({ variant: 'default' })}
        >
          Favorites
        </NavLink>
        <SignOutButton className={buttonVariants({ variant: 'destructive' })}>Sign Out</SignOutButton>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
