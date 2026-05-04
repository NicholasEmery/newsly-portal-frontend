import CardSkeleton from "@/app/components/client/cards/CardSkeleton";
import AdaptiveMediaSkeleton from "@/app/components/client/ui/Skeleton/AdaptiveMediaSkeleton";
import SkeletonPattern from "@/app/components/client/ui/Skeleton/SkeletonPattern";
import Skeleton from "@/app/components/client/ui/Skeleton";
import { SKELETON_RATIO_KEYS } from "@/app/hooks/useAdaptiveSkeletonMeasurement";
import type { SkeletonPatternContract } from "@/app/components/client/ui/Skeleton/contracts";

type SectionSkeletonProps = {
  variant?:
    | "hero"
    | "latest"
    | "grid"
    | "subscriber"
    | "subscriber-banner"
    | "trending-card"
    | "categories";
};

const heroLeadPattern: SkeletonPatternContract = {
  containerClassName: "w-full flex flex-col gap-5",
  blocks: [
    {
      type: "media",
      cacheKey: SKELETON_RATIO_KEYS.heroTopNoticeMedia,
      fallbackRatio: 1.55,
      className: "rounded-xl",
      skeletonClassName: "rounded-xl",
      dataCy: "hero-adaptive-media-skeleton",
    },
    {
      type: "meta",
      lines: [{ className: "h-6 w-2/5 mx-auto" }],
    },
    {
      type: "title",
      lines: [
        { className: "h-10 w-4/5 mx-auto" },
        { className: "h-10 w-3/5 mx-auto" },
      ],
    },
    {
      type: "description",
      lines: [
        { className: "h-4 w-4/5 mx-auto" },
        { className: "h-4 w-3/5 mx-auto" },
      ],
    },
  ],
};

const latestLeadPattern: SkeletonPatternContract = {
  blocks: [
    {
      type: "media",
      cacheKey: SKELETON_RATIO_KEYS.latestHeroMedia,
      fallbackRatio: 1.4,
      className: "rounded-11xl",
      skeletonClassName: "rounded-11xl",
      dataCy: "latest-adaptive-media-skeleton",
    },
  ],
};

