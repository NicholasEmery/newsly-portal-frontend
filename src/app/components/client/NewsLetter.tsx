"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  NewsletterSubscribeClientSchema,
  NewsletterErrorResponseSchema,
  NewsletterSubscribeResponseSchema,
  type NewsletterSubscribeDto,
  type NewsletterSubscribeResponseDto,
} from "@/api/schemas/newsletter";
import { routes } from "@/api/routes";
import { z } from "zod";

type NewsletterFormData = z.infer<typeof NewsletterSubscribeClientSchema>;

class NewsletterRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "NewsletterRequestError";
    this.status = status;
  }
}

/**
 * Função client-safe para inscrição na newsletter.
 * Chama a rota interna `/api/newsletter`.
 */
async function subscribeNewsletterClient(
  data: NewsletterSubscribeDto,
): Promise<NewsletterSubscribeResponseDto> {
  const response = await fetch(routes.newsletter, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const parsedError = NewsletterErrorResponseSchema.safeParse(payload);
    const message = parsedError.success
      ? parsedError.data.error
      : "Erro ao processar inscrição";

    throw new NewsletterRequestError(message, response.status);
  }

  const parsedSuccess = NewsletterSubscribeResponseSchema.safeParse(payload);
  if (!parsedSuccess.success) {
    throw new NewsletterRequestError("Resposta inválida do servidor", 500);
  }

  return parsedSuccess.data;
}

/**
 * Componente de formulário de inscrição na newsletter
 *
 * Arquitetura:
 * - Client Component: usa react-hook-form + zodResolver
 * - Validação: NewsletterSubscribeClientSchema (client-side)
 * - Chama: POST /api/newsletter (rota interna Next.js)
 * - A rota interna faz proxy para API externa ou retorna mocks
 */
const Newsletter = () => {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | "warning" | null;
    message: string;
  }>({ type: null, message: "" });

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isValid },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(NewsletterSubscribeClientSchema),
    mode: "onChange", // Valida em tempo real para controlar disabled
  });

  const emailValue = watch("email");
  const acceptTermsValue = watch("acceptTerms");
  const isFormValid = !!emailValue?.trim() && isValid && acceptTermsValue;
  const emailField = register("email");
  const acceptTermsField = register("acceptTerms");

  const submitButtonLabel = isSubmitting
    ? "Enviando..."
    : submitStatus.type === "success"
      ? "Inscrição realizada"
      : submitStatus.type === "warning"
        ? "Email já cadastrado"
        : "Inscrever-se";

  const submitButtonVariantClass =
    submitStatus.type === "success"
      ? "bg-green-500 text-white border-green-500 hover:bg-green-600"
      : submitStatus.type === "warning"
        ? "bg-yellow-500 text-white border-yellow-500/10 hover:bg-yellow-600"
        : "bg-white text-primary-blue border-white hover:bg-primary-blue hover:text-white";

  async function onSubmit(data: NewsletterFormData) {
    try {
      setSubmitStatus({ type: null, message: "" });
      setServerError(null); // Limpa erros anteriores

      // Envia apenas o email para o backend (acceptTerms é validação client-only)
      const result = await subscribeNewsletterClient({ email: data.email });

      setSubmitStatus({
        type: "success",
        message: result.message || "Inscrição realizada com sucesso!",
      });

      setServerError(null); // Limpa erros
      reset(); // Limpa o formulário após sucesso
    } catch (error) {
      if (error instanceof NewsletterRequestError && error.status === 409) {
        setSubmitStatus({
          type: "warning",
          message: error.message || "Este email já está cadastrado.",
        });
        setServerError(error.message || "Este email já está cadastrado.");
        return;
      }

      const errorMsg =
        error instanceof Error
          ? error.message
          : "Erro ao processar sua solicitação";

      setSubmitStatus({
        type: "error",
        message: errorMsg,
      });

      setServerError(errorMsg);
    }
  }

  return (
    <div className="w-full flex items-center justify-center bg-primary-blue py-20 px-10 rounded-11xl">
      <div className="lg:w-10/12 flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="text-[clamp(1.5rem,2vw,3rem)] font-bold font-poppins! text-white text-center">
            Subscribe to our Newsletter
          </h1>
          <p className="text-[clamp(0.8rem,0.8vw,1.2rem)] text-white text-center font-space-grotesk!">
            Stay in touch with our latest news and offers
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex lg:flex-row flex-col items-center lg:items-start justify-center gap-4"
        >
          <div className="w-full lg:w-1/2 min-w-2/5 flex flex-col justify-center items-start gap-1">
            <input
              type="email"
              placeholder="Digite seu email*"
              {...emailField}
              disabled={isSubmitting}
              className={`w-full px-4 py-4 border text-[clamp(0.8rem,0.7vw,0.8rem)] rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[clamp(0.7rem,0.6vw,0.8rem)] placeholder:font-light outline-none ${
                serverError
                  ? "border-red-400 placeholder:text-red-400"
                  : "border-white placeholder:text-white"
              }`}
              aria-invalid={serverError ? "true" : "false"}
              onChange={(e) => {
                emailField.onChange(e);
                if (serverError) setServerError(null); // Limpa erro ao digitar
                if (submitStatus.type) {
                  setSubmitStatus({ type: null, message: "" });
                }
              }}
            />
            <span
              className="text-red-400 text-[clamp(0.7rem,0.6vw,0.8rem)] px-4"
              role="alert"
            >
              {serverError || ""}
            </span>
          </div>

          <div className="w-full lg:w-auto flex flex-col items-start justify-center gap-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...acceptTermsField}
                disabled={isSubmitting}
                className="mt-1 w-4 h-4 accent-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-white text-[clamp(0.7rem,0.7vw,0.9rem)] leading-relaxed">
                Aceito os{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-200 transition-colors"
                >
                  termos de uso
                </a>{" "}
                e{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-gray-200 transition-colors"
                >
                  política de privacidade
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full lg:w-auto border text-[clamp(0.775rem,0.8vw,1.6rem)] py-4 px-8 rounded-full disabled:opacity-40 cursor-pointer disabled:bg-white disabled:text-primary-blue disabled:cursor-default transition-colors duration-400 ${submitButtonVariantClass}`}
            >
              {submitButtonLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
