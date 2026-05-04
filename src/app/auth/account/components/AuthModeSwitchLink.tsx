import { useTranslations } from "next-intl";

type AuthMode = "login" | "signup";

interface AuthModeSwitchLinkProps {
  currentMode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function AuthModeSwitchLink({
  currentMode,
  onModeChange,
}: AuthModeSwitchLinkProps) {
  const t = useTranslations("auth");
  const isLogin = currentMode === "login";

  return (
    <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
      {isLogin ? t("switch.noAccount") : t("switch.hasAccount")}{" "}
      <button
        type="button"
        onClick={() => onModeChange(isLogin ? "signup" : "login")}
        className="font-semibold text-primary-blue underline underline-offset-2 dark:text-blue-300"
      >
        {isLogin ? t("tabs.signup") : t("tabs.login")}
      </button>
    </p>
  );
}
