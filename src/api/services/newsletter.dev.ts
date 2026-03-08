import { createDevPostService } from "@/api/utils/serviceHelpers";
import type {
  NewsletterSubscribeDto,
  NewsletterSubscribeResponseDto,
} from "@/api/schemas/newsletter";

/**
 * Implementação dev da inscrição na newsletter
 * Usa createDevPostService helper que gerencia API vs Mocks automaticamente
 */
export const subscribeNewsletter = async (
  data: NewsletterSubscribeDto,
): Promise<NewsletterSubscribeResponseDto> => {
  return createDevPostService({
    endpoint: "/newsletter/subscribe",
    data,
    mockLoader: (mocks, requestData) => {
      // Simula checagem de email duplicado
      const subscribers = mocks.NEWSLETTER_SUBSCRIBERS_MOCK || [];
      if (subscribers.includes(requestData.email)) {
        return (
          mocks.NEWSLETTER_ERROR_DUPLICATE_MOCK || {
            success: false,
            message: "Este email já está cadastrado.",
          }
        );
      }

      // Retorna sucesso mockado
      return (
        mocks.NEWSLETTER_SUCCESS_RESPONSE_MOCK || {
          success: true,
          message: "Inscrição realizada com sucesso!",
        }
      );
    },
  });
};
