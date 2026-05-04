"use client";

import AdaptiveMediaSkeleton from "@/app/components/client/ui/Skeleton/AdaptiveMediaSkeleton";
import Skeleton from "@/app/components/client/ui/Skeleton";
import { cn } from "@/lib/utils";
import {
  DEFAULT_TEXT_LINES_BY_BLOCK,
  type SkeletonPatternContract,
  type SkeletonTextBlockContract,
} from "@/app/components/client/ui/Skeleton/contracts";

type SkeletonPatternProps = {
  pattern: SkeletonPatternContract;
  dataCy?: string;
};

const resolveLines = (block: SkeletonTextBlockContract) => {
  if (block.lines?.length) {
    return block.lines;
  }

  return DEFAULT_TEXT_LINES_BY_BLOCK[block.type];
};

const SkeletonPattern = ({ pattern, dataCy }: SkeletonPatternProps) => {
  return (
    <div className={cn("w-full", pattern.containerClassName)} data-cy={dataCy}>
      {pattern.blocks.map((block, blockIndex) => {
        if (block.type === "media") {
          return (
            <AdaptiveMediaSkeleton
              key={`${block.type}-${blockIndex}`}
              cacheKey={block.cacheKey}
              fallbackRatio={block.fallbackRatio}
              className={block.className}
              skeletonClassName={block.skeletonClassName}
              dataCy={block.dataCy}
            />
          );
        }

        const lines = resolveLines(block);

        return (
          <div
            key={`${block.type}-${blockIndex}`}
            className={cn("flex flex-col gap-3", block.className)}
          >
            {lines.map((line, lineIndex) => (
              <Skeleton
                key={`${block.type}-${blockIndex}-line-${lineIndex}`}
                className={line.className}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default SkeletonPattern;
