import { z } from "zod";

// Schema para validação de email de newsletter (server-side)
export const NewsletterSubscribeSchema = z.object({
  email: z.string().email("Endereço de email inválido"),
});

// Schema com mensagens mais detalhadas para client-side
export const NewsletterSubscribeClientSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Digite um email válido"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos de uso e privacidade",
  }),
});

// Schema de resposta de sucesso
export const NewsletterSubscribeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

// Schema de resposta de erro
export const NewsletterErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.any().optional(),
});

export type NewsletterSubscribeDto = z.infer<typeof NewsletterSubscribeSchema>;
export type NewsletterSubscribeResponseDto = z.infer<
  typeof NewsletterSubscribeResponseSchema
>;
export type NewsletterErrorResponseDto = z.infer<
  typeof NewsletterErrorResponseSchema
>;
