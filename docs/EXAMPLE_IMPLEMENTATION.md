# Exemplo Prático: Implementando uma Feature Completa

Este documento mostra passo a passo como implementar uma nova feature no projeto seguindo a arquitetura definida.

## 📝 Exemplo: Sistema de Comentários

Vamos implementar um sistema onde usuários podem adicionar comentários a notícias.

---

## ⚠️ Anti-Patterns Comuns - EVITE!

Antes de começar, esteja ciente destes erros comuns:

### ❌ NÃO FAÇA: Reimplementar lógica de data source manualmente

```typescript
// ❌ ERRADO - Duplica 100+ linhas de lógica já existente
export const myService = async () => {
  const mode = resolveDataSourceMode();
  const hasMocks = hasMocksDirectory();

  if (mode === "mock") {
    if (!hasMocks) throw new Error("...");
    return loadMyMock();
  }

  const apiReady = await checkApiReadiness(1500);
  // ... mais 80 linhas de boilerplate ...
};
```

### ✅ FAÇA: Use os service helpers

```typescript
// ✅ CORRETO - 5 linhas usando helpers existentes
export const myService = async () => {
  return createDevGetService({
    endpoint: "/my-data",
    mockLoader: (mocks) => mocks.MY_DATA_MOCK,
  });
};
```

### ❌ NÃO FAÇA: Duplicar utilitários existentes

Antes de escrever qualquer função auxiliar, verifique:

- **[UTILITY_FUNCTIONS.md](./UTILITY_FUNCTIONS.md)** - Catálogo completo de utilitários
- `src/api/utils/` - Helpers para services
- `src/api/connection/http.ts` - HTTP e data source
- `src/api/mocks.ts` - Mock loading
- `src/utils/` - Formatação, paginação, rotas

### ⚡ Regra de Ouro

**Se você está escrevendo mais de 30 linhas em um `.dev.ts`, provavelmente está duplicando código existente!**

---

## Passo 1: Definir Schema (src/api/schemas/comments.ts)

```typescript
import { z } from "zod";

// Schema para criação de comentário (request)
export const CreateCommentSchema = z.object({
  postId: z.string().uuid("ID da postagem inválido"),
  author: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  content: z.string().min(10, "Comentário deve ter no mínimo 10 caracteres"),
});

// Schema client-side com mensagens mais amigáveis
export const CreateCommentClientSchema = z.object({
  postId: z.string().uuid("ID da postagem inválido"),
  author: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(50, "Nome muito longo"),
  content: z
    .string()
    .min(1, "Comentário é obrigatório")
    .min(10, "Comentário muito curto")
    .max(500, "Comentário muito longo"),
});

// Schema de resposta
export const CommentSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  author: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

export const CreateCommentResponseSchema = z.object({
  success: z.boolean(),
  comment: CommentSchema.optional(),
  message: z.string().optional(),
});

// Tipos
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;
export type CommentDto = z.infer<typeof CommentSchema>;
export type CreateCommentResponseDto = z.infer<
  typeof CreateCommentResponseSchema
>;
```

---

## Passo 2: Criar Mocks (src/mocks/comments.ts)

```typescript
import type { CommentDto } from "@/api/schemas/comments";

export const COMMENTS_MOCK: CommentDto[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    postId: "post-1",
    author: "João Silva",
    content: "Ótimo artigo! Muito informativo.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    postId: "post-1",
    author: "Maria Santos",
    content: "Concordo plenamente com os pontos levantados.",
    createdAt: new Date().toISOString(),
  },
];

export const CREATE_COMMENT_SUCCESS_MOCK = {
  success: true,
  message: "Comentário adicionado com sucesso!",
  comment: {
    id: "550e8400-e29b-41d4-a716-446655440002",
    postId: "post-1",
    author: "Novo Usuário",
    content: "Comentário de teste",
    createdAt: new Date().toISOString(),
  },
};
```

