# Documentação do Projeto - Newsly Portal Frontend

Este diretório contém toda a documentação de arquitetura, padrões e guias do projeto.

## 📚 Índice de Documentos

### 🎯 **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)**

**Comece aqui!** Guia rápido com tudo que você precisa saber:

- Checklist de nova feature
- Estrutura de pastas
- Padrões de nomenclatura
- Data source modes
- Anti-padrões

**Recomendado para**: Referência rápida no dia a dia

---

### 🏗️ **[ARCHITECTURE.md](./ARCHITECTURE.md)**

Documentação completa da arquitetura do projeto:

- Visão geral e camadas
- Fluxo de dados detalhado
- Estrutura de pastas completa
- Template de implementação
- Melhores práticas

**Recomendado para**: Entender a arquitetura profundamente

---

### 📝 **[SCHEMAS_ARCHITECTURE.md](./SCHEMAS_ARCHITECTURE.md)**

Padrão de organização dos schemas Zod:

- Estrutura de schemas por domínio
- Convenções de nomenclatura
- Variações Client/Server
- Schemas existentes
- Checklist de novos schemas

**Recomendado para**: Trabalhar com validação Zod

---

### 💡 **[EXAMPLE_IMPLEMENTATION.md](./EXAMPLE_IMPLEMENTATION.md)**

Exemplo prático completo (Sistema de Comentários):

- Passo a passo com código
- Todos os arquivos necessários
- Server e Client components
- Mocks, services, routes, schemas
- Checklist de implementação

**Recomendado para**: Implementar nova feature pela primeira vez

---

### 🔧 **[UTILITY_FUNCTIONS.md](./UTILITY_FUNCTIONS.md)**

Catálogo completo de funções utilitárias do projeto:

- Service Helpers (createDevService, createDevGetService, createDevPostService)
- Mock Utilities (loadMocks, hasMocksDirectory)
- HTTP/Data Source (api, requestByDataSourceMode, checkApiReadiness)
- Paginação (parsePaginationParams, paginateArray)
- Formatação (formatCreatedAtDisplay, buildCreatorRoute)
- Exemplos de uso e anti-patterns

**Recomendado para**: Evitar duplicação de código e reutilizar utilidades

---

### 📋 **[CHANGELOG_ARCHITECTURE.md](./CHANGELOG_ARCHITECTURE.md)**

Histórico de mudanças na arquitetura:

- Implementações realizadas
- Service Helpers e otimizações
- Documentação criada
- Próximos passos

**Recomendado para**: Entender o histórico de decisões arquiteturais

---

## 🚀 Fluxo de Trabalho Recomendado

### Para implementar uma nova feature:

1. **Leia**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - 5 minutos
2. **Verifique**: [UTILITY_FUNCTIONS.md](./UTILITY_FUNCTIONS.md) - Funções reutilizáveis disponíveis
3. **Siga**: Checklist no Quick Reference
4. **Consulte**: [EXAMPLE_IMPLEMENTATION.md](./EXAMPLE_IMPLEMENTATION.md) se precisar de exemplos
5. **Veja**: [SCHEMAS_ARCHITECTURE.md](./SCHEMAS_ARCHITECTURE.md) para schemas
6. **Aprofunde**: [ARCHITECTURE.md](./ARCHITECTURE.md) se tiver dúvidas arquiteturais

### Para entender o projeto:

1. **Início**: [ARCHITECTURE.md](./ARCHITECTURE.md) - visão geral
2. **Schemas**: [SCHEMAS_ARCHITECTURE.md](./SCHEMAS_ARCHITECTURE.md)
3. **Utilities**: [UTILITY_FUNCTIONS.md](./UTILITY_FUNCTIONS.md) - funções globais
4. **Prática**: [EXAMPLE_IMPLEMENTATION.md](./EXAMPLE_IMPLEMENTATION.md)
5. **Referência**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### Antes de escrever código:

