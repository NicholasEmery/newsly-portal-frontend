import { z } from "zod";

// Schema for newsletter email validation (server-side)
export const NewsletterSubscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Schema with more detailed messages for client-side
export const NewsletterSubscribeClientSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  acceptTerms: z.boolean().optional(), // Optional - manual validation in component
});

// Success response schema
export const NewsletterSubscribeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

// Error response schema
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
