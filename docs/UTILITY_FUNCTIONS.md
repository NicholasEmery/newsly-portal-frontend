# Funções Utilitárias Globais

Este documento lista todas as funções utilitárias globais disponíveis no projeto que devem ser reutilizadas ao invés de duplicadas.

## 📂 Localização

```
src/api/
├── connection/http.ts       # HTTP client e data source logic
├── mocks.ts                 # Mock loading utilities
└── utils/
    ├── pagination.ts        # Paginação
    └── serviceHelpers.ts    # Helpers para services dev (NOVO)

src/utils/
├── date.ts                  # Formatação de datas
└── userRoute.ts             # Geração de rotas
```

---

## 🔌 HTTP Client & Data Source (`src/api/connection/http.ts`)

### `api` (Axios instance)

```typescript
import { api } from "@/api/connection/http";

// GET request
const response = await api.get("/endpoint");

// POST request
const response = await api.post("/endpoint", data);
```

**Configuração**:

- Base URL: `process.env.NEXT_PUBLIC_API_URL`
- Timeout: 10s
- Content-Type: application/json
- Credentials: incluídas

---

### `requestByDataSourceMode<T>()`

**Função principal para gerenciar API vs Mocks**

```typescript
import { requestByDataSourceMode } from "@/api/connection/http";

const data = await requestByDataSourceMode({
  fromApi: async () => {
    // Lógica de chamada da API
    const response = await api.get("/data");
    return response.data;
  },
  fallbackData: mockData, // Retornado se modo=mock ou se API falhar em modo=auto
});
```

**Comportamento**:

- `mode=mock`: Retorna `fallbackData` imediatamente
- `mode=api`: Tenta `fromApi()`, lança erro se falhar
- `mode=auto`: Tenta `fromApi()`, retorna `fallbackData` se falhar

**❌ NÃO FAÇA**: Implementar lógica manual de data source
**✅ USE ISSO**: `requestByDataSourceMode` gerencia tudo automaticamente

---

### `resolveDataSourceMode()`

```typescript
import { resolveDataSourceMode } from "@/api/connection/http";

const mode = resolveDataSourceMode(); // 'api' | 'mock' | 'auto'
```

**Retorna**: Modo configurado em `NEWSLY_DATA_SOURCE`

---

### `checkApiReadiness(timeout?)`

```typescript
import { checkApiReadiness } from "@/api/connection/http";

const isReady = await checkApiReadiness(1500); // timeout em ms
```

**Retorna**: `true` se API está pronta, `false` caso contrário

---

### `isDataSourceEnvConfigured()`

```typescript
import { isDataSourceEnvConfigured } from "@/api/connection/http";

const isConfigured = isDataSourceEnvConfigured();
```

**Retorna**: `true` se `NEWSLY_DATA_SOURCE` está configurado

---

### `isDevelopmentEnvironment()`

```typescript
import { isDevelopmentEnvironment } from "@/api/connection/http";

const isDev = isDevelopmentEnvironment();
```

**Retorna**: `true` se `NODE_ENV === 'development'`

---

## 📦 Mock Utilities (`src/api/mocks.ts`)

### `loadMocks()`

**Carrega dados de mock sincronamente**

```typescript
import { loadMocks } from "@/api/mocks";

const mocks = loadMocks(); // any | null

if (mocks) {
  const data = mocks.SOME_DATA_MOCK;
}
```

**Retorna**: Objeto com todos os mocks exportados ou `null` se não disponível

**❌ NÃO FAÇA**:

```typescript
const mocks = await import("@/mocks"); // Duplicação
```

**✅ USE ISSO**:

```typescript
const mocks = loadMocks();
```

---

### `hasMocksDirectory()`

```typescript
import { hasMocksDirectory } from "@/api/mocks";

const hasMocks = hasMocksDirectory();
```

**Retorna**: `true` se pasta `src/mocks/` existe

---

## 🛠️ Service Helpers (`src/api/utils/serviceHelpers.ts`) **NOVO**

### `createDevService<T>()`

**Helper genérico para services dev**

```typescript
import { createDevService } from "@/api/utils/serviceHelpers";

export const getData = async () => {
  return createDevService({
    apiCall: async () => {
      const response = await api.get("/data");
      return response.data;
    },
    mockLoader: (mocks) => mocks.DATA_MOCK || [],
  });
};
```

---

### `createDevPostService<TRequest, TResponse>()`

**Helper para POST requests**

```typescript
import { createDevPostService } from "@/api/utils/serviceHelpers";

export const createItem = async (data: CreateItemDto) => {
  return createDevPostService({
    endpoint: "/items",
    data,
    mockLoader: (mocks, requestData) => {
      // Pode usar requestData na lógica do mock
      return mocks.CREATE_ITEM_SUCCESS_MOCK;
    },
  });
};
```

---

### `createDevGetService<T>()`

**Helper para GET requests**

