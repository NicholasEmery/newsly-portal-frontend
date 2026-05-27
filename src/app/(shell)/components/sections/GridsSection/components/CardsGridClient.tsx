"use client";

import Link from "next/link";
import Card, { CardProps } from "@/app/components/server/cards/Card";
import { useTranslations } from "next-intl";
import {
  isDontMissOutFilterLabel,
  resolveSectionFilterLabel,
} from "@/utils/sectionFilterLabel";

interface CardsGridClientProps {
  FilterLabel: string;
  CategoryHref?: string | null;
  Items: CardProps[];
}

const CardsGridClient = ({
  FilterLabel,
  CategoryHref,
  Items,
}: CardsGridClientProps) => {
  const tCards = useTranslations("cards");
  const tSections = useTranslations("sections");
  const isDontMissOut = isDontMissOutFilterLabel(FilterLabel);
  const resolvedFilterLabel = resolveSectionFilterLabel(FilterLabel, (key) =>
    tSections(key),
  );
  const visibleItems = Items.slice(0, isDontMissOut ? 3 : 4);

  return (
    <section className="w-full flex flex-col justify-center items-center gap-10">
      <div className="w-full flex flex-row items-center justify-between p-4 border-b-2 border-gray-300">
        <h1 className="font-bold uppercase text-[clamp(1rem,1vw,1.5rem)] text-left">
          {resolvedFilterLabel}
        </h1>
        {CategoryHref ? (
          <p className="font-space-grotesk! font-semibold! text-[clamp(0.8rem,0.8vw,1.2rem)] hover:text-primary-blue transition-colors duration-400">
            <Link href={CategoryHref}>{tCards("viewMore")}</Link>
          </p>
        ) : (
          <p className="font-space-grotesk! font-semibold! text-[clamp(0.8rem,0.8vw,1.2rem)] opacity-60 dark:opacity-40">
            {tCards("viewMore")}
          </p>
        )}
      </div>
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 ${isDontMissOut ? "2xl:grid-cols-3" : "2xl:grid-cols-4"} items-start justify-center gap-6`}
      >
        {visibleItems.length > 0 ? (
          visibleItems.map((item, idx) => (
            <Card
              key={item.Title + idx}
              {...item}
              Category={isDontMissOut ? item.Category : undefined}
            />
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-gray-300/90 bg-gray-50/80 p-6 text-center dark:border-gray-700 dark:bg-gray-900/40">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {tSections("emptyState.gridTitle")}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {tSections("emptyState.gridDescription")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CardsGridClient;
