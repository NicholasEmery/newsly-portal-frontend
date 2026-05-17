import { useTranslations } from "next-intl";
import Image from "next/image";

export function DesktopOnboarding() {
  const t = useTranslations("auth");

  return (
    <aside className="relative hidden w-[46%] overflow-hidden bg-primary-blue p-8 text-white lg:flex lg:flex-col lg:justify-between dark:bg-[#2d3ad1]">
      <div className="pointer-events-none absolute -top-14 -left-12 h-44 w-44 rounded-full bg-white/20 blur-3xl dark:bg-white/15" />
      <div className="pointer-events-none absolute -right-20 bottom-14 h-52 w-52 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-200/20" />

      <div className="relative z-10">
        <Image src="/images/logo-header.png" alt="Logo Badge" width={200} height={200} className="w-50" />
        <h2 className="mt-3 max-w-sm text-[1.9rem] leading-tight text-white">
          {t("onboarding.title")}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-blue-50/90">
          {t("onboarding.description")}
        </p>
      </div>

      <div className="relative z-10 space-y-3 rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
        <p className="text-sm font-semibold text-white">
          {t("onboarding.highlightsTitle")}
        </p>
        <ul className="space-y-2 text-sm text-blue-50/90">
          <li>{t("onboarding.highlightOne")}</li>
          <li>{t("onboarding.highlightTwo")}</li>
          <li>{t("onboarding.highlightThree")}</li>
        </ul>
      </div>
    </aside>
  );
}
