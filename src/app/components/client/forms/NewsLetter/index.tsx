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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shadcn/components/ui/tooltip";
import { useTranslations } from "next-intl";

type NewsletterFormData = z.infer<typeof NewsletterSubscribeClientSchema>;
type SubmitErrorReason = "termsNotAccepted" | "requestFailed" | null;
type SubmitWarningReason = "emailAlreadyRegistered" | null;

class NewsletterRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "NewsletterRequestError";
    this.status = status;
  }
}

/**
 * Client-safe function for newsletter subscription.
 * Calls the internal route `/api/newsletter`.
 */
async function subscribeNewsletterClient(
  data: NewsletterSubscribeDto,
  errorMessages: { errorProcessing: string; invalidResponse: string },
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
      : errorMessages.errorProcessing;

    throw new NewsletterRequestError(message, response.status);
  }

  const parsedSuccess = NewsletterSubscribeResponseSchema.safeParse(payload);
  if (!parsedSuccess.success) {
    throw new NewsletterRequestError(errorMessages.invalidResponse, 500);
  }

  return parsedSuccess.data;
}

/**
 * Newsletter subscription form component
 *
 * Architecture:
 * - Client Component: uses react-hook-form + zodResolver
 * - Validation: NewsletterSubscribeClientSchema (client-side)
 * - Calls: POST /api/newsletter (internal Next.js route)
 * - The internal route proxies to external API or returns mocks
 */