const SectionSkeleton = ({ variant = "grid" }: SectionSkeletonProps) => {
  if (variant === "trending-card") {
    return (
      <div className="w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-3">
        <div className="w-full xl:max-w-[60%] lg:max-w-[60%] flex flex-col gap-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-2/5" />
        </div>
        <AdaptiveMediaSkeleton
          cacheKey={SKELETON_RATIO_KEYS.trendingCardMedia}
          fallbackRatio={1}
          className="rounded-xl w-full lg:w-23 lg:min-w-23"
          skeletonClassName="rounded-xl"
          dataCy="trending-card-adaptive-media-skeleton"
        />
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <section className="w-full flex flex-col xl:flex-row items-start justify-center gap-12">
        <SkeletonPattern pattern={heroLeadPattern} />
        <div className="w-full xl:max-w-[33%] xl:min-w-[33%]">
          <div className="flex flex-col gap-6 p-8 bg-white rounded-3xl dark:bg-gray-800 dark:border-gray-400 dark:border">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-35" />
                <Skeleton className="h-1 w-14 rounded-full" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-4 w-18" />
                <Skeleton className="h-1 w-10 rounded-full" />
              </div>
            </div>
            <div className="w-full flex flex-col gap-6">
              <SectionSkeleton variant="trending-card" />
              <span className="block w-full border-b-2 border-gray-300 dark:border-gray-600" />
              <SectionSkeleton variant="trending-card" />
              <span className="block w-full border-b-2 border-gray-300 dark:border-gray-600" />
              <SectionSkeleton variant="trending-card" />
              <span className="block w-full border-b-2 border-gray-300 dark:border-gray-600" />
              <SectionSkeleton variant="trending-card" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "latest") {
    return (
      <section
        className="relative left-1/2 w-screen -translate-x-1/2 py-10 flex justify-center bg-black text-white overflow-x-clip"
        data-cy="section-skeleton-latest"
      >
        <div className="w-3/4 flex flex-col gap-10">
          <div className="w-full flex flex-row items-center justify-between p-4 border-b-2 border-gray-300/70">
            <Skeleton className="h-7 w-44 bg-gray-500/40" />
            <Skeleton className="h-5 w-20 bg-gray-500/40" />
          </div>

          <div className="grid gap-12 grid-cols-1 xl:grid-cols-[50%_1fr_1fr]">
            <div className="w-full flex flex-col items-center gap-6">
              <SkeletonPattern pattern={latestLeadPattern} />
              <Skeleton className="h-6 w-3/5 bg-gray-500/35" />
              <Skeleton className="h-10 w-4/5 bg-gray-500/35" />
            </div>

            <div className="flex flex-col gap-5">
              <Skeleton className="h-24 w-full bg-gray-500/35" />
              <span className="border-b-2 border-gray-300/50" />
              <Skeleton className="h-24 w-full bg-gray-500/35" />
              <span className="border-b-2 border-gray-300/50" />
              <Skeleton className="h-24 w-full bg-gray-500/35" />
            </div>

            <div className="flex xl:flex-col lg:flex-row flex-col gap-5">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-45 w-full rounded-11xl bg-gray-500/35" />
                <Skeleton className="h-6 w-4/5 bg-gray-500/35" />
                <Skeleton className="h-4 w-3/5 bg-gray-500/35" />
              </div>
              <span className="border-b-2 border-gray-300/50" />
              <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-3">
                <div className="w-full xl:max-w-[60%] lg:max-w-[60%] flex flex-col gap-2">
                  <Skeleton className="h-6 w-full bg-gray-500/35" />
                  <Skeleton className="h-4 w-2/5 bg-gray-500/35" />
                </div>
                <Skeleton className="w-full h-30 mb-3 lg:w-23 lg:h-23 sm:h-35 rounded-xl bg-gray-500/35" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "subscriber") {
    return (
      <section className="w-full" data-cy="section-skeleton-subscriber">
        <div className="relative left-1/2 -translate-x-1/2 w-[calc(100vw-80px)] max-w-[calc(100vw-80px)] overflow-hidden rounded-11xl">
          <AdaptiveMediaSkeleton
            cacheKey={SKELETON_RATIO_KEYS.subscriberHighlightMedia}
            fallbackRatio={1.9}
            className="rounded-11xl"
            skeletonClassName="rounded-11xl"
            dataCy="subscriber-adaptive-media-skeleton"
          />
          <div className="absolute inset-0 z-10 flex flex-col justify-end items-center gap-5 px-8 py-10">
            <div className="flex flex-row items-center justify-center gap-2">
              <Skeleton className="h-6 w-24 rounded-full bg-gray-300/60" />
              <Skeleton className="h-4 w-28 bg-gray-300/60" />
            </div>
            <div className="w-full max-w-4xl flex flex-col justify-center items-center gap-3">
              <Skeleton className="h-10 w-4/5 bg-gray-300/60" />
              <Skeleton className="h-10 w-3/5 bg-gray-300/60" />
            </div>
            <div className="flex flex-row justify-center items-center gap-3">
              <Skeleton className="h-4 w-28 bg-gray-300/60" />
              <Skeleton className="h-4 w-24 bg-gray-300/60" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "subscriber-banner") {
    return (
      <section className="w-full" data-cy="section-skeleton-subscriber-banner">
        <div className="w-full flex flex-col-reverse xl:flex-row items-stretch justify-stretch bg-white rounded-11xl dark:bg-gray-800 overflow-hidden">
          <div className="w-full xl:w-1/2 py-15 px-10 lg:py-20 lg:px-15 flex flex-col items-start justify-center gap-5">
            <div className="flex flex-row items-center justify-center gap-2">
              <Skeleton className="h-6 w-26 rounded-full" />
              <Skeleton className="h-4 w-22" />
            </div>
            <div className="w-full flex flex-col items-start justify-center gap-5">
              <Skeleton className="h-10 w-4/5" />
              <Skeleton className="h-10 w-3/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="h-13 w-13 rounded-full" />
              <Skeleton className="h-5 w-26" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
          <AdaptiveMediaSkeleton
            cacheKey={SKELETON_RATIO_KEYS.subscriberBannerMedia}
            fallbackRatio={1.6}
            className="w-full xl:w-1/2 min-h-80 xl:min-h-0 rounded-t-11xl xl:rounded-tl-none xl:rounded-r-11xl"
            skeletonClassName="rounded-t-11xl xl:rounded-tl-none xl:rounded-r-11xl"
            dataCy="subscriber-banner-adaptive-media-skeleton"
          />
        </div>
      </section>
    );
  }

  if (variant === "categories") {
    return (
      <section
        className="relative left-1/2 w-screen -translate-x-1/2 py-10 flex flex-col justify-center items-center bg-[#03060d] text-white overflow-x-clip"
        data-cy="section-skeleton-categories"
      >
        <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <article key={idx} className="flex h-full flex-col gap-5">
              <div className="flex flex-col gap-3">
                <Skeleton className="h-6 w-28 bg-gray-600/45" />
                <Skeleton className="h-1 w-9 rounded-full bg-blue-500/55" />
              </div>

              <div className="flex items-center gap-4">
                <Skeleton className="h-6 flex-1 bg-gray-600/40" />
                <Skeleton className="h-18 w-18 rounded-2xl bg-gray-600/45" />
              </div>

              <div className="flex flex-col divide-y divide-white/12 border-y border-white/12">
                <div className="py-3">
                  <Skeleton className="h-4 w-full bg-gray-600/35" />
                </div>
                <div className="py-3">
                  <Skeleton className="h-4 w-11/12 bg-gray-600/35" />
                </div>
                <div className="py-3">
                  <Skeleton className="h-4 w-10/12 bg-gray-600/35" />
                </div>
              </div>

              <div className="mt-auto inline-flex w-fit items-center gap-3">
                <Skeleton className="h-4 w-34 bg-gray-600/40" />
                <Skeleton className="h-7 w-7 rounded-full bg-gray-600/45" />
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full flex flex-col gap-10"
      data-cy="section-skeleton-grid"
    >
      <div className="w-full flex flex-row items-center justify-between p-4 border-b-2 border-gray-300">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-5 w-20" />
      </div>
      <CardSkeleton count={4} variant="mixed" />
    </section>
  );
};

export default SectionSkeleton;
