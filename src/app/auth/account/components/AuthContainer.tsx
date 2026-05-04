"use client";

import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { AuthContent } from "./AuthContent";
import { DesktopOnboarding } from "./DesktopOnboarding";

type AuthMode = "login" | "signup";
type AuthFormData = {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
};
type SubmitStatusType = "success" | "error" | null;

interface AuthContainerProps {
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
  isModalVisible: boolean;
  onTogglePasswordVisibility: () => void;
  onToggleConfirmPasswordVisibility: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInvalidSubmit: () => void;
  isSubmitEnabled: boolean;
}

export function AuthContainer({
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
  isModalVisible,
  onTogglePasswordVisibility,
  onToggleConfirmPasswordVisibility,
  onSubmit,
  onInvalidSubmit,
  isSubmitEnabled,
}: AuthContainerProps) {
  return (
    <section
      className={`mx-auto flex h-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-primary-blue/15 bg-white shadow-[0_30px_90px_-55px_rgba(70,83,246,0.45)] transition-all duration-700 ease-out lg:h-full lg:max-h-full xl:h-176 xl:max-h-176 dark:border-primary-blue/30 dark:bg-slate-900 dark:shadow-[0_30px_90px_-55px_rgba(0,0,0,0.75)] ${
        isModalVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      }`}
    >
      <div className="scrollbar-hide flex w-full min-h-0 flex-col justify-start overflow-hidden border-b border-primary-blue/10 p-8 lg:w-[54%] lg:justify-center lg:border-b-0 lg:border-r lg:overflow-y-auto dark:border-primary-blue/20">
        <AuthContent
          mode={mode}
          onModeChange={onModeChange}
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
      </div>

      <DesktopOnboarding />
    </section>
  );
}
