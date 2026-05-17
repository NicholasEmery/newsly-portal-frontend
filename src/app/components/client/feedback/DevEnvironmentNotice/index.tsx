"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type DevEnvironmentNoticeProps = {
  isDevEnvironment: boolean;
  dataSource: string;
};

const DEV_NOTICE_EVENT = "newsly:dev-notice-height";
const DEV_NOTICE_CSS_VAR = "--newsly-dev-notice-height";

export default function DevEnvironmentNotice({
  isDevEnvironment,
  dataSource,
}: DevEnvironmentNoticeProps) {
  const noticeRef = useRef<HTMLDivElement | null>(null);
  const [noticeHeight, setNoticeHeight] = useState(0);
  const t = useTranslations("devNotice");

  useEffect(() => {
    if (!isDevEnvironment) {
      document.documentElement.style.setProperty(DEV_NOTICE_CSS_VAR, "0px");
      setNoticeHeight(0);
      return;
    }

    const syncHeight = () => {
      const nextHeight = noticeRef.current?.offsetHeight ?? 0;
      setNoticeHeight(nextHeight);
      document.documentElement.style.setProperty(
        DEV_NOTICE_CSS_VAR,
        `${nextHeight}px`,
      );
      window.dispatchEvent(
        new CustomEvent<number>(DEV_NOTICE_EVENT, {
          detail: nextHeight,
        }),
      );
    };

    syncHeight();

    const resizeObserver = new ResizeObserver(() => syncHeight());
    if (noticeRef.current) {
      resizeObserver.observe(noticeRef.current);
    }

    window.addEventListener("resize", syncHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncHeight);
      document.documentElement.style.setProperty(DEV_NOTICE_CSS_VAR, "0px");
      window.dispatchEvent(
        new CustomEvent<number>(DEV_NOTICE_EVENT, {
          detail: 0,
        }),
      );
    };
  }, [isDevEnvironment]);

  if (!isDevEnvironment) {
    return null;
  }

  return (
    <div className="relative w-full" style={{ height: `${noticeHeight}px` }}>
      <div
        ref={noticeRef}
        className="fixed inset-x-0 top-0 z-60 border-b border-amber-300 bg-amber-100 px-3 py-1 text-amber-900 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-100"
      >
        <p className="text-center text-xs font-medium leading-relaxed sm:text-sm">
          {t("banner", { dataSource })}
        </p>
      </div>
    </div>
  );
}
