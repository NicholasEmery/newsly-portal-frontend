import { z } from "zod";

export const ApiHealthSchema = z.object({
  status: z.literal("ok"),
  service: z.string().min(1),
  timestamp: z.string().min(1),
});

export const ApiReadySchema = z.object({
  status: z.literal("ready"),
  service: z.string().min(1),
  timestamp: z.string().min(1),
});

// Schema for validating service unavailable reasons
export const ServiceUnavailableReasonSchema = z.enum([
  "ok",
  "api-unavailable",
  "mock-directory-missing-dev",
  "datasource-env-missing-dev",
  "api-unavailable-use-mocks",
  "api-and-mock-unavailable",
]);

export type ApiHealthDto = z.infer<typeof ApiHealthSchema>;
export type ApiReadyDto = z.infer<typeof ApiReadySchema>;
export type ServiceUnavailableReason = z.infer<
  typeof ServiceUnavailableReasonSchema
>;
