'use client';

import type { ComponentProps } from 'react';
import { LogInIcon, LogOutIcon, User2Icon, UserPlus2Icon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { SignOutButton } from '@/features/auth';
import { authClient } from '@/shared/lib/auth';
import { Skeleton } from '@/shared/ui/skeleton';

export function HeaderAuth({ className, ...props }: { className?: string } & ComponentProps<'a'>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <>
        <Skeleton className={className} />
        <Skeleton className={className} />
      </>
    );
  }
  if (data?.session) {
    return (
      <>
        <Link className={className} {...props} href="/">
          <User2Icon /> Profile
        </Link>
        <SignOutButton className={className}>
          <LogOutIcon /> Sign Out
        </SignOutButton>
      </>
    );
  }
  return (
    <>
      <Link className={className} {...props} href={`/auth/sign-in?back=${searchParams.get('back') ?? pathname}`}>
        <LogInIcon /> Sign In
      </Link>
      <Link className={className} {...props} href={`/auth/sign-up?back=${searchParams.get('back') ?? pathname}`}>
        <UserPlus2Icon /> Sign Up
      </Link>
    </>
  );
}
