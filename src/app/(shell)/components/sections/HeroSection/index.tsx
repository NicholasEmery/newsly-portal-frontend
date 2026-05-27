"use client";

import TrendingNowClient from "./components/TrendingNowClient";
import SectionSkeleton from "@/app/(shell)/components/sections/SectionSkeleton";
import SectionEmptyState from "@/app/(shell)/components/sections/SectionEmptyState";
import { useLazyLoadSection } from "@/app/hooks/useLazyLoadSection";
import { useSectionReveal } from "@/app/hooks/useSectionReveal";
import {
  getTopNoticeSectionClient,
  getTrendingNowSectionPageClient,
} from "@/api/services/homeSections.client";
import type { TopNoticeDto, TrendingItemDto } from "@/api/schemas/homepage";
import { useTranslations } from "next-intl";

type HeroData = {
  topNotice: TopNoticeDto;
  trendingNow: TrendingItemDto[];
};

const HeroSection = () => {
  const t = useTranslations("sections");
  const { targetRef, data, hasError, isLoading } = useLazyLoadSection<HeroData>({
    rootMargin: "240px 0px",
    threshold: 0.05,
    fetcher: async () => {
      const [topNotice, trendingNow] = await Promise.all([
        getTopNoticeSectionClient(),
        getTrendingNowSectionPageClient({ limit: 4, page: 1 }),
      ]);

      return { topNotice, trendingNow };
    },
  });

  const { revealClass } = useSectionReveal(Boolean(data));
  const hasContent = Boolean(data?.topNotice?.Slug) || Boolean(data?.trendingNow?.length);

  return (
    <div ref={targetRef} className="w-full" data-cy="lazy-hero-section">
      {data && hasContent ? (
        <div className={revealClass}>
          <TrendingNowClient
            topNotice={data.topNotice}
            trendingNow={data.trendingNow}
          />
        </div>
      ) : !hasError && (isLoading || !data) ? (
        <div className="w-full py-4">
          <SectionSkeleton variant="hero" />
        </div>
      ) : (
        <SectionEmptyState
          className="py-8"
          title={
            hasError
              ? t("emptyState.unavailableTitle")
              : t("emptyState.heroTitle")
          }
          description={
            hasError
              ? t("emptyState.unavailableDescription")
              : t("emptyState.heroDescription")
          }
          actionLabel={t("viewMore")}
          actionHref="/latest-news"
        />
      )}
    </div>
  );
};

export default HeroSection;
