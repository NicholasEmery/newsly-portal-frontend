"use client";

import Link from "next/link";
import ContainerLatestNews from "./ContainerLatestNews";
import { useGlobalStore } from "@/app/store/stateGlobals";
import { Fragment } from "react";
import Card from "./Card";
import CardSimplified from "./CardSimplified";
import type { LatestNewsSectionDto } from "@/api/schemas/homepage";

interface LatestNewsProps {
  section: LatestNewsSectionDto;
}

const LatestNews = ({ section }: LatestNewsProps) => {
  const { open } = useGlobalStore();
  const { Hero, Feed, SideCard, SideProfile } = section;

  return (
    <section className="w-screen py-10 flex flex-col justify-center items-center bg-black text-white">
      <div
        className={`${!open ? "w-3/4" : "w-2/3"} flex flex-col justify-center items-center gap-10`}
      >
        <div className="w-full flex flex-row items-center justify-between p-4 border-b-2 border-gray-300">
          <h1 className="text-white font-bold uppercase text-[clamp(1rem,1vw,1.5rem)] text-left">
            Latest News
          </h1>
          <p className="text-white font-space-grotesk! font-semibold! text-[clamp(0.8rem,0.8vw,1.2rem)] hover:text-primary-blue transition-colors duration-400 dark:text-white">
            <Link href="/latest-news">View More</Link>
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
