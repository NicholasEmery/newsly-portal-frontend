"use client";

import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { TitleSection } from "./TitleSection";
import { AuthModeTabs } from "./AuthModeTabs";
import { AuthForm } from "./AuthForm";
import { AuthModeSwitchLink } from "./AuthModeSwitchLink";
import { MobileOnboarding } from "./MobileOnboarding";
import { AuthHeader } from "./AuthHeader";
import { useTranslations } from "next-intl";

type AuthMode = "login" | "signup";
type AuthFormData = {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
};
type SubmitStatusType = "success" | "error" | null;

interface AuthContentProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  register: UseFormRegister<AuthFormData>;
  watch: UseFormWatch<AuthFormData>;
  errors: FieldErrors<AuthFormData>;
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

export function AuthContent({
  mode,
  onModeChange,
  register,
  watch,
  errors,
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
}: AuthContentProps) {
  const t = useTranslations("auth");
  const isLogin = mode === "login";

  return (
    <>
      <AuthHeader />

      <TitleSection
        title={isLogin ? t("login.title") : t("signup.title")}
        subtitle={isLogin ? t("login.subtitle") : t("signup.subtitle")}
      />

      <AuthModeTabs mode={mode} onModeChange={onModeChange} />

      <AuthForm
        mode={mode}
        register={register}
        watch={watch}
        errors={errors}
        isSubmitting={isSubmitting}
        submitCount={submitCount}
        submitStatus={submitStatus}
        isPasswordVisible={isPasswordVisible}
        isConfirmPasswordVisible={isConfirmPasswordVisible}
        validationPulse={validationPulse}
        onTogglePasswordVisibility={onTogglePasswordVisibility}
        onToggleConfirmPasswordVisibility={onToggleConfirmPasswordVisibility}
        onSubmit={onSubmit}
        onInvalidSubmit={onInvalidSubmit}
        isSubmitEnabled={isSubmitEnabled}
      />

      <AuthModeSwitchLink currentMode={mode} onModeChange={onModeChange} />

      <MobileOnboarding />
    </>
  );
}
