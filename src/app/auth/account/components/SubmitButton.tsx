import { useTranslations } from "next-intl";

interface SubmitButtonProps {
  disabled?: boolean;
  isSubmitting?: boolean;
  isLogin: boolean;
  hasFieldErrors?: boolean;
  validationPulse?: boolean;
}

export function SubmitButton({
  disabled,
  isSubmitting,
  isLogin,
  hasFieldErrors,
  validationPulse,
}: SubmitButtonProps) {
  const t = useTranslations("auth");

  const buttonClass = hasFieldErrors
    ? "bg-red-500 text-white hover:bg-red-600 has-error-shake"
    : "bg-primary-blue text-white hover:bg-blue-700";

  return (
    <button
      type="submit"
      disabled={disabled}
      aria-label={isSubmitting ? t("actions.sending") : undefined}
      className={`mt-1.5 h-10 w-full rounded-full text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-45 ${buttonClass} ${
        validationPulse ? "has-error-shake" : ""
      }`}
    >
      {isSubmitting ? (
        <span className="inline-flex items-center justify-center">
          <span className="h-5 w-5 rounded-full border-2 border-white/35 border-t-white animate-spin" />
          <span className="sr-only">{t("actions.sending")}</span>
        </span>
      ) : isLogin ? (
        t("actions.login")
      ) : (
        t("actions.signup")
      )}
    </button>
  );
}
