"use client";

import Trending from "./Trending";
import TopNoticeClient from "./TopNoticeClient";
import type { TopNoticeDto, TrendingItemDto } from "@/api/schemas/homepage";

interface TrendingNowClientProps {
  topNotice: TopNoticeDto;
  trendingNow: TrendingItemDto[];
}

const TrendingNowClient = ({
  topNotice,
  trendingNow,
}: TrendingNowClientProps) => {
  return (
    <section className="w-full flex flex-col xl:flex-row items-start justify-center text-center gap-12">
      <div className="w-full">
        <TopNoticeClient item={topNotice} />
      </div>
      <div className="xl:max-w-[33%] xl:min-w-[33%] w-full">
        <Trending items={trendingNow} />
      </div>
    </section>
  );
};

export default TrendingNowClient;
