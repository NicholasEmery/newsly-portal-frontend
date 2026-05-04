"use client";

import SkeletonPattern from "@/app/components/client/ui/Skeleton/SkeletonPattern";
import { SKELETON_RATIO_KEYS } from "@/app/hooks/useAdaptiveSkeletonMeasurement";
import type {
  SkeletonMediaBlockContract,
  SkeletonPatternContract,
} from "@/app/components/client/ui/Skeleton/contracts";

type CardSkeletonProps = {
  count?: number;
  variant?: "default" | "with-category" | "mixed";
};

const buildCardPattern = (
  mediaBlock: SkeletonMediaBlockContract,
): SkeletonPatternContract => ({
  containerClassName: "flex flex-col gap-4",
  blocks: [
    mediaBlock,
    {
      type: "meta",
    },
    {
      type: "title",
    },
    {
      type: "description",
    },
  ],
});

const resolveMediaBlock = (
  variant: CardSkeletonProps["variant"],
  index: number,
): SkeletonMediaBlockContract => {
  if (variant === "default") {
    return {
      type: "media",
      cacheKey: SKELETON_RATIO_KEYS.cardMediaDefault,
      fallbackRatio: 1.65,
      className: "rounded-11xl",
      skeletonClassName: "rounded-11xl",
    };
  }

  if (variant === "with-category") {
    return {
      type: "media",
      cacheKey: SKELETON_RATIO_KEYS.cardMediaWithCategory,
      fallbackRatio: 1.3,
      className: "rounded-11xl",
      skeletonClassName: "rounded-11xl",
    };
  }

  return index % 2 === 0
    ? {
        type: "media",
        cacheKey: SKELETON_RATIO_KEYS.cardMediaDefault,
        fallbackRatio: 1.65,
        className: "rounded-11xl",
        skeletonClassName: "rounded-11xl",
      }
    : {
        type: "media",
        cacheKey: SKELETON_RATIO_KEYS.cardMediaWithCategory,
        fallbackRatio: 1.3,
        className: "rounded-11xl",
        skeletonClassName: "rounded-11xl",
      };
};

const CardSkeleton = ({ count = 4, variant = "mixed" }: CardSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 items-start justify-center gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonPattern
          key={`card-skeleton-${idx}`}
          pattern={buildCardPattern(resolveMediaBlock(variant, idx))}
        />
      ))}
    </div>
  );
};

export default CardSkeleton;