```typescript
import { createDevGetService } from "@/api/utils/serviceHelpers";

export const getItems = async (categoryId: string) => {
  return createDevGetService({
    endpoint: `/items?category=${categoryId}`,
    mockLoader: (mocks) =>
      (mocks.ITEMS_MOCK || []).filter((item) => item.categoryId === categoryId),
  });
};
```

---

## 📄 Pagination (`src/api/utils/pagination.ts`)

### `parsePaginationParams()`

```typescript
import { parsePaginationParams } from "@/api/utils/pagination";

// Em API route
export async function GET(request: NextRequest) {
  const { limit, page } = parsePaginationParams(request.nextUrl.searchParams);
  // limit: number | undefined
  // page: number (default 1)
}
```

---

### `paginateArray<T>()`

```typescript
import { paginateArray } from "@/api/utils/pagination";

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const paginated = paginateArray(items, { limit: 3, page: 2 });
// [4, 5, 6]
```

---

## 📅 Date Utilities (`src/utils/date.ts`)

### `formatCreatedAtDisplay()`

```typescript
import { formatCreatedAtDisplay } from "@/utils/date";

const formatted = formatCreatedAtDisplay(new Date());
// "07 Mar 2026, 02:30 PM"
```

---

### `clampCreatedAtToPolicy()`

```typescript
import { clampCreatedAtToPolicy } from "@/utils/date";

const clamped = clampCreatedAtToPolicy(date);
// Garante que a data está dentro da política (últimos 5 meses)
```

---

## 🔗 Route Utilities (`src/utils/userRoute.ts`)

### `buildCreatorRoute()`

```typescript
import { buildCreatorRoute } from "@/utils/userRoute";

const route = buildCreatorRoute("John Smith");
// "/creators/john-smith"
```

---

## 🎯 Exemplos Práticos

### Antes (❌ Duplicação)

```typescript
// newsletter.dev.ts (120 linhas de código duplicado)
export const subscribeNewsletter = async (data: NewsletterSubscribeDto) => {
  const mode = resolveDataSourceMode();
  const hasMocks = hasMocksDirectory();

  if (mode === "mock") {
    if (!hasMocks) throw new Error("...");
    return loadNewsletterMock(data);
  }

  const apiReady = await checkApiReadiness(1500);
  if (mode === "auto") {
    if (apiReady) {
      try {
        return await callExternalApi(data);
      } catch (error) {
        if (hasMocks) return loadNewsletterMock(data);
        throw error;
      }
    }
    // ... mais 60 linhas de lógica manual
  }
  // ... etc
};
```

### Depois (✅ Usando Helpers)

```typescript
// newsletter.dev.ts (35 linhas, limpo e claro)
import { createDevPostService } from "@/api/utils/serviceHelpers";

export const subscribeNewsletter = async (data: NewsletterSubscribeDto) => {
  return createDevPostService({
    endpoint: "/newsletter/subscribe",
    data,
    mockLoader: (mocks, requestData) => {
      const subscribers = mocks.NEWSLETTER_SUBSCRIBERS_MOCK || [];
      if (subscribers.includes(requestData.email)) {
        return mocks.NEWSLETTER_ERROR_DUPLICATE_MOCK;
      }
      return mocks.NEWSLETTER_SUCCESS_RESPONSE_MOCK;
    },
  });
};
```

**Redução**: 120 linhas → 35 linhas (70% menos código!)

---

## ✅ Checklist de Uso

Ao criar novo service dev, pergunte-se:

- [ ] Estou usando `createDevPostService` / `createDevGetService`?
- [ ] Estou usando `loadMocks()` ao invés de `import("@/mocks")`?
- [ ] Estou usando `api` ao invés de `fetch()` direto?
- [ ] Estou usando `parsePaginationParams()` para paginação?
- [ ] Estou usando `formatCreatedAtDisplay()` para datas?
- [ ] Não estou duplicando lógica de data source mode?

---

## 🚫 Anti-Padrões

### ❌ Implementar lógica de data source manualmente

```typescript
const mode = resolveDataSourceMode();
if (mode === "mock") { ... }
else if (mode === "auto") { ... }
// Muito código manual!
```

### ✅ Usar helpers

```typescript
return createDevPostService({ ... });
```

---

### ❌ Carregar mocks manualmente

```typescript
const mocks = await import("@/mocks");
```

### ✅ Usar função global

```typescript
const mocks = loadMocks();
```

---

### ❌ Criar axios instance própria

```typescript
const customApi = axios.create({ ... });
```

### ✅ Usar instance global

```typescript
import { api } from "@/api/connection/http";
```

---

## 📚 Documentos Relacionados

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura geral
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Referência rápida
- [EXAMPLE_IMPLEMENTATION.md](./EXAMPLE_IMPLEMENTATION.md) - Exemplos práticos

---

**Última atualização**: 7 de março de 2026  
**Versão**: 1.1.0
