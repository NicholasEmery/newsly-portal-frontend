import {
  requestByDataSourceMode,
  resolveBackendBaseUrl,
  resolveFrontendAppOrigin,
} from "@/api/connection/http";
import { loadMocks } from "@/api/mocks";
import axios from "axios";

/**
 * Generic helper to create dev services with API + Mocks logic
 *
 * Uses requestByDataSourceMode from http.ts to automatically manage:
 * - 'api' mode: Only tries external API
 * - 'mock' mode: Only uses mocks
 * - 'auto' mode: Tries API, falls back to mocks if it fails
 *
 * @example
 * ```typescript
 * export const getCategories = async () => {
 *   return createDevService({
 *     apiCall: async () => {
 *       const response = await api.get("/categories");
 *       return response.data;
 *     },
 *     mockLoader: (mocks) => mocks.CATEGORIES_MOCK || [],
 *   });
 * };
 * ```
 */
export async function createDevService<T>(options: {
  apiCall: () => Promise<T>;
  mockLoader: (mocks: any) => T;
}): Promise<T> {
  const fallback = loadMockData(options.mockLoader);
  return await requestByDataSourceMode({
    fromApi: options.apiCall,
    fallbackData: fallback,
  });
}

/**
 * Helper para criar service dev que faz POST
 *
 * @example
 * ```typescript
 * export const createComment = async (data: CreateCommentDto) => {
 *   return createDevPostService({
 *     endpoint: "/comments",
 *     data,
 *     mockLoader: (mocks, data) => {
 *       return mocks.CREATE_COMMENT_SUCCESS_MOCK;
 *     },
 *   });
 * };
 * ```
 */
export async function createDevPostService<TRequest, TResponse>(options: {
  endpoint: string;
  data: TRequest;
  mockLoader: (mocks: any, data: TRequest) => TResponse;
}): Promise<TResponse> {
  const fallback = loadMockData((mocks) =>
    options.mockLoader(mocks, options.data),
  );
  return await requestByDataSourceMode({
    fromApi: async () => {
      const backendBaseUrl = resolveBackendBaseUrl();
      const internalEndpoint = `/api${options.endpoint.startsWith("/") ? options.endpoint : `/${options.endpoint}`}`;
      const internalOrigin =
        resolveFrontendAppOrigin() ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000");
      const internalUrl = `${internalOrigin}${internalEndpoint}`;

      try {
        const response = await axios.post(internalUrl, options.data, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        return response.data;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404 && backendBaseUrl) {
          const backendUrl = `${backendBaseUrl.replace(/\/$/, "")}${options.endpoint.startsWith("/") ? options.endpoint : `/${options.endpoint}`}`;
          const backResp = await axios.post(backendUrl, options.data, {
            headers: { "Content-Type": "application/json" },
          });
          return backResp.data;
        }
        throw err;
      }
    },
    fallbackData: fallback as TResponse,
  });
}

/**
 * Helper para criar service dev que faz GET
 *
 * @example
 * ```typescript
 * export const getComments = async (postId: string) => {
 *   return createDevGetService({
 *     endpoint: `/comments?postId=${postId}`,
 *     mockLoader: (mocks) =>
 *       (mocks.COMMENTS_MOCK || []).filter(c => c.postId === postId),
 *   });
 * };
 * ```
 */
export async function createDevGetService<T>(options: {
  endpoint: string;
  headers?: Record<string, string>;
  mockLoader: (mocks: any) => T;
}): Promise<T> {
  const fallback = loadMockData(options.mockLoader);
  return await requestByDataSourceMode({
    fromApi: async () => {
      const backendBaseUrl = resolveBackendBaseUrl();
      const internalEndpoint = `/api${options.endpoint.startsWith("/") ? options.endpoint : `/${options.endpoint}`}`;
      const internalOrigin =
        resolveFrontendAppOrigin() ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000");
      const internalUrl = `${internalOrigin}${internalEndpoint}`;

      try {
        const response = await axios.get(internalUrl, {
          headers: options.headers,
          withCredentials: true,
        });
        return response.data;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404 && backendBaseUrl) {
          const backendUrl = `${backendBaseUrl.replace(/\/$/, "")}${options.endpoint.startsWith("/") ? options.endpoint : `/${options.endpoint}`}`;
          const backResp = await axios.get(backendUrl, {
            headers: options.headers,
          });
          return backResp.data;
        }
        throw err;
      }
    },
    fallbackData: fallback as T,
  });
}

/**
 * Loads mock data safely
 * Returns the loader result or default value if mocks not available
 */
function loadMockData<T>(loader: (mocks: any) => T): T {
  const mocks = loadMocks();

  if (!mocks) {
    // Returns empty default value based on type
    // For arrays, returns empty array; for objects, returns empty object
    return (Array.isArray(loader({})) ? [] : {}) as T;
  }

  try {
    return loader(mocks);
  } catch (error) {
    console.error("[loadMockData] error processing mocks:", error);
    return (Array.isArray(loader({})) ? [] : {}) as T;
  }
}
