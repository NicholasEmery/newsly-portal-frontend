import { useTranslations } from "next-intl";

type AuthMode = "login" | "signup";

interface AuthModeTabsProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function AuthModeTabs({ mode, onModeChange }: AuthModeTabsProps) {
  const t = useTranslations("auth");
  const isLogin = mode === "login";

  return (
    <div className="relative mt-5 grid grid-cols-2 rounded-full border border-primary-blue/20 bg-primary-blue/6 p-1 dark:border-primary-blue/30 dark:bg-primary-blue/15">
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-primary-blue ml-1 shadow-[0_8px_20px_-12px_rgba(70,83,246,0.9)] transition-transform duration-350 ease-out ${
          isLogin ? "translate-x-0" : "translate-x-full"
        }`}
      />
      <button
        type="button"
        onClick={() => onModeChange("login")}
        className={`relative z-10 rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
          isLogin
            ? "text-white"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
        }`}
        aria-pressed={isLogin}
      >
        {t("tabs.login")}
      </button>
      <button
        type="button"
        onClick={() => onModeChange("signup")}
        className={`relative z-10 rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 ${
          !isLogin
            ? "text-white"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
        }`}
        aria-pressed={!isLogin}
      >
        {t("tabs.signup")}
      </button>
    </div>
  );
}
