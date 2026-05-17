"use client";

import Image from "next/image";
import { HiOutlineLockClosed } from "react-icons/hi";
import Comments from "@/app/components/server/display/Comments";
import Link from "next/link";
import { buildCreatorRoute, buildNoticeRoute } from "@/utils/userRoute";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  SKELETON_RATIO_KEYS,
  useAdaptiveSkeletonProbe,
} from "@/app/hooks/useAdaptiveSkeletonMeasurement";

interface SubscriberBannerProps {
  Category: string;
  Title: string;
  Description: string;
  ImageUrl: string;
  Creator: string;
  CountComments: number;
  Slug: string;
}

const SubscriberBanner = ({
  Category,
  Title,
  Description,
  ImageUrl,
  Creator,
  CountComments,
  Slug,
}: SubscriberBannerProps) => {
  const router = useRouter();
  const t = useTranslations("sections");
  const resolvedCretorHref = buildCreatorRoute(Creator);
  const resolvedNoticeHref = buildNoticeRoute(Slug);
  const bannerMediaProbeRef = useAdaptiveSkeletonProbe<HTMLDivElement>({
    cacheKey: SKELETON_RATIO_KEYS.subscriberBannerMedia,
    enabled: Boolean(ImageUrl),
  });

  const goToArticle = () => {
    if (!Slug?.trim()) return;
    router.push(resolvedNoticeHref);
  };

  return (
    <section
      className="w-full flex flex-col-reverse xl:flex-row items-stretch justify-stretch bg-white rounded-11xl dark:bg-gray-800 cursor-pointer group hover:scale-105 transition-all duration-500 ease-in-out"
      onClick={goToArticle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToArticle();
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className="w-full xl:w-1/2 py-15 px-10 lg:py-20 lg:px-15 flex flex-col items-start justify-center gap-5">
        <div className="flex flex-row items-center justify-center gap-2">
          <p className="px-3 py-1 mr-2 bg-primary-blue rounded-full text-[clamp(0.7rem,0.6vw,0.8rem)] font-semibold! text-white uppercase">
            {Category}
          </p>
          <div className="flex items-center justify-center gap-1">
            <HiOutlineLockClosed className="text-[clamp(0.9rem,1vw,1.1rem)] font-medium!" />
            <p className="text-[clamp(0.6rem,0.6vw,0.8rem)] font-semibold! uppercase">
              {t("forSubscribers")}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="font-normal leading-tight text-[clamp(1.5rem,2vw,3rem)] group-hover:text-primary-blue transition-colors duration-400">
            {Title}
          </h1>
          <p className="font-normal text-[clamp(0.8rem,0.7vw,0.9rem)] text-gray-600 dark:text-gray-400 overflow-hidden line-clamp-4">
            {Description}
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link
            href={resolvedCretorHref}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/images/Nicholas-Emery.png"
                width={100}
                height={100}
                alt=""
                className="w-13 rounded-full border-3 border-primary-blue"
              />
              <p className="uppercase font-semibold! text-[clamp(0.7rem,0.6vw,0.8rem)] hover:text-gray-500 transition-colors duration-500">
                {Creator}
              </p>
            </div>
          </Link>
          <Comments commentCount={CountComments} />
        </div>
      </div>
      <div
        ref={bannerMediaProbeRef}
        data-cy="subscriber-banner-media"
        className="w-full xl:w-1/2 min-h-80 xl:min-h-0 rounded-t-11xl xl:rounded-tl-none xl:rounded-r-11xl bg-cover bg-no-repeat bg-center"
        style={{ backgroundImage: `url(${ImageUrl})` }}
      />
    </section>
  );
};

export default SubscriberBanner;
