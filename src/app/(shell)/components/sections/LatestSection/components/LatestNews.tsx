"use client";

import Link from "next/link";
import ContainerLatestNews from "./ContainerLatestNews";
import { useGlobalStore } from "@/app/store/stateGlobals";
import { Fragment } from "react";
import Card from "@/app/components/server/cards/Card";
import CardSimplified from "@/app/components/server/cards/CardSimplified";
import SectionEmptyState from "@/app/(shell)/components/sections/SectionEmptyState";
import type { LatestNewsSectionDto } from "@/api/schemas/homepage";
import { useTranslations } from "next-intl";

interface LatestNewsProps {
  section: LatestNewsSectionDto;
}

const LatestNews = ({ section }: LatestNewsProps) => {
  const { open } = useGlobalStore();
  const t = useTranslations("sections");
  const { Hero, Feed, SideCard, SideProfile } = section;

  const compactItems = [Hero, ...Feed, SideCard, SideProfile].reduce<
    Array<{
      Slug: string;
      Title: string;
      Creator: string;
      ImgUrl?: string;
      ImgUrlCreator?: string;
      Category?: string;
      CreatedAt?: string;
    }>
  >((acc, item) => {
    if (!item?.Slug || acc.some((entry) => entry.Slug === item.Slug)) {
      return acc;
    }

    if ("ImgUrl" in item) {
      acc.push({
        Slug: item.Slug,
        Title: item.Title,
        Creator: item.Creator,
        ImgUrl: item.ImgUrl,
        Category: item.Category,
        CreatedAt: item.CreatedAt,
      });
      return acc;
    }

    acc.push({
      Slug: item.Slug,
      Title: item.Title,
      Creator: item.Creator,
      ImgUrlCreator: item.ImgProfileUrl,
      Category: item.Category,
      CreatedAt: item.CreatedAt,
    });
    return acc;
  }, []);

  const hasNoNews = compactItems.length === 0;
  const useCompactLayout = compactItems.length > 0 && compactItems.length <= 4;

  if (hasNoNews) {
    return (
      <SectionEmptyState
        className="py-10"
        title={t("emptyState.latestTitle")}
        description={t("emptyState.latestDescription")}
      />
    );
  }

  if (useCompactLayout) {
    const [featured, ...secondary] = compactItems;

    return (
      <section className="relative left-1/2 w-screen -translate-x-1/2 py-10 flex flex-col justify-center items-center bg-black text-white overflow-x-clip">
        <div
          className={`${!open ? "w-3/4" : "w-2/3"} flex flex-col justify-center items-center gap-10`}
        >
          <div className="w-full flex flex-row items-center justify-between p-4 border-b-2 border-gray-300">
            <h1 className="text-white font-bold uppercase text-[clamp(1rem,1vw,1.5rem)] text-left">
              {t("latestNews")}
            </h1>
            <p className="text-white font-space-grotesk! font-semibold! text-[clamp(0.8rem,0.8vw,1.2rem)] hover:text-primary-blue transition-colors duration-400 dark:text-white">
              <Link href="/latest-news">{t("viewMore")}</Link>
            </p>
          </div>

          <div className="w-full grid gap-8 grid-cols-1 xl:grid-cols-[1.2fr_0.8fr]">
            {featured.ImgUrl ? (
              <ContainerLatestNews
                item={{
                  Title: featured.Title,
                  Creator: featured.Creator,
                  Category: featured.Category || t("latestNews"),
                  CreatedAt: featured.CreatedAt || "",
                  ImgUrl: featured.ImgUrl,
                  Slug: featured.Slug,
                }}
              />
            ) : (
              <CardSimplified
                Title={featured.Title}
                Creator={featured.Creator}
                Slug={featured.Slug}
                ImgUrlCreator={featured.ImgUrlCreator}
              />
            )}

            <div className="flex flex-col gap-5">
              {secondary.map((item, idx) => (
                <Fragment key={`${item.Slug}-${idx}`}>
                  <CardSimplified
                    Title={item.Title}
                    Creator={item.Creator}
                    Slug={item.Slug}
                    ImgUrl={item.ImgUrl}
                    ImgUrlCreator={item.ImgUrlCreator}
                  />
                  {idx < secondary.length - 1 && (
                    <span className="border-b-2 border-gray-300" />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 py-10 flex flex-col justify-center items-center bg-black text-white overflow-x-clip">
      <div
        className={`${!open ? "w-3/4" : "w-2/3"} flex flex-col justify-center items-center gap-10`}
      >
        <div className="w-full flex flex-row items-center justify-between p-4 border-b-2 border-gray-300">
          <h1 className="text-white font-bold uppercase text-[clamp(1rem,1vw,1.5rem)] text-left">
            {t("latestNews")}
          </h1>
          <p className="text-white font-space-grotesk! font-semibold! text-[clamp(0.8rem,0.8vw,1.2rem)] hover:text-primary-blue transition-colors duration-400 dark:text-white">
            <Link href="/latest-news">{t("viewMore")}</Link>
          </p>
        </div>
        <div className="w-full grid gap-12 grid-cols-1 xl:grid-cols-[50%_1fr_1fr]">
          <ContainerLatestNews item={Hero} />
          <div className="flex flex-col gap-5">
            {Feed.map((item, idx) => {
              const showDivider = idx < Feed.length - 1;
              return (
                <Fragment key={item.Slug}>
                  <Card
                    Title={item?.Title || ""}
                    Creator={item?.Creator || ""}
                    Slug={item?.Slug || "/"}
                  />
                  {showDivider && (
                    <span className="border-b-2 border-gray-300" />
                  )}
                </Fragment>
              );
            })}
          </div>
          <div className="flex xl:flex-col lg:flex-row flex-col gap-5">
            <Card
              ImgUrl={SideCard?.ImgUrl || ""}
              Title={SideCard?.Title || ""}
              Creator={SideCard?.Creator || ""}
              Slug={SideCard?.Slug || "/"}
            />
            <span className="border-b-2 border-gray-300"></span>
            <CardSimplified
              ImgUrlCreator={SideProfile.ImgProfileUrl}
              Title={SideProfile.Title}
              Creator={SideProfile.Creator}
              Slug={SideProfile.Slug}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
