import { cn } from '@/shared/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="skeleton" className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

function SkeletonText({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <span
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-muted inline-block m-w-12 m-0.25', className)}
      {...props}
    >
      &nbsp;
    </span>
  );
}

export { Skeleton, SkeletonText };
