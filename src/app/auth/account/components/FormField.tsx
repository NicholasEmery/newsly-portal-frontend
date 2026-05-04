import { FieldError } from "react-hook-form";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";

interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  placeholder: string;
  error?: FieldError;
}

function getFieldErrorMessage(message: string | undefined, t: any): string | undefined {
  if (!message) return undefined;
  return t(message);
}

const inputBaseClass =
  "h-10 w-full rounded-full border bg-white px-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary-blue dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-blue-400";

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, placeholder, error, type = "text", ...props }, ref) => {
    const t = useTranslations("auth");

    return (
      <div>
        <label
          htmlFor={id}
          className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          className={`${inputBaseClass} ${
            error
              ? "border-red-400 placeholder:text-red-400"
              : "border-primary-blue/20 dark:border-primary-blue/30"
          }`}
          {...props}
        />
        {error?.message && (
          <p className="mt-2 text-xs text-red-500">
            {getFieldErrorMessage(error.message, t)}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
