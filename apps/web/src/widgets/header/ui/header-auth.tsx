'use client';

import type { ComponentProps } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { authClient } from '@/shared/lib/auth-client';
import { Skeleton } from '@/shared/ui/skeleton';

export function HeaderAuth({ className, ...props }: { className?: string } & ComponentProps<'a'>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className={className} />;
  }
  if (data?.session) {
    return (
      <Link className={className} {...props} href="/profile">
        Profile
      </Link>
    );
  }
  return (
    <Link className={className} {...props} href={`/auth/sign-in?back=${searchParams.get('back') ?? pathname}`}>
      Sign In
    </Link>
  );
}
