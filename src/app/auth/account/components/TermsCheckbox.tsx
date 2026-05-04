import { FieldError } from "react-hook-form";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";

interface TermsCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
}

function getFieldErrorMessage(message: string | undefined, t: any): string | undefined {
  if (!message) return undefined;
  return t(message);
}

export const TermsCheckbox = forwardRef<HTMLInputElement, TermsCheckboxProps>(
  ({ error, ...props }, ref) => {
    const t = useTranslations("auth");

    return (
      <div>
        <label className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
          <input
            ref={ref}
            type="checkbox"
            className="accent-primary-blue"
            aria-invalid={error ? "true" : "false"}
            {...props}
          />
          <span
            className={`text-[clamp(0.7rem,0.7vw,0.9rem)] ${
              error ? "text-red-500" : "text-slate-700 dark:text-slate-300"
            }`}
          >
            {t("signup.terms.acceptTermsLabel")}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-75 transition-opacity mx-1"
            >
              {t("signup.terms.termsOfUse")}
            </a>
            {t("signup.terms.and")}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-75 transition-opacity mx-1"
            >
              {t("signup.terms.privacyPolicy")}
            </a>
          </span>
        </label>
        {error?.message && (
          <p className="mt-2 text-xs text-red-500">
            {getFieldErrorMessage(error.message, t)}
          </p>
        )}
      </div>
    );
  }
);

TermsCheckbox.displayName = "TermsCheckbox";
