import axios from "axios";
import { z } from "zod";
import { routes } from "@/api/routes";
import { ApiHealthSchema, ApiReadySchema } from "@/api/schemas/system";

export type DataSourceMode = "api" | "mock" | "auto";
export type RuntimeEnvironment = "development" | "production";

type DataSourceRequestOptions<T> = {
  fromApi: () => Promise<T>;
  fallbackData: T;
  readinessCheck?: () => Promise<boolean>;
};

type RequestJsonOptions = {
  timeoutMs?: number;
  headers?: Record<string, string>;
};

const DEFAULT_TIMEOUT_MS = 10000;

export const resolveRuntimeEnvironment = (): RuntimeEnvironment => {
  // rely solely on NODE_ENV; staging is treated as production
  const raw = process.env.NODE_ENV || "production";
  const env = raw.trim().toLowerCase();
  return env === "development" ? "development" : "production";
};

export const isDevelopmentEnvironment = (): boolean => {
  return resolveRuntimeEnvironment() === "development";
};

export const isDataSourceEnvConfigured = (): boolean => {
  const rawMode =
    process.env.NEWSLY_DATA_SOURCE ||
    process.env.NEXT_PUBLIC_NEWSLY_DATA_SOURCE;

  return Boolean(rawMode && rawMode.trim().length > 0);
};

export const resolveDataSourceMode = (): DataSourceMode => {
  const runtimeEnv = resolveRuntimeEnvironment();

  if (runtimeEnv === "production") {
    return "api";
  }

  const rawMode =
    process.env.NEWSLY_DATA_SOURCE ||
    process.env.NEXT_PUBLIC_NEWSLY_DATA_SOURCE;

  if (!rawMode) return "api";

  const normalizedMode = rawMode
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  if (normalizedMode.startsWith("mock")) return "mock";
  if (normalizedMode === "auto" || normalizedMode === "api") {
    return normalizedMode;
  }

  return "api";
};

const isBackendUnavailable = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return false;

  const status = error.response?.status;
  if (!status) return true;
  return status >= 500;
};

export const requestByDataSourceMode = async <T>(
  options: DataSourceRequestOptions<T>,
): Promise<T> => {
  const mode = resolveDataSourceMode();

  if (mode === "mock") {
    return options.fallbackData;
  }

  try {
    return await options.fromApi();
  } catch (error) {
    if (mode === "auto") {
      return options.fallbackData;
    }

    if (isBackendUnavailable(error)) {
      // Fallback: serviço indisponível, já tratado em outros fluxos
      return options.fallbackData;
    }

    throw error;
  }
};

export const canAccessByDataSourceMode = async (
  readinessCheck: () => Promise<boolean>,
): Promise<boolean> => {
  const mode = resolveDataSourceMode();

  if (mode === "mock" || mode === "auto") {
    return true;
  }

  return readinessCheck();
};

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const rawAppOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim();

const isTrustedOrigin = (input: string) => {
  try {
    const parsed = new URL(input);
    const isLocal =
      ["localhost", "127.0.0.1"].includes(parsed.hostname) ||
      parsed.hostname.endsWith(".local");
    const isInternalDocker = parsed.hostname === "newsly-backend";

    if (isLocal || isInternalDocker) return true;
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const resolveBaseUrl = () => {
  const fallback = "http://localhost:3000";
  const candidate = rawBaseUrl || rawAppOrigin || fallback;

  if (!isTrustedOrigin(candidate)) {
    throw new Error(
      "NEXT_PUBLIC_API_URL/NEXT_PUBLIC_APP_ORIGIN inválida ou insegura. Use HTTPS (ou localhost/newsly-backend em ambiente interno).",
    );
  }

  return candidate;
};

const baseURL = resolveBaseUrl();

const normalizePath = (path: string) =>
  path.startsWith("http://") || path.startsWith("https://")
    ? path
    : path.startsWith("/")
      ? path
      : `/${path}`;

export const api = axios.create({
  baseURL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
});

export const requestJson = async <T>(
  path: string,
  schema: z.ZodSchema<T>,
  options: RequestJsonOptions = {},
): Promise<T> => {
  const response = await api.get(normalizePath(path), {
    timeout: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    headers: {
      ...(options.headers || {}),
    },
  });

  return schema.parse(response.data);
};

export const checkApiHealth = async (timeoutMs = 3000): Promise<boolean> => {
  try {
    await requestJson(routes.system.health, ApiHealthSchema, { timeoutMs });
    return true;
  } catch {
    return false;
  }
};

export const checkApiReadiness = async (timeoutMs = 3000): Promise<boolean> => {
  try {
    await requestJson(routes.system.ready, ApiReadySchema, { timeoutMs });
    return true;
  } catch {
    return false;
  }
};
