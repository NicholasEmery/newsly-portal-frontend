# Guia Rápido de Arquitetura

## 🚀 Início Rápido

### Para Adicionar Nova Feature

1. **Schema** → `src/api/schemas/<dominio>.ts`
2. **Mock** → `src/mocks/<dominio>.ts` + export em `index.ts`
3. **Rota** → Adicionar em `src/api/routes.ts`
4. **Service** → `src/api/services/<dominio>.ts` + `.dev.ts`
5. **API Route** → `src/app/api/<dominio>/route.ts`
6. **Componente** → `src/app/components/client/` ou `server/`

### Fluxo de Dados

```
Server Component → Service → API Route Next.js → API Externa
                                     ↓
                                   Mocks (dev)
```

```
Client Component → fetch(route) → API Route Next.js → API Externa
                                         ↓
                                       Mocks (dev)
```

## 📂 Estrutura Rápida

```
src/
├── api/
│   ├── schemas/          # Zod schemas (validação)
│   ├── services/         # Business logic
│   │   ├── *.ts         # Produção
│   │   └── *.dev.ts     # Dev + mocks
│   ├── connection/       # HTTP client (Axios)
│   ├── routes.ts         # Rotas constantes
│   └── mocks.ts          # Mock utilities
│
├── app/
│   ├── api/             # Next.js API routes
│   └── components/
│       ├── client/      # "use client"
│       └── server/      # Server components
│
└── mocks/               # Dados mockados (dev)
```

## 🎯 Padrões de Nomenclatura

### Schemas

- `<Nome>Schema` - validação server
- `<Nome>ClientSchema` - validação client
- `<Nome>Dto` - tipo inferido

### Services

- `<dominio>.ts` - produção
- `<dominio>.dev.ts` - dev + mocks

### API Routes

- `src/app/api/<dominio>/route.ts`

### Mocks

- `<NOME>_MOCK` - constante
- Sempre plural para arrays

## 🔧 Data Source Modes

```.env.local
NEWSLY_DATA_SOURCE=auto  # api | mock | auto
```

- **api**: Só API externa (produção)
- **mock**: Só mocks (dev offline)
- **auto**: API com fallback para mocks (dev)

## ✅ Checklist de Feature

- [ ] Schema em `schemas/`
- [ ] Tipos exportados (`*Dto`)
- [ ] Mock em `mocks/` + export
- [ ] Rota em `routes.ts`
- [ ] Service `.ts` + `.dev.ts`
- [ ] API Route em `app/api/`
- [ ] Validação Zod
- [ ] Cache control
- [ ] Tratamento de erros
- [ ] Componente usa `routes.ts`

## 📚 Documentos Completos

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura completa
- **[SCHEMAS_ARCHITECTURE.md](./SCHEMAS_ARCHITECTURE.md)** - Padrões Zod
- **[EXAMPLE_IMPLEMENTATION.md](./EXAMPLE_IMPLEMENTATION.md)** - Exemplo prático

## 🚫 Anti-Padrões

❌ Fetch direto da API externa em componentes
❌ Schemas inline
❌ Hardcoded routes (`"/api/something"`)
❌ Import de mocks em código de produção
❌ Lógica de data source em componentes

✅ Use services
✅ Centralize schemas
✅ Use `routes.ts`
✅ Use `IS_DEV_BUILD` e dynamic import
✅ Deixe services gerenciarem data source
