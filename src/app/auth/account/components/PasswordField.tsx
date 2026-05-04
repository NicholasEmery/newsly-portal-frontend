import { FieldError } from "react-hook-form";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";
import PasswordEyeToggle from "@/app/components/client/ui/PasswordEyeToggle";

interface PasswordFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  placeholder: string;
  error?: FieldError;
  visible: boolean;
  onToggleVisibility: () => void;
}

function getFieldErrorMessage(message: string | undefined, t: any): string | undefined {
  if (!message) return undefined;
  return t(message);
}

const inputBaseClass =
  "h-10 w-full rounded-full border bg-white px-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-primary-blue dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-blue-400";

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      id,
      label,
      placeholder,
      error,
      visible,
      onToggleVisibility,
      ...props
    },
    ref
  ) => {
    const t = useTranslations("auth");

    return (
      <div>
        <label
          htmlFor={id}
          className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
        <div className="relative w-full">
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            placeholder={placeholder}
            aria-invalid={error ? "true" : "false"}
            className={`${inputBaseClass} pr-12 ${
              error
                ? "border-red-400 placeholder:text-red-400"
                : "border-primary-blue/20 dark:border-primary-blue/30"
            }`}
            {...props}
          />
          <PasswordEyeToggle
            visible={visible}
            onToggle={onToggleVisibility}
            disabled={props.disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          />
        </div>
        {error?.message && (
          <p className="mt-2 text-xs text-red-500">
            {getFieldErrorMessage(error.message, t)}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";