**Não esquecer de exportar em `src/mocks/index.ts`:**

```typescript
export * from "./comments";
```

---

## Passo 3: Adicionar Rota em routes.ts

```typescript
// src/api/routes.ts
export const routes = {
  // ... rotas existentes
  comments: {
    create: joinRoute(API_PREFIX, "comments"),
    list: joinRoute(API_PREFIX, "comments"),
  },
} as const;
```

---

## Passo 4: Criar Service - Produção (src/api/services/comments.ts)

```typescript
import { api } from "@/api/connection/http";
import {
  CreateCommentResponseSchema,
  type CreateCommentDto,
  type CreateCommentResponseDto,
  type CommentDto,
  CommentSchema,
} from "@/api/schemas/comments";
import { IS_DEV_BUILD } from "@/config/buildTarget";

/**
 * Cria um novo comentário
 */
export const createComment = async (
  data: CreateCommentDto,
): Promise<CreateCommentResponseDto> => {
  if (IS_DEV_BUILD) {
    const mod = await import("./comments.dev");
    return mod.createComment(data);
  }

  const response = await api.post("/comments", data);
  return CreateCommentResponseSchema.parse(response.data);
};

/**
 * Lista comentários de uma postagem
 */
export const getComments = async (postId: string): Promise<CommentDto[]> => {
  if (IS_DEV_BUILD) {
    const mod = await import("./comments.dev");
    return mod.getComments(postId);
  }

  const response = await api.get(`/comments?postId=${postId}`);
  return CommentSchema.array().parse(response.data);
};
```

---

## Passo 5: Criar Service - Dev (src/api/services/comments.dev.ts)

✅ **USANDO SERVICE HELPERS (Padrão Recomendado)**

```typescript
import {
  createDevPostService,
  createDevGetService,
} from "@/api/utils/serviceHelpers";
import type {
  CreateCommentDto,
  CreateCommentResponseDto,
  CommentDto,
} from "@/api/schemas/comments";

/**
 * Cria um novo comentário
 * Usa helper que gerencia API vs mocks automaticamente
 */
export const createComment = async (
  data: CreateCommentDto,
): Promise<CreateCommentResponseDto> => {
  return createDevPostService({
    endpoint: "/comments",
    data,
    mockLoader: (mocks) => mocks.CREATE_COMMENT_SUCCESS_MOCK,
  });
};

/**
 * Lista comentários de uma postagem
 * Usa helper para GET requests
 */
export const getComments = async (postId: string): Promise<CommentDto[]> => {
  return createDevGetService({
    endpoint: `/comments?postId=${postId}`,
    mockLoader: (mocks) =>
      (mocks.COMMENTS_MOCK || []).filter(
        (c: CommentDto) => c.postId === postId,
      ),
  });
};
```

> 📝 **Nota Importante**: Os `serviceHelpers` eliminam ~100 linhas de código boilerplate por service.  
> Eles encapsulam toda a lógica de gerenciamento de data source (api/mock/auto) usando `requestByDataSourceMode()`.  
> **Nunca** reimplemente manualmente a lógica de resolução de data source - sempre use os helpers!

---

## Passo 6: Criar API Route (src/app/api/comments/route.ts)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/api/connection/http";
import { CreateCommentSchema, CommentSchema } from "@/api/schemas/comments";
import { loadMocks } from "@/api/mocks";
import { getDataSourceStatus } from "@/api/services/dataSourceStatus";

/**
 * POST /api/comments - Criar comentário
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = CreateCommentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const status = await getDataSourceStatus();

    if (String(status.reason).includes("mock")) {
      const mocks = loadMocks();
      return NextResponse.json(
        mocks?.CREATE_COMMENT_SUCCESS_MOCK || { success: true },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    // Chama API externa
    const response = await api.post("/comments", result.data);
    return NextResponse.json(response.data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao processar solicitação" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/comments?postId=xxx - Listar comentários
 */
