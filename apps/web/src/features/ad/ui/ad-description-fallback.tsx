import { SkeletonText } from '@/shared/ui/skeleton';

export function AdDescriptionFallback() {
  return (
    <p className="whitespace-pre-line">
      <SkeletonText className="w-full" />
      <SkeletonText className="w-full" />
      <SkeletonText className="w-full" />
      <SkeletonText className="w-full" />
      <SkeletonText className="w-3/4" />
    </p>
  );
}
