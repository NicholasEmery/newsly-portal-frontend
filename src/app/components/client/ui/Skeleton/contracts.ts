export type SkeletonBlockType = "media" | "title" | "meta" | "description";

export type SkeletonTextLineContract = {
  className?: string;
};

export type SkeletonMediaBlockContract = {
  type: "media";
  cacheKey: string;
  fallbackRatio: number;
  className?: string;
  skeletonClassName?: string;
  dataCy?: string;
};

export type SkeletonTextBlockContract = {
  type: Exclude<SkeletonBlockType, "media">;
  className?: string;
  lines?: SkeletonTextLineContract[];
};

export type SkeletonBlockContract =
  | SkeletonMediaBlockContract
  | SkeletonTextBlockContract;

export type SkeletonPatternContract = {
  containerClassName?: string;
  blocks: SkeletonBlockContract[];
};

export const DEFAULT_TEXT_LINES_BY_BLOCK: Record<
  Exclude<SkeletonBlockType, "media">,
  SkeletonTextLineContract[]
> = {
  title: [{ className: "h-7 w-4/5" }],
  meta: [{ className: "h-5 w-24" }],
  description: [{ className: "h-4 w-2/3" }],
};