export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      { error: "postId é obrigatório" },
      { status: 400 },
    );
  }

  try {
    const status = await getDataSourceStatus();

    if (String(status.reason).includes("mock")) {
      const mocks = loadMocks();
      const comments = (mocks?.COMMENTS_MOCK || []).filter(
        (c: any) => c.postId === postId,
      );
      return NextResponse.json(comments, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    // Chama API externa
    const response = await api.get(`/comments?postId=${postId}`);
    return NextResponse.json(response.data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Erro ao listar comentários:", error);
    return NextResponse.json([], { status: 200 });
  }
}
```

---

## Passo 7: Criar Componente Client

```typescript
// src/app/components/client/CommentForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  CreateCommentClientSchema,
  type CreateCommentDto,
} from "@/api/schemas/comments";
import { routes } from "@/api/routes";

type CommentFormData = CreateCommentDto;

interface CommentFormProps {
  postId: string;
  onSuccess?: () => void;
}

export default function CommentForm({ postId, onSuccess }: CommentFormProps) {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(CreateCommentClientSchema),
    defaultValues: { postId },
  });

  async function onSubmit(data: CommentFormData) {
    try {
      setSubmitStatus({ type: null, message: "" });

      const response = await fetch(routes.comments.create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao enviar comentário");
      }

      setSubmitStatus({
        type: "success",
        message: result.message || "Comentário enviado com sucesso!",
      });

      reset();
      onSuccess?.();
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Erro ao enviar comentário",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("postId")} value={postId} />

      <div>
        <input
          {...register("author")}
          placeholder="Seu nome"
          disabled={isSubmitting}
          className="w-full p-2 border rounded"
        />
        {errors.author && (
          <p className="text-red-500 text-sm">{errors.author.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register("content")}
          placeholder="Seu comentário"
          disabled={isSubmitting}
          rows={4}
          className="w-full p-2 border rounded"
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? "Enviando..." : "Enviar Comentário"}
      </button>

      {submitStatus.type && (
        <div
          className={`p-3 rounded ${
            submitStatus.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {submitStatus.message}
        </div>
      )}
    </form>
  );
}
```

---

## Passo 8: Usar em Server Component

```typescript
// src/app/posts/[id]/page.tsx
import { getComments } from "@/api/services/comments";
import CommentForm from "@/app/components/client/CommentForm";

export default async function PostPage({ params }: { params: { id: string } }) {
  // Server-side: usa service diretamente
  const comments = await getComments(params.id);

  return (
    <div>
      <h1>Post {params.id}</h1>

      <section>
        <h2>Comentários ({comments.length})</h2>
        {comments.map((comment) => (
          <div key={comment.id} className="border p-4 my-2">
            <strong>{comment.author}</strong>
            <p>{comment.content}</p>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </section>

      <section>
        <h2>Adicionar Comentário</h2>
        <CommentForm postId={params.id} />
      </section>
    </div>
  );
}
```

---

## ✅ Checklist Final

- [x] Schema criado com validação Zod
- [x] Schema client-side com mensagens amigáveis
- [x] Tipos exportados (Dto)
- [x] Mocks criados e exportados
- [x] Rota adicionada em routes.ts
- [x] Service .ts (produção)
- [x] Service .dev.ts (mocks + fallback)
- [x] API Route com GET/POST
- [x] Validação server-side
- [x] Tratamento de erros
- [x] Cache control configurado
- [x] Componente client usa zodResolver
- [x] Componente usa routes.ts
- [x] Server component usa service
- [x] Documentação inline

---

## 🎯 Resultado

Agora você tem uma feature **completa e padronizada**:

- ✅ Type-safe em toda a stack
- ✅ Validação consistente (client + server)
- ✅ Suporte a mocks para desenvolvimento
- ✅ Fallback automático quando API falha
- ✅ Separação clara de responsabilidades
- ✅ Fácil de testar e manter
