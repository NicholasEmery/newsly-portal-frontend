"use client";

import LatestNews from "./components/LatestNews";
import SectionSkeleton from "@/app/(shell)/components/sections/SectionSkeleton";
import SectionEmptyState from "@/app/(shell)/components/sections/SectionEmptyState";
import { useLazyLoadSection } from "@/app/hooks/useLazyLoadSection";
import { useSectionReveal } from "@/app/hooks/useSectionReveal";
import { getLatestNewsSectionPageClient } from "@/api/services/homeSections.client";
import type { LatestNewsSectionDto } from "@/api/schemas/homepage";
import { useTranslations } from "next-intl";

const hasLatestNewsContent = (section: LatestNewsSectionDto | null): boolean => {
  if (!section) return false;
  return section.TotalNews > 0 || section.Items.length > 0 || section.Feed.length > 0;
};

const LatestSection = () => {
  const t = useTranslations("sections");
  const { targetRef, data, hasError, isLoading } =
    useLazyLoadSection<LatestNewsSectionDto>({
      rootMargin: "180px 0px",
      threshold: 0.15,
      fetcher: async () =>
        getLatestNewsSectionPageClient({
          limit: 8,
          page: 1,
        }),
    });

  const { revealClass } = useSectionReveal(Boolean(data));
  const hasContent = hasLatestNewsContent(data);

  return (
    <div ref={targetRef} className="w-full" data-cy="lazy-latest-section">
      {data && hasContent ? (
        <div className={revealClass}>
          <LatestNews section={data} />
        </div>
      ) : !hasError && (isLoading || !data) ? (
        <div className="w-full py-6">
          <SectionSkeleton variant="latest" />
        </div>
      ) : (
        <SectionEmptyState
          className="py-10"
          title={
            hasError
              ? t("emptyState.unavailableTitle")
              : t("emptyState.latestTitle")
          }
          description={
            hasError
              ? t("emptyState.unavailableDescription")
              : t("emptyState.latestDescription")
          }
          actionLabel={t("viewMore")}
          actionHref="/latest-news"
        />
      )}
    </div>
  );
};

export default LatestSection;
