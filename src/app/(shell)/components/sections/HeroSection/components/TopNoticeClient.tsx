"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { buildCreatorRoute, buildNoticeRoute } from "@/utils/userRoute";
import {
  SKELETON_RATIO_KEYS,
  useAdaptiveSkeletonProbe,
} from "@/app/hooks/useAdaptiveSkeletonMeasurement";
import type { TopNoticeDto } from "@/api/schemas/homepage";

interface TopNoticeClientProps {
  item: TopNoticeDto;
}

const TopNoticeClient = ({ item }: TopNoticeClientProps) => {
  const t = useTranslations("cards");
  const resolveCreatorHref = buildCreatorRoute(item.Creator);
  const resolveNoticeHref = buildNoticeRoute(item.Slug);
  const mediaProbeRef = useAdaptiveSkeletonProbe<HTMLDivElement>({
    cacheKey: SKELETON_RATIO_KEYS.heroTopNoticeMedia,
    enabled: Boolean(item.ImgUrl),
  });

  return (
    <div className="group w-full h-full flex flex-col items-center justify-center gap-5 rounded-xl">
      <Link href={resolveNoticeHref} className="w-full">
        <div
          ref={mediaProbeRef}
          data-cy="top-notice-media"
          className="transform w-full h-30 sm:h-50 md:h-60 lg:h-70 xl:h-80 2xl:h-110 rounded-xl transition-transform cursor-pointer duration-700 group-hover:scale-105 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(\"${item.ImgUrl}\")` }}
        />
      </Link>
      <div className="flex items-center justify-center">
        <p className="px-3 py-1 mr-4 bg-primary-blue rounded-full text-[clamp(0.7rem,0.6vw,0.8rem)] font-semibold! text-white uppercase">
          {item.Category}
        </p>
        <span className="mr-1 text-gray-400 text-[clamp(0.7rem,0.6vw,0.8rem)] font-medium!">
          {t("by")}
        </span>
        <Link href={resolveCreatorHref}>
          <p className="text-[clamp(0.7rem,0.6vw,0.8rem)] font-poppins font-semibold! uppercase hover:text-gray-500 transition-colors duration-500 cursor-pointer">
            {item.Creator}
          </p>
        </Link>
      </div>
      <Link href={resolveNoticeHref}>
        <div className="flex flex-col items-center justify-center gap-5 cursor-pointer">
          <h1 className="font-normal text-[clamp(1.5rem,2vw,3rem)] group-hover:text-primary-blue transition-colors duration-400">
            {item.Title}
          </h1>
          <p className="line-clamp-3 font-normal text-[clamp(0.8rem,0.7vw,0.9rem)] text-gray-600 dark:text-gray-400">
            {item.Description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default TopNoticeClient;
