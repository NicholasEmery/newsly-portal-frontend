import type { HomeSectionItem } from "./homeFactory";
import { createCreatedAtFromMinutesAgo } from "@/utils/date";
import { summarizeHtmlToDescription } from "./homeFactory";

const CLOUD_SEEDS = [
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Arquitetura multi-ambiente na AWS com Terraform",
    Description: "Guia prático sobre arquitetura multi-ambiente...",
    Creator: "cloudleo",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(1800),
    CommentsCount: 6,
    isSubscriber: false,
    Slug: "/aws-terraform-multiambiente",
    notice: `
      <article>
        <header>
          <h1>Arquitetura multi-ambiente na AWS com Terraform</h1>
          <p><small>Por cloudleo • Cloud • Atualizado</small></p>
        </header>
        <p>Projetar ambientes multi-região requer módulos reutilizáveis, state management seguro e pipelines de teste que validem infraestrutura antes do rollout. Neste artigo detalhamos um padrão pragmatico para equipes que gerenciam múltiplos ambientes.</p>
        <h2>Módulos e organização</h2>
        <p>Separe módulos por responsabilidade (rede, compute, storage) e mantenha versões compatíveis para evitar quebrar consumidores.</p>
        <h2>State e testes</h2>
        <p>Use backends remotos com locking e pipelines que executem planos de forma automatizada em ambientes de staging antes da promoção.</p>
        <p style="text-align:center"><img src="/images/imageScience.png" alt="terraform-arch" style="max-width:100%"/></p>
        <p>Conclusão: automação e convenções reduzem erros operacionais e aceleram entregas.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "cloudleo — engenheiro de infraestrutura",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Custos em cloud: FinOps com dashboards por serviço",
    Description: "Guia prático sobre FinOps...",
    Creator: "finopsdani",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(1837),
    CommentsCount: 4,
    isSubscriber: false,
    Slug: "/finops-dashboards-por-servico",
    notice: `
      <article>
        <header>
          <h1>Custos em cloud: FinOps com dashboards por serviço</h1>
          <p><small>Por finopsdani • Cloud • Atualizado</small></p>
        </header>
        <p>Este artigo mostra como montar um dashboard de FinOps que correlacione custo por serviço, time e ambiente. Incluímos exemplos de queries, tags recomendadas e modelos de alocação de custo.</p>
        <h2>Práticas essenciais</h2>
        <ul>
          <li>Padronizar tags</li>
          <li>Coletar metadados de deployment</li>
          <li>Automatizar relatórios semanais</li>
        </ul>
        <p>Ferramentas: combine dados do provider com um BI para análises históricas e alertas de anomalia.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "finopsdani — especialista em FinOps",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Mensageria gerenciada com SQS e processamento resiliente",
    Description: "Guia prático sobre mensageria...",
    Creator: "cloudleo",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(1874),
    CommentsCount: 5,
    isSubscriber: false,
    Slug: "/sqs-processamento-resiliente",
    notice: `
      <article>
        <header><h1>Mensageria gerenciada com SQS e processamento resiliente</h1></header>
        <p>SQS é uma solução robusta para desacoplar produtores e consumidores. Abordamos estratégias de idempotência, DLQ e tuning de visibility timeout para garantir processamento confiável em picos.</p>
        <h2>Idempotência</h2>
        <p>Projete consumers para serem idempotentes e use chaves de deduplicação quando disponíveis para evitar efeitos colaterais duplicados.</p>
        <h3>Observabilidade</h3>
        <p>Monitore métricas de atraso, taxa de mensagens na DLQ e latência de processamento para detectar problemas cedo.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "cloudleo — engenheiro de infraestrutura",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Segurança em cloud com least privilege e auditoria contínua",
    Description: "Guia prático sobre segurança em cloud...",
    Creator: "secgabriel",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(1911),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "/least-privilege-auditoria-continua",
    notice: `
      <article>
        <header><h1>Segurança em cloud com least privilege e auditoria contínua</h1></header>
        <p>Minimizar privilégios e automatizar auditoria reduz risco de exposição. Neste texto apresentamos um checklist de práticas, exemplos de políticas e pipelines de auditoria.</p>
        <h2>Automação</h2>
        <p>Implemente regras que validem políticas durante PRs e pipelines que verifiquem drift de configuração regularmente.</p>
        <h3>Rotação de segredos</h3>
        <p>Automatize rotação e revogação de credenciais para reduzir janela de exposição.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "secgabriel — especialista em segurança",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Blueprints de infraestrutura para novos produtos",
    Description: "Guia prático sobre blueprints de infraestrutura...",
    Creator: "cloudleo",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(1948),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "/blueprints-infra-novos-produtos",
    notice: `
      <article>
        <header><h1>Blueprints de infraestrutura para novos produtos</h1></header>
        <p>Blueprints reduzem tempo de entrega de novos produtos ao oferecer estruturas comprovadas para rede, storage e observabilidade. Discutimos como parametrizar blueprints para diferentes perfis de produto.</p>
        <h2>Checklist</h2>
        <ul>
          <li>Rede e subnets</li>
          <li>Políticas de segurança</li>
          <li>Observabilidade e alertas</li>
        </ul>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "cloudleo — engenheiro de infraestrutura",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Observabilidade de custo por domínio de negócio",
    Description: "Guia prático sobre observabilidade de custo...",
    Creator: "finopsdani",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(1985),
    CommentsCount: 6,
    isSubscriber: false,
    Slug: "/observabilidade-custo-dominio",
    notice: `
      <article>
        <header><h1>Observabilidade de custo por domínio de negócio</h1></header>
        <p>Monitorar custo por domínio permite identificar desperdícios e otimizar alocação. Mostramos como correlacionar métricas de uso com billing e criar alertas de anomalia.</p>
        <h2>Modelos de análise</h2>
        <p>Agregue custo por tag de produto e compare com tráfego para detectar desvios.</p>
        <p>Inclui exemplos de queries e thresholds recomendados.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "finopsdani — especialista em FinOps",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Disaster recovery orientado a RTO e RPO",
    Description: "Guia prático sobre disaster recovery...",
    Creator: "secgabriel",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(2022),
    CommentsCount: 4,
    isSubscriber: false,
    Slug: "/disaster-recovery-rto-rpo",
    notice: `
      <article>
        <header><h1>Disaster recovery orientado a RTO e RPO</h1></header>
        <p>Definir RTO e RPO por serviço é crítico para priorizar investimentos em DR. Descrevemos abordagens de replicação de dados, orquestração de failover e testes periódicos de restauração.</p>
        <h2>Testes</h2>
        <p>Automatize drills e valide tempos de restauração contra objetivos de negócio.</p>
        <p style="font-size:13px">Incluímos checklist de DR e exemplos de runbooks.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "secgabriel — especialista em segurança",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Rede privada com segmentação de workloads",
    Description: "Guia prático sobre redes privadas...",
    Creator: "cloudleo",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(2059),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "/rede-privada-segmentacao-workloads",
    notice: `
      <article>
        <header><h1>Rede privada com segmentação de workloads</h1></header>
        <p>Segmentar workloads por zona de confiança reduz blast radius e melhora performance. Exploramos modelos de subnets, NACLs, security groups e políticas de comunicação entre workloads.</p>
        <h2>Modelos</h2>
        <p>Compare isolamento por VPC, por sub-rede e por microsegmentation para escolher a abordagem adequada.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "cloudleo — engenheiro de infraestrutura",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Estratégias de storage lifecycle para mídia",
    Description: "Guia prático sobre storage lifecycle...",
    Creator: "finopsdani",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(2096),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "/storage-lifecycle-midias",
    notice: `
      <article>
        <header><h1>Estratégias de storage lifecycle para mídia</h1></header>
        <p>Implementar lifecycle policies reduz custos e mantém performance. Descrevemos regras de tiering, compressão e expiração para ativos de mídia em portais.</p>
        <h2>Recomendações</h2>
        <ul>
          <li>Transição automática para arquivamento após período definido</li>
          <li>Compressão adaptativa por tipo de mídia</li>
        </ul>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "finopsdani — especialista em FinOps",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Controle de acesso federado para times globais",
    Description: "Guia prático sobre controle de acesso federado...",
    Creator: "secgabriel",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(2133),
    CommentsCount: 5,
    isSubscriber: false,
    Slug: "/acesso-federado-times-globais",
    notice: `
      <article>
        <header><h1>Controle de acesso federado para times globais</h1></header>
        <p>Identity federation, SSO e políticas de autorização são essenciais para times distribuídos. Fornecemos um roteiro para implementar fluxos seguros, compatíveis com SAML/OIDC e políticas centralizadas.</p>
        <h2>Arquitetura</h2>
        <p>Centralize identidade e delegue autorização via claims; mantenha logs de auditoria para conformidade.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "secgabriel — especialista em segurança",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Escalabilidade horizontal para picos de tráfego",
    Description: "Guia prático sobre escalabilidade horizontal...",
    Creator: "cloudleo",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(2170),
    CommentsCount: 6,
    isSubscriber: false,
    Slug: "/escalabilidade-horizontal-picos",
    notice: `
      <article>
        <header><h1>Escalabilidade horizontal para picos de tráfego</h1></header>
        <p>Este texto reúne práticas para dimensionar horizontalmente serviços durante picos: autoscaling baseado em métricas de negócio, cache efetivo e arquiteturas stateless.</p>
        <h2>Cache</h2>
        <p>Use caches na borda e caching por domínio para reduzir carga nos serviços origin.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "cloudleo — engenheiro de infraestrutura",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Tagging policy para governança financeira",
    Description: "Guia prático sobre tagging policy...",
    Creator: "finopsdani",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(2207),
    CommentsCount: 1,
    isSubscriber: false,
    Slug: "/tagging-policy-governanca-financeira",
    notice: `
      <article>
        <header><h1>Tagging policy para governança financeira</h1></header>
        <p>Tags padronizadas permitem rastrear despesas por produto e time. Este artigo mostra um esquema de tagging prático e como validar tags automaticamente durante deploys.</p>
        <h2>Validação</h2>
        <p>Automatize checagens em pipelines e aplique guardrails para impedir recursos sem tags obrigatórias.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "finopsdani — especialista em FinOps",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Segurança de segredos com rotação automatizada",
    Description: "Guia prático sobre segurança de segredos...",
    Creator: "secgabriel",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(2244),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "/segredos-rotacao-automatizada",
    notice: `
      <article>
        <header><h1>Segurança de segredos com rotação automatizada</h1></header>
        <p>Rotacionar segredos automaticamente reduz riscos de vazamento. Discutimos integração com cofres, pipelines de rotação e práticas para revogação rápida.</p>
        <h2>Integração</h2>
        <p>Automatize a atualização de segredos em serviços e minimize o tempo entre rotação e aplicação.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "secgabriel — especialista em segurança",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "CDN avançada para distribuição global de conteúdo",
    Description: "Guia prático sobre CDN avançada...",
    Creator: "cloudleo",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(2281),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "/cdn-distribuicao-global-conteudo",
    notice: `
      <article>
        <header><h1>CDN avançada para distribuição global de conteúdo</h1></header>
        <p>Uma CDN bem configurada reduz latência globalmente. Aqui cobrimos estratégias de cache, invalidation e execução de lógica na edge para personalização sem onerar origin.</p>
        <h2>Invalidation</h2>
        <p>Planeje políticas de invalidation para equilibrar custo e atualizações de conteúdo.</p>
        <p>Guia completo: <a href="https://example.com/cdn-guide">Guia de CDN</a></p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "cloudleo — engenheiro de infraestrutura",
    socialMediasCreator: [],
    commentsNotice: [],
  },
];

export const CLOUD_NEWS_MOCK: HomeSectionItem[] = CLOUD_SEEDS.map((s) => ({
  ...s,
  Description: summarizeHtmlToDescription(s.notice),
}));
