'use client';

import type * as React from 'react';
import type { Route } from 'next';
import { ChevronsLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createSerializer, parseAsInteger } from 'nuqs';

import { cn } from '@/shared/lib/utils';
import { type Button, buttonVariants } from '@/shared/ui/button';

const serializeLink = createSerializer({ page: parseAsInteger.withDefault(1) }, { clearOnDefault: false });

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<typeof Link>) {
  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      scroll={false}
      className={cn(
        buttonVariants({ variant: isActive ? 'outline' : 'ghost' /*size*/ }),
        'bg-transparent text-gray-200 hover:bg-transparent hover:text-gray-200',
        className,
      )}
      {...props}
    />
  );
}

function PaginationStart({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to first page" size="default" className={cn('pl-2!', className)} {...props}>
      <ChevronsLeftIcon data-icon="inline-start" />
      <span className="sr-only">Go to first page</span>
    </PaginationLink>
  );
}

export function Pagination({
  className,
  totalPages,
  page = 1,
  ...props
}: React.ComponentProps<'nav'> & {
  page?: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const hasPrev = page > 1;

  return (
    <nav aria-label="pagination" data-slot="pagination" className={cn('flex justify-center', className)} {...props}>
      <ul data-slot="pagination-content" className={cn('flex items-center gap-1', className)}>
        <li data-slot="pagination-item">
          <PaginationStart
            aria-disabled={!hasPrev}
            href={hasPrev ? (serializeLink(searchParams, { page: 1 }) as Route) : ('' as Route)}
            tabIndex={hasPrev ? 0 : -1}
          />
        </li>

        {[page - 2, page - 1, page, page + 1, page + 2]
          .filter((i) => i > 0 && i <= totalPages)
          .map((i) => {
            return (
              <li data-slot="pagination-item" key={i}>
                <PaginationLink
                  scroll={false}
                  href={serializeLink(searchParams, { page: i }) as Route}
                  isActive={i === page}
                >
                  {i}
                </PaginationLink>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
