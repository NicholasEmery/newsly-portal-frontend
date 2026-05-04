import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";

export function GoogleButton() {
  const t = useTranslations("auth");

  return (
    <button
      type="button"
      className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-primary-blue/20 bg-white text-sm font-medium text-slate-800 transition-colors hover:bg-primary-blue/6 dark:border-primary-blue/30 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-primary-blue/20"
    >
      <FcGoogle className="h-5 w-5" />
      <span>{t("actions.google")}</span>
    </button>
  );
}
