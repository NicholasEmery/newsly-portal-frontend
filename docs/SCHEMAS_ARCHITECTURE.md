# Padrão de Arquitetura - Schemas Zod

## 📁 Estrutura de Schemas

Todos os schemas de validação Zod devem ser centralizados na pasta:

```
src/api/schemas/
```

## 📋 Convenções

### 1. **Organização por Domínio**

Cada arquivo de schema deve representar um domínio ou entidade:

- `newsletter.ts` - Schemas relacionados a newsletter
- `system.ts` - Schemas de sistema, health checks, status
- `categories.ts` - Schemas de categorias
- `homepage.ts` - Schemas de seções da homepage

### 2. **Nomenclatura**

- **Schema**: Use sufixo `Schema` (ex: `NewsletterSubscribeSchema`)
- **Tipos**: Exporte tipos inferidos com sufixo `Dto` (ex: `NewsletterSubscribeDto`)

```typescript
export const NewsletterSubscribeSchema = z.object({
  email: z.string().email("Endereço de email inválido"),
});

export type NewsletterSubscribeDto = z.infer<typeof NewsletterSubscribeSchema>;
```

### 3. **Variações Client/Server**

Quando houver diferença entre validação client-side e server-side:

```typescript
// Server-side - mensagens básicas
export const NewsletterSubscribeSchema = z.object({
  email: z.string().email("Endereço de email inválido"),
});

// Client-side - mensagens mais detalhadas para UX
export const NewsletterSubscribeClientSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Digite um email válido"),
});
```

## 🔄 Uso nos Componentes e Rotas

### Client Components

```typescript
import { NewsletterSubscribeClientSchema } from "@/api/schemas/newsletter";
import { zodResolver } from "@hookform/resolvers/zod";

const { register } = useForm({
  resolver: zodResolver(NewsletterSubscribeClientSchema),
});
```

### API Routes

```typescript
import { NewsletterSubscribeSchema } from "@/api/schemas/newsletter";

const result = NewsletterSubscribeSchema.safeParse(body);
```

## 📦 Schemas Existentes

### `newsletter.ts`

- `NewsletterSubscribeSchema` - Validação server-side
- `NewsletterSubscribeClientSchema` - Validação client-side

### `system.ts`

- `ApiHealthSchema` - Health check da API
- `ApiReadySchema` - Readiness check da API
- `ServiceUnavailableReasonSchema` - Motivos de indisponibilidade

### `categories.ts`

- `CategorySchema` - Schema de categoria individual
- `CategoriesSchema` - Array de categorias

### `homepage.ts`

- `HomeSectionItemSchema` - Item de seção da home
- `HomeSectionSchema` - Seção completa da home
- `TopNoticeSchema` - Notícia em destaque
- `TrendingItemSchema` - Item em trending
- `LatestNewsSectionSchema` - Seção de últimas notícias

## ✅ Checklist para Novos Schemas

- [ ] Criar schema no arquivo apropriado em `src/api/schemas/`
- [ ] Exportar o schema com sufixo `Schema`
- [ ] Exportar o tipo inferido com sufixo `Dto`
- [ ] Adicionar JSDoc se necessário
- [ ] Atualizar este documento se criar novo arquivo de schema
- [ ] Remover schemas inline de componentes/rotas
- [ ] Atualizar imports para usar schemas centralizados
