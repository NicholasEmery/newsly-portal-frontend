"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { HiArrowRight } from "react-icons/hi2";
import SectionSkeleton from "@/app/(shell)/components/sections/SectionSkeleton";
import SectionEmptyState from "@/app/(shell)/components/sections/SectionEmptyState";
import { useLazyLoadSection } from "@/app/hooks/useLazyLoadSection";
import { useSectionReveal } from "@/app/hooks/useSectionReveal";
import { getHomeGridsSectionPageClient } from "@/api/services/homeSections.client";
import { routes } from "@/api/routes";
import { useGlobalStore } from "@/app/store/stateGlobals";
import type {
  HomeSectionDto,
  HomeSectionItemDto,
} from "@/api/schemas/homepage";
import {
  isCategoryRouteSource,
  resolveCategoryHref,
  type CategoryRouteSource,
} from "@/utils/categoryRoute";

type CategoryColumn = {
  key: string;
  label: string;
  href: string | null;
  spotlight: string;
  headlines: string[];
  imageSrc: string;
};

type CategoryColumnsData = {
  columns: CategoryColumn[];
};

const getRenderableItems = (section: HomeSectionDto): HomeSectionItemDto[] =>
  section.Items.filter((item) => !item.isSubscriber);

const mapSectionsToColumns = (
  sections: HomeSectionDto[],
  categories: CategoryRouteSource[],
): CategoryColumn[] =>
  sections.slice(0, 4).map((section, idx) => {
    const items = getRenderableItems(section);
    const [spotlightItem, ...remainingItems] = items;
    const categoryLabel = section.Category;

    return {
      key: `${section.FilterLabel}-${section.Category}-${idx}`,
      label: categoryLabel,
      href: resolveCategoryHref(categoryLabel, categories),
      spotlight: spotlightItem?.Title || categoryLabel,
      headlines: remainingItems
        .map((item) => item.Title)
        .filter(Boolean)
        .slice(0, 3),
      imageSrc: spotlightItem?.ImgUrl || "/images/imageScience.png",
    };
  });

const CategoriesSection = () => {
  const { open } = useGlobalStore();
  const tEditorial = useTranslations("editorialSection");
  const tSections = useTranslations("sections");
  const { targetRef, data, hasError, isLoading } = useLazyLoadSection<CategoryColumnsData>(
    {
      rootMargin: "200px 0px",
      threshold: 0.1,
      fetcher: async () => {
        const [sections, categoryResponse] = await Promise.all([
          getHomeGridsSectionPageClient({
            limit: 4,
            page: 1,
            categoriesLimit: 4,
          }),
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

        return {
          columns: mapSectionsToColumns(sections, categories),
        };
      },
    },
  );
  const { revealClass } = useSectionReveal(Boolean(data?.columns.length));

  return (
    <div
      ref={targetRef}
      className="w-full"
      data-cy="lazy-category-columns-section"
    >
      {data?.columns.length ? (
        <div className={revealClass}>
          <section className="relative left-1/2 w-screen -translate-x-1/2 py-10 flex flex-col justify-center items-center bg-[#03060d] text-white overflow-x-clip">
            <div
              className={`${!open ? "w-3/4" : "w-2/3"} grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8`}
            >
              {data.columns.map((column) => {
                const categoryLabel = column.label;

                return (
                  <article
                    key={column.key}
                    className="flex h-full flex-col gap-5"
                  >
                    <div className="flex flex-col gap-3">
                      <h2 className="text-lg font-bold uppercase tracking-[0.06em] text-white">
                        {categoryLabel}
                      </h2>
                      <span className="h-0.75 w-9 rounded-full bg-primary-blue" />
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="line-clamp-3 text-[clamp(0.95rem,1vw,1.18rem)] leading-snug text-white font-semibold">
                        {column.spotlight}
                      </p>
                      <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/5">
                        <Image
                          src={column.imageSrc}
                          alt={tEditorial("featuredImageAlt", {
                            category: categoryLabel,
                          })}
                          fill
                          className="object-cover"
                          sizes="72px"
                        />
                      </div>
                    </div>

                    <ul className="flex flex-col divide-y divide-white/12 border-y border-white/12">
                      {column.headlines.map((headline) => (
                        <li key={headline} className="py-3">
                          <p className="text-white/80 text-[0.97rem] leading-snug">
                            {headline}
                          </p>
                        </li>
                      ))}
                    </ul>

                    {column.href ? (
                      <Link
                        href={column.href}
                        className="group mt-auto inline-flex w-fit items-center gap-3 text-white font-semibold transition-colors duration-300 hover:text-primary-blue"
                      >
                        <span>
                          {tEditorial("goToCategory", { category: categoryLabel })}
                        </span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-blue text-white transition-transform duration-300 group-hover:translate-x-0.5">
                          <HiArrowRight size={14} aria-hidden />
                        </span>
                      </Link>
                    ) : (
                      <span className="mt-auto inline-flex w-fit items-center gap-3 text-white/50 font-semibold">
                        {tEditorial("goToCategory", { category: categoryLabel })}
                      </span>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      ) : (
        <div className="w-full py-4">
          {!hasError && (isLoading || !data) ? (
            <SectionSkeleton variant="categories" />
          ) : (
            <SectionEmptyState
              className="py-10"
              title={
                hasError
                  ? tSections("emptyState.unavailableTitle")
                  : tSections("emptyState.categoriesTitle")
              }
              description={
                hasError
                  ? tSections("emptyState.unavailableDescription")
                  : tSections("emptyState.categoriesDescription")
              }
              actionLabel={tSections("viewMore")}
              actionHref="/latest-news"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesSection;
