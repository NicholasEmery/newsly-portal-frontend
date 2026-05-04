"use client";

import Skeleton from "@/app/components/client/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useAdaptiveSkeletonRatio } from "@/app/hooks/useAdaptiveSkeletonMeasurement";

type AdaptiveMediaSkeletonProps = {
  cacheKey: string;
  fallbackRatio: number;
  className?: string;
  skeletonClassName?: string;
  dataCy?: string;
};

const AdaptiveMediaSkeleton = ({
  cacheKey,
  fallbackRatio,
  className,
  skeletonClassName,
  dataCy,
}: AdaptiveMediaSkeletonProps) => {
  const ratio = useAdaptiveSkeletonRatio({
    cacheKey,
    fallback: fallbackRatio,
  });

  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{ aspectRatio: ratio }}
      data-cy={dataCy}
    >
      <Skeleton className={cn("h-full w-full", skeletonClassName)} />
    </div>
  );
};

export default AdaptiveMediaSkeleton;
