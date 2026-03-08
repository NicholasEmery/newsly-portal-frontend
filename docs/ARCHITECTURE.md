# Arquitetura do Projeto - Newsly Portal Frontend

## 📐 Visão Geral

Este projeto segue uma arquitetura em camadas com separação clara de responsabilidades, suporte a múltiplas fontes de dados (API externa, mocks) e validação consistente usando Zod.

```
┌─────────────────────────────────────────────────────────────┐
│ Components & Pages (UI Layer)                               │
│  - Server Components (SSR)                                  │
│  - Client Components (CSR)                                  │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Services Layer (src/api/services/)                          │
│  - Business logic                                           │
│  - Chama rotas internas do Next.js                          │
│  - Usa schemas Zod para type safety                        │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ API Routes Layer (src/app/api/)                             │
│  - Next.js Route Handlers                                   │
│  - Proxy entre API externa e mocks                          │
│  - Validação Zod server-side                                │
│  - Cache control                                            │
└────────────────────┬─────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌─────────────────┐      ┌─────────────────┐
│ External API    │      │ Mocks (dev)     │
│ (Production)    │      │ src/mocks/      │
└─────────────────┘      └─────────────────┘
```

## 📁 Estrutura de Pastas

```
src/
├── api/                          # Core API layer
│   ├── connection/              # HTTP client configuration
│   │   └── http.ts              # Axios instance, data source logic
│   ├── schemas/                 # Zod validation schemas
│   │   ├── categories.ts
│   │   ├── homepage.ts
│   │   ├── newsletter.ts
│   │   └── system.ts
│   ├── services/                # Business logic services
│   │   ├── categories.ts        # Production service
│   │   ├── categories.dev.ts    # Dev-only service with mocks
│   │   ├── homeSections.ts
│   │   └── homeSections.dev.ts
│   ├── utils/                   # Utility functions
│   │   ├── pagination.ts        # Paginação helpers
│   │   └── serviceHelpers.ts    # Helpers para services dev (NOVO)
│   ├── mocks.ts                 # Mock loader utilities
│   └── routes.ts                # Route definitions/constants
│
├── app/
│   ├── api/                     # Next.js API routes
│   │   ├── newsletter/
│   │   │   └── route.ts         # POST /api/newsletter
│   │   ├── categories/
│   │   │   └── route.ts         # GET /api/categories
│   │   └── sections/
│   │       ├── home-grids/
│   │       ├── latest-news/
│   │       └── top-notice/
│   │
│   └── components/
│       ├── client/              # Client components ("use client")
│       │   └── NewsLetter.tsx
│       └── server/              # Server components (default)
│           └── Card.tsx
│
├── mocks/                       # Mock data (dev only)
│   ├── index.ts                 # Central export
│   ├── navigation.ts
│   ├── home.ts
│   └── newsletter.ts
│
└── config/
    └── buildTarget.ts           # IS_DEV_BUILD flag
```

## 🔄 Fluxo de Dados Padrão

### 1. **Componente → Service**

```typescript
// src/app/components/client/NewsLetter.tsx
import { subscribeNewsletter } from "@/api/services/newsletter";

const response = await subscribeNewsletter({ email });
```

### 2. **Service → API Route (Next.js)**

```typescript
// src/api/services/newsletter.ts
import { requestJson } from "@/api/connection/http";
import { routes } from "@/api/routes";

export const subscribeNewsletter = async (data: NewsletterSubscribeDto) => {
  return await requestJson(
    routes.newsletter.subscribe,
    NewsletterSubscribeResponseSchema,
    {
      method: "POST",
      data,
    },
  );
};
```

### 3. **API Route → API Externa (ou Mocks)**

```typescript
// src/app/api/newsletter/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = NewsletterSubscribeSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "..." }, { status: 400 });
  }

  // Chama API externa
  await api.post("/newsletter/subscribe", result.data);

  return NextResponse.json({ success: true });
}
```

## 🎯 Padrão de Nomenclatura

### Services

```
<dominio>.ts              # Produção: chama API via rotas Next.js
<dominio>.dev.ts          # Dev: adiciona lógica de mocks/fallback
```

**Exemplo**: `newsletter.ts`, `newsletter.dev.ts`

### API Routes

```
src/app/api/<dominio>/route.ts
src/app/api/<dominio>/<acao>/route.ts
```

**Exemplo**:

- `src/app/api/newsletter/route.ts` (POST)
- `src/app/api/categories/route.ts` (GET)

### Schemas

```
src/api/schemas/<dominio>.ts
```

**Padrão de nomenclatura**:

- Schema: `<Nome>Schema` (ex: `NewsletterSubscribeSchema`)
- Tipo: `<Nome>Dto` (ex: `NewsletterSubscribeDto`)
- Client variant: `<Nome>ClientSchema` (se necessário)

### Mocks

```
src/mocks/<dominio>.ts
```

**Nomenclatura de constantes**:

```typescript
export const NEWSLETTER_SUBSCRIBERS_MOCK = [...]
export const NEWSLETTER_RESPONSE_MOCK = {...}
```

### Routes

```typescript
// src/api/routes.ts
export const routes = {
  newsletter: {
    subscribe: "/api/newsletter",
  },
  categories: "/api/categories",
  sections: {
    topNotice: "/api/sections/top-notice",
  },
} as const;
```

## 🔧 Data Source Modes

O projeto suporta três modos de fonte de dados (controlado por `NEWSLY_DATA_SOURCE`):

### `api` (padrão em produção)

- Sempre usa API externa
- **Falha** se API não estiver disponível
- Mocks **nunca** são usados

### `mock` (dev only)

- Sempre usa mocks locais
- API externa é ignorada
- Útil para desenvolvimento offline

