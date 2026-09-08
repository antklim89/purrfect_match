import { mergeProps, useRender } from '@base-ui/react';

import { cn } from '@/shared/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="skeleton" className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

function SkeletonText({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <span
      data-slot="skeleton"
      className={cn(
        'animate-pulse w-fit text-transparent leading-none rounded-md bg-muted inline-block m-w-12 my-0.25 select-none',
        className,
      )}
      {...props}
    >
      {children ? children : '\u00a0'}
    </span>
  );
}

function SkeletonWrapper({ className, render, ...props }: useRender.ComponentProps<'span'>) {
  return useRender({
    props: mergeProps(
      {
        className: cn(
          'animate-pulse bg-muted hover:bg-muted text-transparent **:text-transparent select-none',
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: 'skeleton-wrapper',
    },
  });
}

export { Skeleton, SkeletonText, SkeletonWrapper };