const Newsletter = () => {
  const t = useTranslations("newsletter");
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | "warning" | null;
    message: string;
  }>({ type: null, message: "" });

  const [serverError, setServerError] = useState<string | null>(null);
  const [checkboxError, setCheckboxError] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [submitErrorReason, setSubmitErrorReason] =
    useState<SubmitErrorReason>(null);
  const [submitWarningReason, setSubmitWarningReason] =
    useState<SubmitWarningReason>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isValid, errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(NewsletterSubscribeClientSchema),
    mode: "onChange", // Real-time validation to control disabled state
  });

  const emailValue = watch("email");
  const acceptTermsValue = watch("acceptTerms");
  // Button only disables for invalid email or submitting (does NOT check checkbox)
  const isEmailValid = !!emailValue?.trim() && !errors.email;
  const emailField = register("email");
  const acceptTermsField = register("acceptTerms");

  const isProcessing = isSubmitting || isValidating;

  const submitButtonLabel = (() => {
    if (isProcessing) return t("sending");

    if (submitStatus.type === "error") {
      if (submitErrorReason === "termsNotAccepted") {
        return t("buttonErrorTerms");
      }

      if (submitErrorReason === "requestFailed") {
        return t("buttonErrorRequest");
      }
    }

    if (
      submitStatus.type === "warning" &&
      submitWarningReason === "emailAlreadyRegistered"
    ) {
      return t("buttonWarningAlreadyRegistered");
    }

    if (submitStatus.type === "success") {
      return t("subscriptionCompleted");
    }

    return t("subscribe");
  })();

  const submitButtonVariantClass = (() => {
    if (submitStatus.type === "error") {
      return "bg-red-500 text-white border-red-500 hover:bg-red-600";
    }

    if (submitStatus.type === "warning") {
      return "bg-yellow-500 text-white border-yellow-500/10 hover:bg-yellow-600";
    }

    if (submitStatus.type === "success") {
      return "bg-green-500 text-white border-green-500 hover:bg-green-600";
    }

    return "bg-white text-primary-blue border-white hover:bg-primary-blue hover:text-white";
  })();

  async function onSubmit(data: NewsletterFormData) {
    setIsValidating(true);
    setCheckboxError(false);
    setSubmitErrorReason(null);
    setSubmitWarningReason(null);

    // Validate checkbox before sending
    if (!acceptTermsValue) {
      // Keep the loading label briefly while checking checkbox state,
      // then switch to explicit error UI (red button + shake).
      setTimeout(() => {
        setIsValidating(false);
        setCheckboxError(true);
        setSubmitStatus({
          type: "error",
          message: t("termsError"),
        });
        setSubmitErrorReason("termsNotAccepted");
      }, 300);

      // Hide tooltip/error state after 3 seconds
      setTimeout(() => {
        setCheckboxError(false);
      }, 3300);

      return;
    }

    try {
      setSubmitStatus({ type: null, message: "" });
      setServerError(null); // Clear previous errors
      setCheckboxError(false);
      setSubmitErrorReason(null);
      setSubmitWarningReason(null);

      // Send only the email to the backend (acceptTerms is client-only validation)
      const result = await subscribeNewsletterClient(
        { email: data.email },
        {
          errorProcessing: t("errorProcessing"),
          invalidResponse: t("invalidResponse"),
        },
      );

      setSubmitStatus({
        type: "success",
        message: result.message || t("subscriptionCompleted"),
      });

      setServerError(null); // Clear errors
      reset(); // Clear form after success
    } catch (error) {
      if (error instanceof NewsletterRequestError && error.status === 409) {
        setSubmitStatus({
          type: "warning",
          message: error.message || t("emailAlreadyRegisteredError"),
        });
        setSubmitWarningReason("emailAlreadyRegistered");
        setSubmitErrorReason(null);
        setServerError(error.message || t("emailAlreadyRegisteredError"));
        return;
      }

      const errorMsg =
        error instanceof Error ? error.message : t("genericError");

      setSubmitStatus({
        type: "error",
        message: errorMsg,
      });
      setSubmitErrorReason("requestFailed");
      setSubmitWarningReason(null);

      setServerError(errorMsg);
    } finally {
      setIsValidating(false);
    }
  }

  return (
    <div className="w-full flex items-center justify-center bg-primary-blue py-20 px-10 rounded-11xl">
      <div className="lg:w-10/12 flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="text-[clamp(1.5rem,2vw,3rem)] font-bold font-poppins! text-white text-center">
            {t("title")}
          </h1>
          <p className="text-[clamp(0.8rem,0.8vw,1.2rem)] text-white text-center font-space-grotesk!">
            {t("subtitle")}
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center justify-center gap-4"
        >
          <div className="w-full flex lg:flex-row flex-col items-center lg:items-start justify-center gap-4">
            <div className="w-full lg:w-1/2 min-w-2/5 flex flex-col justify-center items-start relative">
              <Tooltip open={!!serverError}>
                <TooltipTrigger className="w-full">
                  <input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    {...emailField}
                    disabled={isProcessing}
                    className={`w-full px-4 py-4 border text-[clamp(0.8rem,0.7vw,0.9rem)] rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[clamp(0.8rem,0.7vw,0.8rem)] placeholder:font-light transition-all ${
                      serverError
                        ? "border-red-400 placeholder:text-red-400"
                        : "border-white placeholder:text-white"
                    }`}
                    aria-invalid={serverError ? "true" : "false"}
                    onChange={(e) => {
                      emailField.onChange(e);
                      if (serverError) setServerError(null);
                      if (submitStatus.type) {
                        setSubmitStatus({ type: null, message: "" });
                        setSubmitErrorReason(null);
                        setSubmitWarningReason(null);
                      }
                    }}
                  />
                </TooltipTrigger>
                {serverError && (
                  <TooltipContent
                    side="top"
                    className="bg-red-500 text-white border-red-600 *:bg-red-500 *:fill-red-500"
                  >
                    {serverError}
                  </TooltipContent>
                )}
              </Tooltip>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !isEmailValid}
              className={`w-full lg:w-auto border text-[clamp(0.775rem,0.8vw,1.6rem)] py-4 px-8 rounded-full disabled:opacity-40 cursor-pointer disabled:bg-white disabled:text-primary-blue disabled:cursor-default transition-colors duration-400 ${submitButtonVariantClass} ${submitErrorReason === "termsNotAccepted" ? "has-error-shake" : ""}`}
            >
              {submitButtonLabel}
            </button>
          </div>

          <Tooltip open={checkboxError}>
            <TooltipTrigger className="flex items-start justify-center gap-1 cursor-pointer">
              <label className="flex items-start justify-center gap-1 cursor-pointer w-full">
                <input
                  type="checkbox"
                  {...acceptTermsField}
                  disabled={isProcessing}
                  className={checkboxError ? "has-error" : ""}
                  onChange={(e) => {
                    acceptTermsField.onChange(e);
                    if (checkboxError) {
                      setCheckboxError(false);
                      setSubmitStatus({ type: null, message: "" });
                      setSubmitErrorReason(null);
                      setIsValidating(false); // Reset validating state when checkbox is checked
                    }
                  }}
                />
                <span className="text-white text-left text-[clamp(0.7rem,0.7vw,0.9rem)]">
                  {t("acceptTermsLabel")}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-200 transition-colors mx-1"
                  >
                    {t("termsOfUse")}
                  </a>
                  {t("and")}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-200 transition-colors mx-1"
                  >
                    {t("privacyPolicy")}
                  </a>
                </span>
              </label>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="start"
              alignOffset={-9}
              sideOffset={7}
              arrowClassName="data-[side=top]:!left-2 sm:data-[side=top]:!left-3 data-[side=top]:!right-auto"
              className="bg-red-500 text-white border-red-600 *:bg-red-500 *:fill-red-500"
            >
              {t("termsError")}
            </TooltipContent>
          </Tooltip>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
