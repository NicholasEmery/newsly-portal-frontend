"use client";

import Link from "next/link";
import { buildCreatorRoute, buildNoticeRoute } from "@/utils/userRoute";
import { useTranslations } from "next-intl";
import ProfileAvatar from "@/app/components/client/media/ProfileAvatar";
import {
  SKELETON_RATIO_KEYS,
  useAdaptiveSkeletonProbe,
} from "@/app/hooks/useAdaptiveSkeletonMeasurement";

interface CardSimplifiedProps {
  Title: string;
  Creator: string;
  Slug: string;
  ImgUrl?: string;
  ImgUrlCreator?: string;
}

function CardSimplified({
  Title,
  Creator,
  Slug,
  ImgUrl,
  ImgUrlCreator,
}: CardSimplifiedProps) {
  const t = useTranslations("cards");
  const resolvedCreatorHref = buildCreatorRoute(Creator);
  const resolvedNoticeHref = buildNoticeRoute(Slug);
  const trendingMediaProbeRef = useAdaptiveSkeletonProbe<HTMLDivElement>({
    cacheKey: SKELETON_RATIO_KEYS.trendingCardMedia,
    enabled: Boolean(ImgUrl),
  });
  const isCreatorAvatarCard = ImgUrlCreator !== undefined;

  return (
    <div
      className={`flex ${isCreatorAvatarCard ? "xs:flex-col-reverse xl:flex-row justify-evenly" : "flex-col-reverse lg:flex-row justify-between"} items-center`}
    >
      <div
        className={`flex flex-col ${isCreatorAvatarCard ? "justify-center" : "justify-start"} w-full xl:max-w-[60%] lg:max-w-[60%]`}
      >
        <Link href={resolvedNoticeHref}>
          <div className="flex justify-center gap-2 mb-2.5 cursor-pointer">
            <h1
              className={`text-[clamp(1rem,1vw,1.5rem)] text-center ${isCreatorAvatarCard ? "line-clamp-2 xl:text-left" : "line-clamp-2 md:text-left"} hover:text-primary-blue transition-colors duration-400`}
            >
              {Title}
            </h1>
          </div>
        </Link>
        <div
          className={`flex ${isCreatorAvatarCard ? "flex-col gap-0.5 xl:items-start" : "flex-row gap-1 md:justify-start"} justify-center items-center`}
        >
          <span className="text-gray-400 text-[clamp(0.7rem,0.6vw,0.8rem)] font-medium! text-left">
            {t("by")}
          </span>
          <Link href={resolvedCreatorHref}>
            <p className="text-[clamp(0.7rem,0.6vw,0.8rem)] font-semibold! hover:text-gray-500 transition-colors duration-500 uppercase cursor-pointer">
              {Creator}
            </p>
          </Link>
        </div>
      </div>
      <Link
        href={isCreatorAvatarCard ? resolvedCreatorHref : resolvedNoticeHref}
        className={ImgUrl ? "w-full lg:w-auto" : undefined}
      >
        {ImgUrl ? (
          <div
            ref={trendingMediaProbeRef}
            data-cy="trending-card-media"
            className="w-full h-30 mb-3 lg:w-23 lg:h-23 sm:h-35 flex items-center justify-center bg-cover bg-no-repeat bg-center rounded-xl cursor-pointer"
            style={{ backgroundImage: `url(${ImgUrl})` }}
          />
        ) : (
          <ProfileAvatar
            name={Creator}
            src={ImgUrlCreator}
            showBorder={true}
            size="w-full h-30 mb-3 lg:w-23 lg:h-23 sm:h-35"
          />
        )}
      </Link>
    </div>
  );
}

export default CardSimplified;
