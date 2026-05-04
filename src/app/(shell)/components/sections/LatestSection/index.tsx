"use client";

import LatestNews from "./components/LatestNews";
import SectionSkeleton from "@/app/(shell)/components/sections/SectionSkeleton";
import { useLazyLoadSection } from "@/app/hooks/useLazyLoadSection";
import { useSectionReveal } from "@/app/hooks/useSectionReveal";
import { getLatestNewsSectionPageClient } from "@/api/services/homeSections.client";
import type { LatestNewsSectionDto } from "@/api/schemas/homepage";

const LatestSection = () => {
  const { targetRef, data, hasError } =
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

  return (
    <div ref={targetRef} className="w-full" data-cy="lazy-latest-section">
      {data ? (
        <div className={revealClass}>
          <LatestNews section={data} />
        </div>
      ) : (
        <div className="w-full py-6">
          <SectionSkeleton variant="latest" />
          {hasError && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Falha ao carregar a seção. Tente novamente ao recarregar a página.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LatestSection;