### `auto` (recomendado para dev)

- Tenta API externa primeiro
- **Fallback** para mocks se API falhar
- Melhor experiência de desenvolvimento

**Configuração** em `.env.local`:

```bash
NEWSLY_DATA_SOURCE=auto  # ou 'api', 'mock'
```

## 📝 Template de Nova Feature

### 1. Criar Schema

```typescript
// src/api/schemas/<dominio>.ts
import { z } from "zod";

export const <Nome>Schema = z.object({
  // campos...
});

export type <Nome>Dto = z.infer<typeof <Nome>Schema>;
```

### 2. Criar Service (Produção)

```typescript
// src/api/services/<dominio>.ts
import { api } from "@/api/connection/http";
import { <Nome>Schema } from "@/api/schemas/<dominio>";
import { IS_DEV_BUILD } from "@/config/buildTarget";

export const <action> = async (data: <Nome>Dto) => {
  if (IS_DEV_BUILD) {
    const mod = await import("./<dominio>.dev");
    return mod.<action>(data);
  }

  const response = await api.post("/rota", data);
  return <Nome>Schema.parse(response.data);
};
```

### 3. Criar Service (Dev)

```typescript
// src/api/services/<dominio>.dev.ts
import { createDevPostService } from "@/api/utils/serviceHelpers";
import type { <Nome>Dto, <Nome>ResponseDto } from "@/api/schemas/<dominio>";

export const <action> = async (data: <Nome>Dto): Promise<<Nome>ResponseDto> => {
  return createDevPostService({
    endpoint: "/<endpoint>",
    data,
    mockLoader: (mocks, requestData) => {
      // Lógica de mock (pode usar requestData)
      return mocks.<MOCK_DATA>;
    },
  });
};
```

**Para GET requests**:

```typescript
import { createDevGetService } from "@/api/utils/serviceHelpers";

export const <action> = async (id: string) => {
  return createDevGetService({
    endpoint: `/<endpoint>/${id}`,
    mockLoader: (mocks) => mocks.<MOCK_DATA>,
  });
};
```

### 4. Criar API Route

```typescript
// src/app/api/<dominio>/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/api/connection/http";
import { <Nome>Schema } from "@/api/schemas/<dominio>";
import { loadMocks } from "@/api/mocks";
import { getDataSourceStatus } from "@/api/services/dataSourceStatus";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = <Nome>Schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: result.error },
      { status: 400 }
    );
  }

  const status = await getDataSourceStatus();

  // Se usar mocks
  if (String(status.reason).includes("mock")) {
    const mocks = loadMocks();
    const mockResponse = mocks?.<MOCK_DATA>;
    return NextResponse.json(mockResponse);
  }

  // Chama API externa
  try {
    await api.post("/external-route", result.data);
    return NextResponse.json({ success: true });
  } catch (error) {
    // Tratamento de erro...
  }
}
```

### 5. Criar Mocks

```typescript
// src/mocks/<dominio>.ts
export const <NOME>_MOCK = {
  // dados mock...
};
```

### 6. Exportar em index.ts

```typescript
// src/mocks/index.ts
export * from "./<dominio>";
```

### 7. Adicionar Route Constant

```typescript
// src/api/routes.ts
export const routes = {
  // ... outros
  <dominio>: {
    <acao>: "/api/<dominio>",
  },
} as const;
```

## ✅ Checklist de Implementação

- [ ] Schema criado em `src/api/schemas/`
- [ ] Service `.ts` criado (produção)
- [ ] Service `.dev.ts` criado (dev com mocks)
- [ ] API Route criada em `src/app/api/`
- [ ] Mocks criados em `src/mocks/`
- [ ] Mocks exportados em `src/mocks/index.ts`
- [ ] Rota adicionada em `src/api/routes.ts`
- [ ] Validação Zod implementada
- [ ] Tratamento de erros
- [ ] Type safety garantido
- [ ] Documentação inline (JSDoc se necessário)

## 🚫 Anti-Padrões (Evitar)

❌ **Chamar API externa diretamente de componentes**

```typescript
// ❌ ERRADO
const response = await fetch(`${API_URL}/data`);
```

✅ **Use services**

```typescript
// ✅ CORRETO
import { getData } from "@/api/services/data";
const response = await getData();
```

---

❌ **Schemas inline em componentes/rotas**

```typescript
// ❌ ERRADO
const schema = z.object({ email: z.string().email() });
```

✅ **Centralize em schemas**

```typescript
// ✅ CORRETO
import { EmailSchema } from "@/api/schemas/email";
```

---

❌ **Lógica de data source em componentes**

```typescript
// ❌ ERRADO
if (process.env.USE_MOCKS) {
  /* ... */
}
```

✅ **Deixe services gerenciarem isso**

```typescript
// ✅ CORRETO - service decide a fonte
const data = await getHomeSections();
```

---

❌ **Importar mocks em código de produção**

```typescript
// ❌ ERRADO
import { MOCK_DATA } from "@/mocks";
```

✅ **Use dynamic import e IS_DEV_BUILD**

```typescript
// ✅ CORRETO
if (IS_DEV_BUILD) {
  const mods = await import("@/mocks");
}
```

## 📚 Próximos Passos

1. Refatorar `categories.ts` para seguir novo padrão
2. Criar service layer para `newsletter`
3. Adicionar mais documentação inline
4. Criar exemplos de testes
5. Adicionar validação de rotas com tipos

## 🔗 Referências

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod Documentation](https://zod.dev/)
- [Axios Documentation](https://axios-http.com/)
- **[UTILITY_FUNCTIONS.md](./UTILITY_FUNCTIONS.md)** - Funções utilitárias globais ⭐
