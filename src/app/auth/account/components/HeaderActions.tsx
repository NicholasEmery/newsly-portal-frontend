import Link from "next/link";
import { FiHome } from "react-icons/fi";
import { useTranslations } from "next-intl";
import LanguageSelector from "@/app/components/client/ui/LanguageSelector";
import ThemeModeBtn from "@/app/components/client/ui/ThemeModeBtn";

export function HeaderActions() {
  const t = useTranslations("auth");

  return (
    <div className="flex items-center gap-2 rounded-full border border-primary-blue/25 bg-primary-blue/20 px-2 py-1 shadow-sm dark:border-white/20 dark:bg-white/10">
      <ThemeModeBtn />
      <LanguageSelector />
      <Link
        href="/"
        aria-label={t("actions.backToHome")}
        title={t("actions.backToHome")}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-blue/30 bg-white/90 text-primary-blue transition-colors hover:bg-primary-blue hover:text-white dark:border-white/20 dark:bg-slate-800 dark:text-blue-200 dark:hover:bg-primary-blue dark:hover:text-white"
      >
        <FiHome className="h-4 w-4" />
      </Link>
    </div>
  );
}
