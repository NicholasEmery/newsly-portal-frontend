"use client";

import TrendingNowClient from "./components/TrendingNowClient";
import SectionSkeleton from "@/app/(shell)/components/sections/SectionSkeleton";
import { useLazyLoadSection } from "@/app/hooks/useLazyLoadSection";
import { useSectionReveal } from "@/app/hooks/useSectionReveal";
import {
  getTopNoticeSectionClient,
  getTrendingNowSectionPageClient,
} from "@/api/services/homeSections.client";
import type { TopNoticeDto, TrendingItemDto } from "@/api/schemas/homepage";

type HeroData = {
  topNotice: TopNoticeDto;
  trendingNow: TrendingItemDto[];
};

const HeroSection = () => {
  const { targetRef, data, hasError } = useLazyLoadSection<HeroData>({
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

  return (
    <div ref={targetRef} className="w-full" data-cy="lazy-hero-section">
      {data ? (
        <div className={revealClass}>
          <TrendingNowClient
            topNotice={data.topNotice}
            trendingNow={data.trendingNow}
          />
        </div>
      ) : (
        <div className="w-full py-4">
          <SectionSkeleton variant="hero" />
          {hasError && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Falha ao carregar a seção principal. Tente novamente ao recarregar
              a página.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
