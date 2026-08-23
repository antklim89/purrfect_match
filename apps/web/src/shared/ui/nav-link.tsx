'use client';

import type { ComponentProps } from 'react';
import type { Route } from 'next';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({
  className,
  activeClassName,
  ...props
}: LinkProps<Route> & ComponentProps<typeof Link> & { activeClassName?: string }) {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  return <Link className={isActive ? activeClassName : className} {...props} />;
}
