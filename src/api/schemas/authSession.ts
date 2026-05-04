import { z } from "zod";

export const AuthUserSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    role: z.string().optional(),
    plan: z.string().optional(),
    isPremium: z.boolean().optional(),
  })
  .passthrough();

export const AuthSessionSchema = z.object({
  authenticated: z.boolean(),
  user: AuthUserSchema.nullable(),
});

export type AuthUserDto = z.infer<typeof AuthUserSchema>;
export type AuthSessionDto = z.infer<typeof AuthSessionSchema>;
