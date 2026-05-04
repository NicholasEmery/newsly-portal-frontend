import { requestByDataSourceMode, api } from "@/api/connection/http";
import { loadMocks } from "@/api/mocks";

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
  return await requestByDataSourceMode({
    fromApi: options.apiCall,
    fallbackData: loadMockData(options.mockLoader),
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
  return await requestByDataSourceMode({
    fromApi: async () => {
      const response = await api.post(options.endpoint, options.data);
      return response.data;
    },
    fallbackData: loadMockData((mocks) =>
      options.mockLoader(mocks, options.data),
    ),
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
  return await requestByDataSourceMode({
    fromApi: async () => {
      const response = await api.get(options.endpoint, {
        headers: options.headers,
      });
      return response.data;
    },
    fallbackData: loadMockData(options.mockLoader),
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
