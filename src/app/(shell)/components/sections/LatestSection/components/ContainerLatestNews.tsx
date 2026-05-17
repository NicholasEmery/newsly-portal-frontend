import Image from "next/image";
import Link from "next/link";
import { buildCreatorRoute, buildNoticeRoute } from "@/utils/userRoute";
import DateDisplay from "@/app/components/server/display/DateDisplay";
import { useTranslations } from "next-intl";
import {
  SKELETON_RATIO_KEYS,
  useAdaptiveSkeletonProbe,
} from "@/app/hooks/useAdaptiveSkeletonMeasurement";

interface ContainerLatestNewsProps {
  item: {
    Title: string;
    Creator: string;
    Category: string;
    CreatedAt: string;
    ImgUrl: string;
    Slug: string;
  };
}

const ContainerLatestNews = ({ item }: ContainerLatestNewsProps) => {
  const t = useTranslations("cards");
  const resolveCreatorHref = buildCreatorRoute(item.Creator);
  const resolveNoticeHref = buildNoticeRoute(item.Slug);
  const mediaProbeRef = useAdaptiveSkeletonProbe<HTMLDivElement>({
    cacheKey: SKELETON_RATIO_KEYS.latestHeroMedia,
    enabled: Boolean(item.ImgUrl),
  });

  return (
    <div className="w-full group flex flex-col items-center gap-10 rounded-xl">
      <Link href={resolveNoticeHref} className="w-full">
        <div
          ref={mediaProbeRef}
          className="transform transition-transform duration-700 group-hover:scale-105 cursor-pointer w-full h-30 sm:h-50 md:h-60 lg:h-70 xl:h-80 2xl:h-110 rounded-xl bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(\"${item.ImgUrl}\")` }}
        />
      </Link>
      <div className="flex flex-col items-center w-full">
        <div className="grid grid-cols-2 grid-rows-2">
          <div className="flex flex-row items-center justify-center">
            <p className="px-3 py-1 mr-2 bg-primary-blue rounded-full text-[clamp(0.7rem,0.6vw,0.8rem)] font-semibold! text-white uppercase">
              {item.Category}
            </p>
          </div>
          <DateDisplay date={item.CreatedAt} variant="gray" />
          <div className="flex flex-row items-center justify-center col-span-2">
            <span className="mr-1 text-gray-400 text-[clamp(0.7rem,0.6vw,0.8rem)] font-medium!">
              {t("by")}
            </span>
            <Link href={resolveCreatorHref}>
              <p className="text-[clamp(0.7rem,0.6vw,0.8rem)] font-poppins font-semibold! uppercase cursor-pointer hover:text-gray-500 transition-colors duration-500">
                {item.Creator}
              </p>
            </Link>
          </div>
        </div>
        <Link href={resolveNoticeHref}>
          <h1 className="font-normal text-center text-[clamp(1.5rem,2vw,3rem)] group-hover:text-primary-blue transition-colors duration-400 cursor-pointer">
            {item.Title}
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default ContainerLatestNews;
