"use client";

import Link from "next/link";
import CardSimplified from "./CardSimplified";
import { Fragment } from "react";
import type { TrendingItemDto } from "@/api/schemas/homepage";

interface TrendingProps {
  items: TrendingItemDto[];
}

const Trending = ({ items }: TrendingProps) => {
  const trendingCards = items;
  return (
    <div className="flex flex-col justify-center gap-5 p-8 bg-white rounded-3xl dark:bg-gray-800 dark:border-gray-400 dark:border">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col justify-center items-start">
          <h1 className="font-bold uppercase text-[clamp(1rem,1.2vw,1.5rem)] text-left">
            Trending Now
          </h1>
          <div className="bg-primary-blue w-1/3 h-1" />
        </div>
        <Link
          href="/"
          className="group flex flex-col justify-center items-start"
        >
          <p className="text-black font-space-grotesk! font-semibold! text-[clamp(0.8rem,0.8vw,1.2rem)] group-hover:text-primary-blue dark:group-hover:text-white transition-colors duration-400 dark:text-white">
            View More
          </p>
          <div className="bg-primary-blue group-hover:w-4/5 transition-all duration-600 w-0 h-1" />
        </Link>
      </div>
      <div className="w-full flex flex-col gap-6">
        {trendingCards.map((post, idx) => {
          if (idx >= 4) return null;
          const showDivider = idx < trendingCards.length - 1;
          const item = post;
          return (
            <Fragment key={item.Slug}>
              <div className={idx >= 4 ? "xl:hidden 2xl:block" : ""}>
                <CardSimplified
                  Title={item?.Title || ""}
                  Creator={item?.Creator || ""}
                  ImgUrl={item?.ImgUrl || ""}
                  Slug={item?.Slug || ""}
                />
              </div>
              {showDivider && (
                <span className="block w-full border-b-2 border-gray-400 dark:border-gray-300" />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Trending;
