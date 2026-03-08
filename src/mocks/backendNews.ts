import type { HomeSectionItem } from "./homeFactory";
import { createCreatedAtFromMinutesAgo } from "@/utils/date";
import { summarizeHtmlToDescription } from "./homeFactory";

const BACKEND_SEEDS = [
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Node.js 22: filas, retries e idempotência para APIs",
    // Description will be generated from `notice` by homeFactory
    Creator: "backendjoao",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(600),
    CommentsCount: 8,
    isSubscriber: false,
    Slug: "/node22-filas-retries-idempotencia",
    notice: `
      <article>
        <header>
          <h1>Node.js 22: filas, retries e idempotência para APIs</h1>
          <p><small>Por backendjoao • Backend • Atualizado</small></p>
        </header>
        <p>O lançamento do Node.js 22 traz melhorias significativas para arquiteturas de APIs, incluindo recursos avançados para lidar com filas, estratégias de retry e garantias de idempotência. Neste artigo, exploramos padrões operacionais, cenários de falha e exemplos práticos de implementação.</p>
        <h2>Filas e processamento assíncrono</h2>
        <p>Descrevemos como projetar filas para reprocessamento e como evitar duplicidade de mensagens usando idempotência aplicada ao nível da aplicação.</p>
        <h2>Retries inteligentes</h2>
        <p>Apresentamos políticas de retry com backoff exponencial e jitter para reduzir o impacto em picos de latência.</p>
        <p>Conclusão: combinando essas práticas, APIs críticas alcançam maior resiliência sem comprometer consistência.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "backendjoao — engenheiro backend",
    socialMediasCreator: [
      { type: "twitter", url: "https://twitter.com/backendjoao" },
    ],
    commentsNotice: [
      {
        imgProfile: "/images/Nicholas-Emery.png",
        nameProfile: "backendjoao",
        createdAtComment: createCreatedAtFromMinutesAgo(590),
        comment: "Comentário de exemplo sobre Node.js 22",
        replyComments: [],
      },
    ],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "NestJS modular: domínio, aplicação e infraestrutura",
    // Description will be generated from `notice` by homeFactory
    Creator: "apiclara",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(637),
    CommentsCount: 9,
    isSubscriber: false,
    Slug: "/nestjs-modular-dominio-aplicacao-infra",
    notice: `
      <article>
        <header><h1>NestJS modular: domínio, aplicação e infraestrutura</h1></header>
        <p>Abordamos uma abordagem modular para projetos NestJS, separando camadas de domínio, aplicação e infraestrutura com exemplos de módulos, interfaces e injeção de dependência.</p>
        <p>Inclui exemplos de organização de pacotes e testes de integração.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "apiclara — arquiteta de APIs",
    socialMediasCreator: [
      { type: "github", url: "https://github.com/apiclara" },
    ],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Segurança em APIs públicas com OAuth2 e scopes",
    // Description will be generated from `notice` by homeFactory
    Creator: "secgabriel",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(674),
    CommentsCount: 7,
    isSubscriber: false,
    Slug: "/seguranca-apis-oauth2-scopes",
    notice: `
      <article>
        <header><h1>Segurança em APIs públicas com OAuth2 e scopes</h1></header>
        <p>Este artigo descreve práticas de autenticação e autorização com OAuth2, modelos de scopes finos e validação de tokens em gateways.</p>
        <p>Inclui exemplos de políticas de cache e rotação de chaves.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "secgabriel — especialista em segurança",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Cache distribuído com Redis para reduzir p95",
    // Description will be generated from `notice` by homeFactory
    Creator: "backendjoao",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(711),
    CommentsCount: 12,
    isSubscriber: false,
    Slug: "/cache-distribuido-redis-p95",
    notice: `
      <article>
        <header><h1>Cache distribuído com Redis para reduzir p95</h1></header>
        <p>Analisamos estratégias de cache warming, invalidação e uso de expiração por domínio para reduzir latências de p95 em endpoints críticos.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "backendjoao — engenheiro backend",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Versionamento de contratos com compatibilidade retroativa",

    Creator: "apiclara",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(748),
    CommentsCount: 5,
    isSubscriber: false,
    Slug: "/versionamento-contratos-retrocompatibilidade",
    notice: `
      <article>
        <header>
          <h1>Versionamento de contratos com compatibilidade retroativa</h1>
          <p><small>Por apiclara • Backend • Atualizado</small></p>
        </header>
        <figure style="text-align:center;margin:12px 0">
          <img src="/images/imageScience.png" alt="versionamento" style="max-width:100%;border-radius:6px;" />
          <figcaption style="font-size:12px;color:#666">Fluxo de versionamento de contratos</figcaption>
        </figure>
        <p style="line-height:1.6">Neste artigo explicamos como aplicar versionamento sem quebrar clientes existentes, combinando práticas de feature flags, compatibilidade retroativa e testes de contrato.</p>
        <h2>Princípios</h2>
        <p>Adote convenções semânticas, use versões de API no cabeçalho e documente mudanças em changelogs automatizados.</p>
        <h3>Estratégias</h3>
        <ul>
          <li>Adição de campos opcionais</li>
          <li>Depreciação com comunicação prévia</li>
          <li>Migração com adapter layer</li>
        </ul>
        <p style="background:#f8f9fa;padding:10px;border-left:4px solid #e0e0e0">Leia também: <a href="https://example.com/versioning" style="color:#1a73e8">Guia completo de versionamento</a></p>
        <p>Conclusão: com processos e testes de contrato automatizados, você minimiza riscos ao evoluir APIs.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "apiclara — arquiteta de APIs",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Outbox pattern para consistência em eventos",

    Creator: "backendjoao",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(785),
    CommentsCount: 6,
    isSubscriber: false,
    Slug: "/outbox-pattern-consistencia-eventos",
    notice: `
      <article>
        <header><h1>Outbox pattern para consistência em eventos</h1></header>
        <p>O outbox pattern é uma técnica para garantir entrega consistente de eventos junto com a operação de banco de dados.</p>
        <h2>Como funciona</h2>
        <p>Registre o evento em uma tabela outbox na mesma transação e processe com um worker que publica no broker.</p>
        <h3>Benefícios</h3>
        <ol>
          <li>Consistência entre escrita e publicação</li>
          <li>Facilidade de retry e auditoria</li>
        </ol>
        <p><img src="/images/imageScience.png" alt="outbox" style="max-width:100%"/></p>
        <p style="font-size:14px">Referência: <a href="https://example.com/outbox">Implementando Outbox</a></p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "backendjoao — engenheiro backend",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "CQRS pragmático para equipes pequenas",

    Creator: "apiclara",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(822),
    CommentsCount: 4,
    isSubscriber: false,
    Slug: "/cqrs-pragmatico-equipes-pequenas",
    notice: `
      <article>
        <header><h1>CQRS pragmático para equipes pequenas</h1></header>
        <p>CQRS pode ser adaptado com simplicidade: separe comandos e consultas onde fizer sentido, sem introduzir complexidade desnecessária.</p>
        <h2>Quando aplicar</h2>
        <p>Use CQRS para domínios com alta contensão de leitura/escrita ou requisitos distintos de escalabilidade.</p>
        <p style="background:#fff3cd;padding:10px;border-left:4px solid #ffeeba">Dica: comece com um read model simples antes de migrar toda a camada.</p>
        <h3>Exemplo</h3>
        <p>Código de pseudo-exemplo e diagrama da separação de responsabilidades.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "apiclara — arquiteta de APIs",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Rate limiting e quotas por plano de API",
    Creator: "secgabriel",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(859),
    CommentsCount: 11,
    isSubscriber: false,
    Slug: "/rate-limiting-quotas-api",
    notice: `
      <article>
        <header><h1>Rate limiting e quotas por plano de API</h1></header>
        <p>Implementar limites por plano reduz abuso e protege recursos. Apresentamos estratégias token-bucket, sliding window e contadores distribuídos.</p>
        <h2>Implementação</h2>
        <p>Combine cache (Redis) com middlewares e métricas por cliente.</p>
        <p style="font-size:13px"><a href="https://example.com/rate-limiting">Leia o guia</a></p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "secgabriel — especialista em segurança",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Monitoramento de jobs assíncronos em produção",

    Creator: "backendjoao",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(896),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "/monitoramento-jobs-assincronos",
    notice: `
      <article>
        <header><h1>Monitoramento de jobs assíncronos em produção</h1></header>
        <p>Estratégias para garantir visibilidade e SLAs em pipelines assíncronos, com métricas de latência, retries e DLQ.</p>
        <h2>Métricas importantes</h2>
        <ul>
          <li>Taxa de sucesso</li>
          <li>Tempo até conclusão</li>
          <li>Dead-letter count</li>
        </ul>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "backendjoao — engenheiro backend",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Políticas de retry com jitter e circuit breaker",

    Creator: "apiclara",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(933),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "/retry-jitter-circuit-breaker",
    notice: `
      <article>
        <header><h1>Políticas de retry com jitter e circuit breaker</h1></header>
        <p>Apresentamos padrões para retries que evitam thundering herd usando jitter e integração com circuit breakers para escalonamento seguro.</p>
        <h2>Configurações recomendadas</h2>
        <p>Backoff exponencial com jitter e limites de tentativa por operação.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "apiclara — arquiteta de APIs",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Schema validation para payloads externos",

    Creator: "secgabriel",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(970),
    CommentsCount: 7,
    isSubscriber: false,
    Slug: "/schema-validation-payloads",
    notice: `
      <article>
        <header><h1>Schema validation para payloads externos</h1></header>
        <p>Validação de contratos externos previne erros e protege processos downstream. Use ferramentas como JSON Schema e ajv para validação em massa.</p>
        <h3>Boas práticas</h3>
        <ul>
          <li>Fail fast</li>
          <li>Logs estruturados</li>
          <li>Versionamento de schemas</li>
        </ul>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "secgabriel — especialista em segurança",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Persistência multi-tenant com isolamento seguro",

    Creator: "backendjoao",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(1007),
    CommentsCount: 6,
    isSubscriber: false,
    Slug: "/persistencia-multi-tenant",
    notice: `
      <article>
        <header><h1>Persistência multi-tenant com isolamento seguro</h1></header>
        <p>Exploramos modelos de arquitetura multi-tenant: schemas por tenant, colunas por tenant e bancos separados, avaliando trade-offs de isolamento e custo.</p>
        <h2>Considerações</h2>
        <p>Segurança, performance e operações de manutenção são fatores chave na escolha do modelo.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "backendjoao — engenheiro backend",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Estratégias de observabilidade orientadas a domínio",

    Creator: "apiclara",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(1044),
    CommentsCount: 5,
    isSubscriber: false,
    Slug: "/observabilidade-orientada-dominio",
    notice: `
      <article>
        <header><h1>Estratégias de observabilidade orientadas a domínio</h1></header>
        <p>Como mapear métricas e traces para limites de domínio, usando OpenTelemetry e dashboards por domínio de negócio.</p>
        <h3>Mapa de telemetria</h3>
        <p>Defina eventos, spans e métricas alinhadas ao domínio.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "apiclara — arquiteta de APIs",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Webhooks resilientes com deduplicação",

    Creator: "backendjoao",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(1081),
    CommentsCount: 4,
    isSubscriber: false,
    Slug: "/webhooks-resilientes-deduplicacao",
    notice: `
      <article>
        <header><h1>Webhooks resilientes com deduplicação</h1></header>
        <p>Padronize headers de idempotência, implemente armazenamento temporário e verificação de assinaturas para garantir entrega segura e idempotente.</p>
        <h2>Implementação</h2>
        <p>Use consumidores com dedup keys e filas com retry configurado.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "backendjoao — engenheiro backend",
    socialMediasCreator: [],
    commentsNotice: [],
  },
];

export const BACKEND_NEWS_MOCK: HomeSectionItem[] = BACKEND_SEEDS.map((s) => ({
  ...s,
  Description: summarizeHtmlToDescription(s.notice),
}));
