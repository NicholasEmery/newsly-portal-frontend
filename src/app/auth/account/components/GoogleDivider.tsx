import { useTranslations } from "next-intl";

export function GoogleDivider() {
  const t = useTranslations("auth");

  return (
    <div className="flex items-center gap-4 pt-1">
      <span className="h-px flex-1 bg-primary-blue/15 dark:bg-primary-blue/30" />
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {t("actions.orContinue")}
      </span>
      <span className="h-px flex-1 bg-primary-blue/15 dark:bg-primary-blue/30" />
    </div>
  );
}
