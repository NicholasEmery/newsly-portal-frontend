import Trending from "./Trending";
import TopNotice from "./TopNotice";
import type { TopNoticeDto, TrendingItemDto } from "@/api/schemas/homepage";

interface TrendingNowProps {
  TopNotice?: TopNoticeDto;
  TrendingNow?: TrendingItemDto[];
}

const TrendingNow = ({
  TopNotice: topNoticeItem,
  TrendingNow: trendingItems,
}: TrendingNowProps) => {
  return (
    <section className="w-full flex flex-col xl:flex-row items-start justify-center text-center gap-12">
      <div className="w-full">
        {topNoticeItem && <TopNotice item={topNoticeItem} />}
      </div>
      <div className="xl:max-w-[33%] xl:min-w-[33%] w-full ">
        <Trending items={trendingItems || []} />
      </div>
    </section>
  );
};

export default TrendingNow;
