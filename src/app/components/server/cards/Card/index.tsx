"use client";

import Link from "next/link";
import Comments from "@/app/components/server/display/Comments";
import { buildCreatorRoute, buildNoticeRoute } from "@/utils/userRoute";
import DateDisplay from "@/app/components/server/display/DateDisplay";
import { useTranslations } from "next-intl";
import {
  SKELETON_RATIO_KEYS,
  useAdaptiveSkeletonProbe,
} from "@/app/hooks/useAdaptiveSkeletonMeasurement";

export interface CardProps {
  ImgUrl?: string;
  Title: string;
  Description?: string;
  Creator: string;
  Slug: string;
  CommentsCount?: number;
  Category?: string;
  CreatedAt?: string;
}

const Card = ({
  ImgUrl,
  Title,
  Description,
  Creator,
  Slug,
  CommentsCount,
  Category,
  CreatedAt,
}: CardProps) => {
  const t = useTranslations("cards");
  const resolvedCreatorHref = buildCreatorRoute(Creator);
  const resolvedNoticeHref = buildNoticeRoute(Slug);
  const mediaProbeRef = useAdaptiveSkeletonProbe<HTMLDivElement>({
    cacheKey: Category
      ? SKELETON_RATIO_KEYS.cardMediaWithCategory
      : SKELETON_RATIO_KEYS.cardMediaDefault,
    enabled: Boolean(ImgUrl),
  });

  return (
    <div className="flex flex-col items-start justify-center gap-4">
      <Link href={resolvedNoticeHref} className="w-full">
        {ImgUrl ? (
          <div
            ref={mediaProbeRef}
            className={`w-full ${Category ? "h-36 sm:h-48 md:h-56 lg:h-64 xl:h-72" : "h-30 sm:h-40 md:h-60 lg:h-50 xl:h-50"} bg-cover bg-no-repeat bg-center rounded-11xl`}
            style={{ backgroundImage: `url(${ImgUrl})` }}
          />
        ) : (
          <div className="w-full hidden" aria-hidden />
        )}
      </Link>
      <div
        className={`w-full text-center lg:text-left ${Category ? "lg:max-w-none" : "lg:max-w-85"} flex flex-col lg:items-start items-center justify-center gap-3`}
      >
        {Category && (
          <div className="flex flex-row items-center justify-center">
            <p className="px-3 py-1 mr-2 bg-primary-blue rounded-full text-[clamp(0.7rem,0.6vw,0.8rem)] font-semibold! text-white uppercase">
              {Category}
            </p>
          </div>
        )}
        <Link href={resolvedNoticeHref} className="flex flex-col gap-3">
          <h1
            className={`${Description ? "line-clamp-1" : "line-clamp-2"} text-[clamp(1rem,1vw,1.5rem)] hover:text-primary-blue cursor-pointer transition-all duration-300`}
          >
            {Title}
          </h1>
          {Description && !Category ? (
            <p className="line-clamp-3 dark:text-gray-400 text-[clamp(0.8rem,0.7vw,0.9rem)]">
              {Description}
            </p>
          ) : (
            <p className="hidden" aria-hidden />
          )}
        </Link>
        <div
          className={`flex flex-wrap ${Category ? "flex-row-reverse" : "flex-row"} items-center justify-center lg:justify-start gap-2`}
        >
          <div className="flex items-center justify-center">
            <span className="mr-1 text-gray-400 text-[clamp(0.7rem,0.6vw,0.8rem)] font-medium!">
              {t("by")}
            </span>
            <Link href={resolvedCreatorHref}>
              <p className="text-[clamp(0.7rem,0.6vw,0.8rem)] font-semibold! hover:text-gray-500 transition-colors duration-500 uppercase">
                {Creator}
              </p>
            </Link>
          </div>
          {!Category && <Comments commentCount={CommentsCount ?? 0} />}
          {Category && <DateDisplay date={CreatedAt || ""} variant="gray" />}
        </div>
      </div>
    </div>
  );
};

export default Card;
