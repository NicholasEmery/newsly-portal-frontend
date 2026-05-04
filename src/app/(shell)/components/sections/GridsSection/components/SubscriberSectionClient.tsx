"use client";

import { HiOutlineLockClosed } from "react-icons/hi";
import Comments from "@/app/components/server/display/Comments";
import Link from "next/link";
import DateDisplay from "@/app/components/server/display/DateDisplay";
import { useTranslations } from "next-intl";
import {
  SKELETON_RATIO_KEYS,
  useAdaptiveSkeletonProbe,
} from "@/app/hooks/useAdaptiveSkeletonMeasurement";
import { buildNoticeRoute } from "@/utils/userRoute";

interface SubscriberSectionClientProps {
  Category: string;
  Title: string;
  ImageUrl: string;
  CreatedAt: string;
  CountComments: number;
  Slug: string;
}

const SubscriberSectionClient = ({
  Category,
  Title,
  ImageUrl,
  CreatedAt = "-",
  CountComments,
  Slug,
}: SubscriberSectionClientProps) => {
  const t = useTranslations("sections");
  const resolvedNoticeHref = buildNoticeRoute(Slug);
  const subscriberProbeRef = useAdaptiveSkeletonProbe<HTMLElement>({
    cacheKey: SKELETON_RATIO_KEYS.subscriberHighlightMedia,
    enabled: Boolean(ImageUrl),
  });

  return (
    <Link href={resolvedNoticeHref}>
      <section
        ref={subscriberProbeRef}
        className="group relative left-1/2 -translate-x-1/2 overflow-hidden cursor-pointer flex flex-col justify-end items-center w-[calc(100vw-80px)] max-w-[calc(100vw-80px)] h-150 py-10 text-white rounded-11xl shadow-inset-[inset_0_0_0_9999px_rgba(0,0,0,0.25)]"
      >
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-center transition-transform duration-800 ease-out will-change-transform group-hover:scale-105"
          style={{
            backgroundImage: `url(${ImageUrl})`,
          }}
        />
        <div className="absolute inset-0 bg-black/25" />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/45 via-black/15 to-transparent backdrop-blur-sm"
          style={{
            WebkitMaskImage:
              "linear-gradient(to top, black 20%, transparent 100%)",
            maskImage: "linear-gradient(to top, black 20%, transparent 100%)",
          }}
        />
        <div className="mx-10 relative z-10 flex flex-col justify-center items-center gap-5">
          <div className="flex flex-row items-center justify-center gap-2">
            <p className="px-3 py-1 mr-2 bg-primary-blue rounded-full text-[clamp(0.7rem,0.6vw,0.8rem)] font-semibold! uppercase">
              {Category}
            </p>
            <div className="flex items-center justify-center gap-1">
              <HiOutlineLockClosed className="text-[clamp(0.9rem,1vw,1.1rem)] font-medium!" />
              <p className="text-[clamp(0.7rem,0.6vw,0.8rem)] font-medium! uppercase">
                {t("forSubscribers")}
              </p>
            </div>
          </div>
          <h1 className="cursor-pointer font-bold text-center text-[clamp(1.5rem,2.3vw,3.1rem)] hover:text-primary-blue transition-colors duration-400 border-b border-gray-200/50 p-2">
            {Title}
          </h1>
          <div className="flex flex-row justify-center items-center gap-2">
            <DateDisplay date={CreatedAt} variant="white" />
            <Comments commentCount={CountComments} />
          </div>
        </div>
      </section>
    </Link>
  );
};

export default SubscriberSectionClient;