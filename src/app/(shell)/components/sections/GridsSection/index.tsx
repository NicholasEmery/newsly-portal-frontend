"use client";

import CardsGridClient from "./components/CardsGridClient";
import SectionSkeleton from "@/app/(shell)/components/sections/SectionSkeleton";
import SectionEmptyState from "@/app/(shell)/components/sections/SectionEmptyState";
import SubscriberSectionClient from "./components/SubscriberSectionClient";
import SubscriberBanner from "./components/SubscriberBanner";
import SectionFrame from "@/app/(shell)/components/layout/SectionFrame";
import { useLazyLoadSection } from "@/app/hooks/useLazyLoadSection";
import { useSectionReveal } from "@/app/hooks/useSectionReveal";
import { useSubscriberRotation } from "@/app/hooks/useSubscriberRotation";
import {
  getHomeGridsSectionPageClient,
  getSubscriberNewsSectionPageClient,
} from "@/api/services/homeSections.client";
import { routes } from "@/api/routes";
import { Fragment } from "react";
import type {
  HomeSectionDto,
  HomeSectionItemDto,
} from "@/api/schemas/homepage";
import type { SubscriberVariant } from "@/app/hooks/useSubscriberRotation";
import {
  isCategoryRouteSource,
  resolveCategoryHref,
  type CategoryRouteSource,
} from "@/utils/categoryRoute";
import { useTranslations } from "next-intl";

type GridsData = {
  homeGrids: HomeSectionDto[];
  subscriberQueue: HomeSectionItemDto[];
  categories: CategoryRouteSource[];
};

const sectionKey = (section: HomeSectionDto) =>
  `${section.FilterLabel}-${section.Category}`;

const GridsSection = () => {
  const t = useTranslations("sections");
  const { targetRef, data, hasError, isLoading } = useLazyLoadSection<GridsData>({
    rootMargin: "220px 0px",
    threshold: 0.1,
    fetcher: async () => {
      const [homeGrids, subscriberQueue, categoryResponse] = await Promise.all([
        getHomeGridsSectionPageClient({ limit: 4, page: 1 }),
        getSubscriberNewsSectionPageClient({ limit: 2, page: 1 }),
        fetch(routes.categories)
          .then(async (response) => {
            if (!response.ok) return [];
            return await response.json();
          })
          .catch(() => []),
      ]);

      const categories = Array.isArray(categoryResponse)
        ? categoryResponse.filter(isCategoryRouteSource)
        : [];

      return { homeGrids, subscriberQueue, categories };
    },
  });

  const { revealClass } = useSectionReveal(Boolean(data?.homeGrids.length));

  const sectionsWithSubscribers = useSubscriberRotation(
    data?.homeGrids || [],
    data?.subscriberQueue || [],
  );

  const renderSubscriberSection = (
    section: HomeSectionDto,
    subscriberItem: HomeSectionItemDto,
    subscriberVariant: SubscriberVariant,
  ) => {
    if (subscriberVariant === "card") {
      return (
        <SubscriberSectionClient
          Category={subscriberItem.Category || section.Category}
          Title={subscriberItem.Title || ""}
          CreatedAt={subscriberItem.CreatedAt || "-"}
          CountComments={subscriberItem.CommentsCount || 0}
          ImageUrl={subscriberItem.ImgUrl || ""}
          Slug={subscriberItem.Slug || "/"}
        />
      );
    }

    return (
      <SubscriberBanner
        Category={subscriberItem.Category || section.Category}
        Title={subscriberItem.Title || ""}
        CountComments={subscriberItem.CommentsCount || 0}
        ImageUrl={subscriberItem.ImgUrl || ""}
        Creator={subscriberItem.Creator || ""}
        Description={subscriberItem.Description || ""}
        Slug={subscriberItem.Slug || "/"}
      />
    );
  };

  return (
    <div
      ref={targetRef}
      className="w-full flex flex-col gap-10"
      data-cy="lazy-grids-section"
    >
      {!sectionsWithSubscribers.length ? (
        !hasError && (isLoading || !data) ? (
          <>
            <SectionSkeleton variant="grid" />
            <SectionSkeleton variant="subscriber" />
            <SectionSkeleton variant="grid" />
            <SectionSkeleton variant="subscriber-banner" />
          </>
        ) : (
          <SectionEmptyState
            className="py-10"
            title={
              hasError
                ? t("emptyState.unavailableTitle")
                : t("emptyState.gridTitle")
            }
            description={
              hasError
                ? t("emptyState.unavailableDescription")
                : t("emptyState.gridDescription")
            }
            actionLabel={t("viewMore")}
            actionHref="/latest-news"
          />
        )
      ) : (
        sectionsWithSubscribers.map(
          ({ section, subscriberItem, subscriberVariant }, idx) => (
            <Fragment key={sectionKey(section)}>
              <SectionFrame
                as="section"
                className={`${revealClass} w-full`}
                style={{ transitionDelay: `${Math.min(idx * 80, 320)}ms` }}
                data-cy="grid-section-block"
              >
                <CardsGridClient
                  FilterLabel={section.FilterLabel}
                  CategoryHref={resolveCategoryHref(
                    section.Category,
                    data?.categories || [],
                  )}
                  Items={section.Items.filter((item) => !item.isSubscriber)}
                />
              </SectionFrame>

              {subscriberItem && (
                <SectionFrame
                  as="section"
                  spacing="md"
                  className={`${revealClass} w-full`}
                  style={{
                    transitionDelay: `${Math.min(idx * 80 + 40, 360)}ms`,
                  }}
                  data-cy="subscriber-section-block"
                >
                  {renderSubscriberSection(
                    section,
                    subscriberItem,
                    subscriberVariant,
                  )}
                </SectionFrame>
              )}
            </Fragment>
          ),
        )
      )}
    </div>
  );
};

export default GridsSection;
