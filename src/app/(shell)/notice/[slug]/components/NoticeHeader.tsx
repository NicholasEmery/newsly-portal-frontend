"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { MdOutlineComment } from "react-icons/md";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaLink,
  FaEnvelope,
  FaXTwitter,
} from "react-icons/fa6";
import DateDisplay from "@/app/components/server/display/DateDisplay";

type NoticeHeaderProps = {
  category: string;
  title: string;
  description: string;
  createdAt: string;
  commentsCount: number;
};

type ShareChannel = "facebook" | "x" | "linkedin" | "email";

const shareChannels: Array<{
  key: ShareChannel;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: "facebook", icon: FaFacebookF },
  { key: "x", icon: FaXTwitter },
  { key: "linkedin", icon: FaLinkedinIn },
  { key: "email", icon: FaEnvelope },
];

const buildShareUrl = (channel: ShareChannel, url: string, title: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (channel) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "x":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "email":
      return `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
    default:
      return url;
  }
};

export default function NoticeHeader({
  category,
  title,
  description,
  createdAt,
  commentsCount,
}: NoticeHeaderProps) {
  const t = useTranslations("noticePage");

  const handleShare = useCallback(
    async (channel: ShareChannel) => {
      if (typeof window === "undefined") return;

      const pageUrl = window.location.href;
      const pageTitle = title;

      if (channel === "email") {
        window.location.href = buildShareUrl(channel, pageUrl, pageTitle);
        return;
      }

      const nativeShare =
        channel === "x" && typeof navigator !== "undefined"
          ? navigator.share
          : null;

      if (nativeShare) {
        try {
          await nativeShare.call(navigator, {
            title: pageTitle,
            text: pageTitle,
            url: pageUrl,
          });
          return;
        } catch {
          // fallback abaixo
        }
      }

      window.open(
        buildShareUrl(channel, pageUrl, pageTitle),
        "_blank",
        "noopener,noreferrer",
      );
    },
    [title],
  );

  const handleCopyLink = useCallback(async () => {
    if (typeof window === "undefined") return;
    const pageUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(pageUrl);
    } catch {
      window.prompt(t("copyFallback"), pageUrl);
    }
  }, [t]);

  return (
    <header className="w-full">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-start">
          <span className="inline-flex rounded-full bg-primary-blue/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary-blue dark:bg-primary-blue/20 dark:text-blue-200">
            {category}
          </span>
        </div>

        <div>
          <h1 className="text-[clamp(2.75rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-slate-950 dark:text-slate-50">
            {title}
          </h1>
        </div>

        <div className="max-w-3xl">
          <p className="mt-4 text-[clamp(1.05rem,1.2vw,1.25rem)] leading-8 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <DateDisplay date={createdAt} variant="gray" />
            </div>

            <a
              href="#comments"
              className="inline-flex items-center gap-2 rounded-full text-sm font-medium text-slate-500 transition-colors hover:text-primary-blue dark:text-slate-300 dark:hover:text-blue-200"
            >
              <MdOutlineComment className="text-lg" />
              <span>
                {commentsCount} {t("comments")}
              </span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            {shareChannels.map(({ key, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleShare(key)}
                aria-label={t(`shareChannels.${key}`)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-blue hover:text-primary-blue dark:border-gray-500/30 dark:bg-white/5 dark:text-slate-200 dark:hover:border-primary-blue dark:hover:text-blue-200"
              >
                <Icon className="text-[0.95rem]" aria-hidden />
              </button>
            ))}

            <button
              type="button"
              onClick={handleCopyLink}
              aria-label={t("copyLink")}
              className="flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-primary-blue hover:text-primary-blue dark:border-gray-500/30 dark:bg-white/5 dark:text-slate-200 dark:hover:border-primary-blue dark:hover:text-blue-200"
            >
              <FaLink className="text-[0.9rem]" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
