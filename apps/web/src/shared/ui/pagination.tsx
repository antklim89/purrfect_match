'use client';

import type * as React from 'react';
import type { Route } from 'next';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

function PaginationRoot({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul data-slot="pagination-content" className={cn('flex items-center gap-1', className)} {...props} />;
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<typeof Link>;

function PaginationLink({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? 'outline' : 'ghost'}
      size={size}
      className={cn(className)}
      nativeButton={false}
      render={
        <Link
          aria-current={isActive ? 'page' : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      }
    />
  );
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to previous page" size="default" className={cn('pl-2!', className)} {...props}>
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to next page" size="default" className={cn('pr-2!', className)} {...props}>
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon data-icon="inline-end" />
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
  if (totalPages <= 1) return <div className={cn('mx-auto flex w-full justify-center', className)} />;

  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  function getSearchParamsLink(newPage?: number) {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newPage == null) newSearchParams.delete('page');
    else newSearchParams.set('page', newPage.toFixed(0));

    return `?${newSearchParams.toString()}`;
  }

  return (
    <PaginationRoot className={className} {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={!hasPrev}
            className={cn({
              'cursor-default bg-transparent text-gray-200 hover:bg-transparent hover:text-gray-200': !hasPrev,
            })}
            scroll={false}
            href={hasPrev ? (getSearchParamsLink(Math.max(1, page - 1)) as Route) : ('' as Route)}
            tabIndex={hasPrev ? 0 : -1}
          />
        </PaginationItem>

        {[page - 2, page - 1, page, page + 1, page + 2]
          .filter(i => i > 0 && i <= totalPages)
          .map(i => (
            <PaginationItem key={i}>
              <PaginationLink scroll={false} href={getSearchParamsLink(i) as Route} isActive={i === page}>
                {i}
              </PaginationLink>
            </PaginationItem>
          ))}

        <PaginationItem>
          <PaginationNext
            scroll={false}
            aria-disabled={!hasNext}
            className={cn({
              'cursor-default bg-transparent text-gray-200 hover:bg-transparent hover:text-gray-200': !hasNext,
            })}
            href={hasNext ? (getSearchParamsLink(Math.min(totalPages, page + 1)) as Route) : ('' as Route)}
            tabIndex={hasNext ? 0 : -1}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
