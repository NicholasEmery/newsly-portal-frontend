import axios from "axios";
import { z } from "zod";
// Note: removed unused imports to satisfy lint

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

  if (!rawMode) return "auto";

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
    // Em modo "auto", trata erros 5xx ou de rede como backend indisponível
    // e faz fallback automático para mocks. Para outros erros, respeita a
    // readiness check: se a readiness indicar indisponibilidade, faz fallback,
    // caso contrário propaga o erro para debugging.
    if (mode === "auto") {
      try {
        if (isBackendUnavailable(error)) {
          return options.fallbackData;
        }
      } catch {
        // se isBackendUnavailable falhar por algum motivo, continue com a
        // verificação de readiness abaixo
      }

      // Verifica se o backend respondeu ao readiness check
      const apiReady = await checkApiReadiness(1500);
      if (!apiReady) {
        // Backend não respondeu - usa mocks
        return options.fallbackData;
      }

      // Backend respondeu e o erro não indica 5xx - lança o erro
      throw error;
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
      "NEXT_PUBLIC_API_URL/NEXT_PUBLIC_APP_ORIGIN invalid or insecure. Use HTTPS (or localhost/newsly-backend in internal environment).",
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

export const requestJsonWithLocale = async <T>(
  path: string,
  schema: z.ZodSchema<T>,
  locale: string,
  options: RequestJsonOptions = {},
): Promise<T> => {
  const response = await api.get(normalizePath(path), {
    timeout: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    headers: {
      "Accept-Language": locale,
      ...(options.headers || {}),
    },
  });

  return schema.parse(response.data);
};

export const checkApiHealth = async (timeoutMs = 3000): Promise<boolean> => {
  try {
    // Chama a rota proxy do Next.js local
    const response = await axios.get("/api/health", {
      timeout: timeoutMs,
    });
    return response.status === 200;
  } catch {
    return false;
  }
};

export const checkApiReadiness = async (timeoutMs = 3000): Promise<boolean> => {
  try {
    const response = await axios.get("/api/ready", {
      timeout: timeoutMs,
    });
    return response.status === 200;
  } catch {
    return false;
  }
};

