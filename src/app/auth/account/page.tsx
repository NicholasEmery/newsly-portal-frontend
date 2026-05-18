"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AuthLoginClientSchema,
  AuthSignupClientSchema,
} from "@/api/schemas/auth";
import { BackgroundGradients } from "./components/BackgroundGradients";
import { AuthContainer } from "./components/AuthContainer";

type AuthMode = "login" | "signup";
type AuthFormData = {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
};
type SubmitStatusType = "success" | "error" | null;

function getDefaultValues(isLogin: boolean): AuthFormData {
  return {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    ...(isLogin ? {} : {}),
  };
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [validationPulse, setValidationPulse] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: SubmitStatusType;
    message: string;
  }>({ type: null, message: "" });

  const isLogin = mode === "login";

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "login" || modeParam === "signup") {
      setMode(modeParam);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<AuthFormData>({
    resolver: (values, context, options) =>
      zodResolver(isLogin ? AuthLoginClientSchema : AuthSignupClientSchema)(
        values,
        context,
        options,
      ),
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: getDefaultValues(isLogin),
  });

  useEffect(() => {
    reset(getDefaultValues(isLogin));
    setSubmitStatus({ type: null, message: "" });
    setIsPasswordVisible(false);
    setIsConfirmPasswordVisible(false);
  }, [isLogin, reset]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsModalVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  async function onSubmit(): Promise<void> {
    setSubmitStatus({ type: null, message: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 450));

      if (isLogin) {
        router.push("/");
        return;
      }

      setSubmitStatus({
        type: "success",
        message: "Cadastro realizado com sucesso!",
      });

      reset(getDefaultValues(isLogin));
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Erro ao processar requisição",
      });
    }
  }

  function onInvalidSubmit() {
    setValidationPulse(true);
    setTimeout(() => setValidationPulse(false), 380);
  }

  const emailValue = watch("email") || "";
  const passwordValue = watch("password") || "";
  const fullNameValue = watch("fullName") || "";
  const confirmPasswordValue = watch("confirmPassword") || "";
  const acceptTermsValue = !!watch("acceptTerms");

  const isSubmitEnabled = isLogin
    ? !!emailValue.trim() && !!passwordValue.trim()
    : !!fullNameValue.trim() &&
      !!emailValue.trim() &&
      !!passwordValue.trim() &&
      !!confirmPasswordValue.trim() &&
      acceptTermsValue;

  return (
    <main className="relative flex min-h-[calc(100dvh-2rem)] items-start justify-center overflow-y-auto overflow-x-hidden bg-blue-50 px-4 py-3 sm:px-6 lg:h-[calc(100dvh-2rem)] lg:items-center lg:overflow-hidden lg:px-10 dark:bg-slate-950">
      <BackgroundGradients />

      <AuthContainer
        mode={mode}
        onModeChange={setMode}
        register={register}
        watch={watch}
        errors={errors}
        isSubmitting={isSubmitting}
        submitCount={submitCount}
        submitStatus={submitStatus}
        isPasswordVisible={isPasswordVisible}
        isConfirmPasswordVisible={isConfirmPasswordVisible}
        validationPulse={validationPulse}
        isModalVisible={isModalVisible}
        onTogglePasswordVisibility={() => setIsPasswordVisible((prev) => !prev)}
        onToggleConfirmPasswordVisibility={() =>
          setIsConfirmPasswordVisible((prev) => !prev)
        }
        onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
        onInvalidSubmit={onInvalidSubmit}
        isSubmitEnabled={isSubmitEnabled}
      />
    </main>
  );
}
