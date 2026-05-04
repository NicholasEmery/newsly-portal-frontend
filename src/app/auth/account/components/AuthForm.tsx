"use client";

import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";
import { ForgotPasswordLink } from "./ForgotPasswordLink";
import { TermsCheckbox } from "./TermsCheckbox";
import { SubmitButton } from "./SubmitButton";
import { SubmitStatus } from "./SubmitStatus";
import { GoogleDivider } from "./GoogleDivider";
import { GoogleButton } from "./GoogleButton";

type AuthMode = "login" | "signup";
type AuthFormData = {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
};
type SubmitStatusType = "success" | "error" | null;

interface AuthFormProps {
  mode: AuthMode;
  register: UseFormRegister<AuthFormData>;
  errors: FieldErrors<AuthFormData>;
  watch: UseFormWatch<AuthFormData>;
  isSubmitting: boolean;
  submitCount: number;
  submitStatus: {
    type: SubmitStatusType;
    message: string;
  };
  isPasswordVisible: boolean;
  isConfirmPasswordVisible: boolean;
  validationPulse: boolean;
  onTogglePasswordVisibility: () => void;
  onToggleConfirmPasswordVisibility: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInvalidSubmit: () => void;
  isSubmitEnabled: boolean;
}

export function AuthForm({
  mode,
  register,
  errors,
  watch,
  isSubmitting,
  submitCount,
  submitStatus,
  isPasswordVisible,
  isConfirmPasswordVisible,
  validationPulse,
  onTogglePasswordVisibility,
  onToggleConfirmPasswordVisibility,
  onSubmit,
  onInvalidSubmit,
  isSubmitEnabled,
}: AuthFormProps) {
  const t = useTranslations("auth");
  const isLogin = mode === "login";
  const hasFieldErrors = Object.keys(errors).length > 0 && submitCount > 0;

  return (
    <form
      className="mt-5 space-y-2.5"
      onSubmit={(e) => {
        e.preventDefault();
        if (isSubmitEnabled) {
          onSubmit(e);
        } else {
          onInvalidSubmit();
        }
      }}
    >
      <div
        className={`${
          isLogin ? "flex flex-col gap-4" : "grid lg:grid-cols-2 gap-4"
        }`}
      >
        {!isLogin && (
          <FormField
            id="fullName"
            label={t("fields.fullName")}
            placeholder={t("placeholders.fullName")}
            error={errors.fullName}
            disabled={isSubmitting}
            {...register("fullName")}
          />
        )}

        <FormField
          id="email"
          label={t("fields.email")}
          placeholder={t("placeholders.email")}
          error={errors.email}
          disabled={isSubmitting}
          {...register("email")}
        />

        <PasswordField
          id="password"
          label={t("fields.password")}
          placeholder={t("placeholders.password")}
          error={errors.password}
          disabled={isSubmitting}
          visible={isPasswordVisible}
          onToggleVisibility={onTogglePasswordVisibility}
          {...register("password")}
        />

        {!isLogin && (
          <PasswordField
            id="confirmPassword"
            label={t("fields.confirmPassword")}
            placeholder={t("placeholders.confirmPassword")}
            error={errors.confirmPassword}
            disabled={isSubmitting}
            visible={isConfirmPasswordVisible}
            onToggleVisibility={onToggleConfirmPasswordVisibility}
            {...register("confirmPassword")}
          />
        )}
      </div>

      {isLogin ? (
        <ForgotPasswordLink />
      ) : (
        <TermsCheckbox
          error={errors.acceptTerms}
          disabled={isSubmitting}
          {...register("acceptTerms")}
        />
      )}

      <SubmitButton
        disabled={isSubmitting || !isSubmitEnabled}
        isSubmitting={isSubmitting}
        isLogin={isLogin}
        hasFieldErrors={hasFieldErrors}
        validationPulse={validationPulse}
      />

      <SubmitStatus type={submitStatus.type} message={submitStatus.message} />

      <GoogleDivider />
      <GoogleButton />
    </form>
  );
}
