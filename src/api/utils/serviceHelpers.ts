import { requestByDataSourceMode, api } from "@/api/connection/http";
import { loadMocks } from "@/api/mocks";

/**
 * Helper genérico para criar services dev com lógica de API + Mocks
 *
 * Usa requestByDataSourceMode do http.ts para gerenciar automaticamente:
 * - Modo 'api': Só tenta API externa
 * - Modo 'mock': Só usa mocks
 * - Modo 'auto': Tenta API, fallback para mocks se falhar
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
  mockLoader: (mocks: any) => T;
}): Promise<T> {
  return await requestByDataSourceMode({
    fromApi: async () => {
      const response = await api.get(options.endpoint);
      return response.data;
    },
    fallbackData: loadMockData(options.mockLoader),
  });
}

/**
 * Carrega dados de mock de forma segura
 * Retorna o resultado do loader ou valor padrão se mocks não disponíveis
 */
function loadMockData<T>(loader: (mocks: any) => T): T {
  const mocks = loadMocks();

  if (!mocks) {
    // Retorna valor padrão vazio baseado no tipo
    // Para arrays, retorna array vazio; para objetos, retorna objeto vazio
    return (Array.isArray(loader({})) ? [] : {}) as T;
  }

  try {
    return loader(mocks);
  } catch (error) {
    console.error("[loadMockData] erro ao processar mocks:", error);
    return (Array.isArray(loader({})) ? [] : {}) as T;
  }
}
