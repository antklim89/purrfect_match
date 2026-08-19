'use client';

import type { Route } from 'next';
import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ className, activeClassName, ...props }: LinkProps<Route> & { activeClassName?: string }) {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  return <Link className={isActive ? activeClassName : className} {...props} />;
}
