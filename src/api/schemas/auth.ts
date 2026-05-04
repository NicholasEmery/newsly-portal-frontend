import { z } from "zod";

const AuthEmailSchema = z
  .string()
  .min(1, "validation.emailRequired")
  .email("validation.emailInvalid");

const AuthPasswordSchema = z
  .string()
  .min(1, "validation.passwordRequired")
  .min(8, "validation.passwordMin");

export const AuthLoginClientSchema = z.object({
  email: AuthEmailSchema,
  password: AuthPasswordSchema,
});

export const AuthSignupClientSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "validation.fullNameRequired")
      .min(2, "validation.fullNameMin"),
    email: AuthEmailSchema,
    password: AuthPasswordSchema,
    confirmPassword: z.string().min(1, "validation.confirmPasswordRequired"),
    acceptTerms: z.boolean().refine((value) => value, {
      message: "validation.acceptTermsRequired",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "validation.passwordsMustMatch",
  });

export type AuthLoginClientDto = z.infer<typeof AuthLoginClientSchema>;
export type AuthSignupClientDto = z.infer<typeof AuthSignupClientSchema>;
