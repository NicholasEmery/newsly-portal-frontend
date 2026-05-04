import { useTranslations } from "next-intl";

export function MobileOnboarding() {
  const t = useTranslations("auth");

  return (
    <section className="mt-4 rounded-2xl border border-primary-blue/15 bg-primary-blue/6 p-4 text-slate-700 lg:hidden dark:border-primary-blue/30 dark:bg-primary-blue/15 dark:text-slate-200">
      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary-blue/80 dark:text-blue-300">
        {t("onboarding.kicker")}
      </p>
      <h2 className="mt-1.5 text-lg font-semibold leading-tight text-slate-900 dark:text-slate-50">
        {t("onboarding.title")}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {t("onboarding.description")}
      </p>
      <ul className="mt-3 space-y-1.5 text-[11px] leading-snug text-slate-600 dark:text-slate-300">
        <li>• {t("onboarding.highlightOne")}</li>
        <li>• {t("onboarding.highlightTwo")}</li>
        <li>• {t("onboarding.highlightThree")}</li>
      </ul>
    </section>
  );
}
