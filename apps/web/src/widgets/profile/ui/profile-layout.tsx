import type { ReactNode } from 'react';
import Link from 'next/link';

import { SignOutButton } from '@/features/auth';
import { buttonVariants } from '@/shared/ui/button';

export function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container my-8 flex gap-4 flex-col md:flex-row">
      <div className="flex flex-wrap md:flex-col gap-2 *:grow *:min-w-38">
        <Link href="/profile" className={buttonVariants({ variant: 'outline' })}>
          User
        </Link>
        <Link href="/profile/create" className={buttonVariants({ variant: 'outline' })}>
          Create Ad
        </Link>
        <Link href="/profile/my-ads" className={buttonVariants({ variant: 'outline' })}>
          My Ads
        </Link>
        <Link href="/profile/favorites" className={buttonVariants({ variant: 'outline' })}>
          Favorites
        </Link>
        <SignOutButton className={buttonVariants({ variant: 'destructive' })}>Sign Out</SignOutButton>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
