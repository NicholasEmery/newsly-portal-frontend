import { useTranslations } from "next-intl";

export function ForgotPasswordLink() {
  const t = useTranslations("auth");

  return (
    <div className="pt-0.5 text-right">
      <button
        type="button"
        className="text-xs font-semibold text-primary-blue hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
      >
        {t("login.forgotPassword")}
      </button>
    </div>
  );
}