⚠️ **REGRA DE OURO**: Sempre verifique [UTILITY_FUNCTIONS.md](./UTILITY_FUNCTIONS.md) antes de implementar qualquer lógica auxiliar. Se você está escrevendo mais de 30 linhas em um `.dev.ts`, provavelmente está duplicando código existente!

---

## 📖 Convenções do Projeto

### Estrutura em Camadas

```
UI (Components)
    ↓
Services (Business Logic)
    ↓
API Routes (Proxy)
    ↓
External API / Mocks
```

### Arquivos por Feature

```
feature/
├── src/api/schemas/feature.ts          # Validação
├── src/api/services/feature.ts         # Lógica (prod)
├── src/api/services/feature.dev.ts     # Lógica (dev)
├── src/app/api/feature/route.ts        # HTTP Handler
├── src/mocks/feature.ts                # Dados mock
└── src/app/components/.../Feature.tsx  # UI
```

### Nomenclatura Padrão

| Tipo          | Padrão               | Exemplo                           |
| ------------- | -------------------- | --------------------------------- |
| Schema        | `<Nome>Schema`       | `NewsletterSubscribeSchema`       |
| Schema Client | `<Nome>ClientSchema` | `NewsletterSubscribeClientSchema` |
| Tipo          | `<Nome>Dto`          | `NewsletterSubscribeDto`          |
| Service Prod  | `<dominio>.ts`       | `newsletter.ts`                   |
| Service Dev   | `<dominio>.dev.ts`   | `newsletter.dev.ts`               |
| API Route     | `/api/<dominio>`     | `/api/newsletter`                 |
| Mock          | `<NOME>_MOCK`        | `NEWSLETTER_SUBSCRIBERS_MOCK`     |

---

## 🔧 Configuração de Ambiente

### Variáveis Importantes

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEWSLY_DATA_SOURCE=auto  # ou 'api', 'mock'
```

### Data Source Modes

- **`api`**: Produção - só API externa
- **`mock`**: Dev - só mocks locais
- **`auto`**: Dev - API com fallback para mocks (recomendado)

---

## ✅ Checklist Rápida

Ao adicionar nova feature, verifique:

- [ ] Schema criado em `src/api/schemas/`
- [ ] Mock criado em `src/mocks/` e exportado
- [ ] Rota adicionada em `src/api/routes.ts`
- [ ] Service `.ts` criado (produção)
- [ ] Service `.dev.ts` criado (dev)
- [ ] API Route criada em `src/app/api/`
- [ ] Componente criado (client ou server)
- [ ] Validação Zod implementada
- [ ] Tratamento de erros adequado
- [ ] Type safety garantido
- [ ] Cache control configurado (API routes)

---

## 🚫 Anti-Padrões (Evite!)

| ❌ Evite                       | ✅ Use                          |
| ------------------------------ | ------------------------------- |
| `fetch(API_URL)` em componente | Service layer                   |
| Schema inline                  | `src/api/schemas/`              |
| `"/api/newsletter"` hardcoded  | `routes.newsletter`             |
| Import mocks em prod           | Dynamic import + `IS_DEV_BUILD` |
| Lógica de data source em UI    | Services gerenciam isso         |

---

## 📞 Precisa de Ajuda?

1. **Dúvida rápida?** → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
2. **Implementando feature?** → [EXAMPLE_IMPLEMENTATION.md](./EXAMPLE_IMPLEMENTATION.md)
3. **Dúvida de arquitetura?** → [ARCHITECTURE.md](./ARCHITECTURE.md)
4. **Schemas Zod?** → [SCHEMAS_ARCHITECTURE.md](./SCHEMAS_ARCHITECTURE.md)

---

## 🔄 Mantendo a Documentação

Ao adicionar novas features ou padrões:

1. Atualize o documento relevante
2. Adicione exemplos se necessário
3. Atualize este README se for algo novo
4. Mantenha consistência com padrões existentes

---

**Última atualização**: 7 de março de 2026

**Versão da arquitetura**: 1.0.0
