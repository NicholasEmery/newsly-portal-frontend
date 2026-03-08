import { api } from "@/api/connection/http";
import {
  NewsletterSubscribeResponseSchema,
  type NewsletterSubscribeDto,
  type NewsletterSubscribeResponseDto,
} from "@/api/schemas/newsletter";
import { IS_DEV_BUILD } from "@/config/buildTarget";

/**
 * Inscreve um email na newsletter (SERVER-SIDE ONLY)
 * Em produção: chama API externa
 * Em desenvolvimento: usa implementação .dev com fallback para mocks
 *
 * IMPORTANTE: Esta função deve ser chamada apenas no servidor (API routes, Server Components, etc).
 */
export const subscribeNewsletter = async (
  data: NewsletterSubscribeDto,
): Promise<NewsletterSubscribeResponseDto> => {
  if (IS_DEV_BUILD) {
    // Delega para implementação dev que tem lógica de mocks
    const mod = await import("./newsletter.dev");
    return mod.subscribeNewsletter(data);
  }

  // Em produção: chama API externa
  const response = await api.post("/newsletter/subscribe", data);
  return NewsletterSubscribeResponseSchema.parse(response.data);
};
