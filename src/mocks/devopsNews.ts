import type { HomeSectionItem } from "./homeFactory";
import { createCreatedAtFromMinutesAgo } from "@/utils/date";
import { summarizeHtmlToDescription } from "./homeFactory";

const DEVOPS_SEEDS = [
  {
    ImgUrl: "/images/imageScience.png",
    Title: "CI/CD com GitHub Actions e quality gates",
    Description: "Guia prático sobre CI/CD...",
    Creator: "opsbia",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1200),
    CommentsCount: 5,
    isSubscriber: false,
    Slug: "/cicd-github-actions-quality-gates",
    notice: `
      <article>
        <header>
          <h1>CI/CD com GitHub Actions e quality gates</h1>
          <p><small>Por opsbia • DevOps • Atualizado</small></p>
        </header>
        <p>Construir pipelines confiáveis vai além de executar steps: envolve quality gates que bloqueiam merges quando thresholds não são atendidos, integração com scanners de segurança e métricas que medem saúde do build.</p>
        <h2>Quality gates</h2>
        <p>Defina métricas claras (coverage, lint, vulnerabilities) e automatize checagens para prevenir regressões em produção.</p>
        <h3>Observabilidade de pipeline</h3>
        <p>Armazene logs estruturados e métricas de tempo de execução para diagnosticar falhas e otimizar tempo de entrega.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "opsbia — engenheira de plataforma",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Deploy azul/verde com rollback orientado por métricas",
    Description: "Guia prático sobre deploy azul/verde...",
    Creator: "opsrafa",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1237),
    CommentsCount: 4,
    isSubscriber: false,
    Slug: "/deploy-azul-verde-rollback-metricas",
    notice: `
      <article>
        <header><h1>Deploy azul/verde com rollback orientado por métricas</h1></header>
        <p>Deploys azul/verde reduzem downtime e permitem testes controlados. Integrar métricas de negócio e performance na decisão de rollback torna o processo seguro e automatizável.</p>
        <h2>Métricas-chave</h2>
        <p>Monitore erro de negócio, latência e taxa de sucesso por rota. Use análise estatística para evitar decisões precipitadas baseadas em ruído.</p>
        <p>Incluímos um exemplo de pipeline que automatiza a comparação e rota de rollback.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "opsrafa — engenheira de confiabilidade",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Kubernetes: autoscaling por fila e latência",
    Description: "Guia prático sobre Kubernetes...",
    Creator: "kubeleo",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1274),
    CommentsCount: 6,
    isSubscriber: false,
    Slug: "/kubernetes-autoscaling-fila-latencia",
    notice: `
      <article>
        <header><h1>Kubernetes: autoscaling por fila e latência</h1></header>
        <p>Autoscaling tradicional por CPU pode não refletir carga real. Propomos autoscaling baseado em comprimento de fila e p95 de latência, com exemplos de adapters que expõem métricas customizadas para o HPA.</p>
        <h2>Arquitetura</h2>
        <p>Use exporters e prom/adapter para transformar métricas de aplicação em sinais consumíveis pelo autoscaler.</p>
        <h3>Considerações</h3>
        <p>Dimensione buffers e políticas de cooldown para evitar oscillation em picos.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "kubeleo — engenheiro de plataforma",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Observabilidade com OpenTelemetry e alertas úteis",
    Description: "Guia prático sobre observabilidade...",
    Creator: "opsbia",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1311),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "/observabilidade-opentelemetry-alertas",
    notice: `
      <article>
        <header><h1>Observabilidade com OpenTelemetry e alertas úteis</h1></header>
        <p>OpenTelemetry fornece padrão para traces, métricas e logs. Neste artigo abordamos como instrumentar spans significativos, aplicar sampling e enriquecer spans para reduzir falso-positivo em alertas.</p>
        <h2>Alertas acionáveis</h2>
        <p>Crie alertas com playbooks claros e contexto suficiente para triagem rápida. Evite alertas que só relatem sintoma sem causa raiz.</p>
        <h3>Sampling</h3>
        <p>Aplique sampling adaptativo para reduzir custos sem perder visibilidade em eventos raros.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "opsbia — engenheira de plataforma",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Estratégias de release train para squads paralelos",
    Description: "Guia prático sobre release train...",
    Creator: "opsrafa",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1348),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "/release-train-squads",
    notice: `
      <article>
        <header><h1>Estratégias de release train para squads paralelos</h1></header>
        <p>Release trains oferecem cadência e previsibilidade para múltiplos squads. Apresentamos modelos de coordenação, gating e comunicação para reduzir conflitos entre equipes.</p>
        <h2>Coordenação</h2>
        <p>Defina janelas de release, listas de dependências e integrações automatizadas para validar compatibilidade entre mudanças.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "opsrafa — engenheira de confiabilidade",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "SLOs acionáveis para operação de portais",
    Description: "Guia prático sobre SLOs...",
    Creator: "kubeleo",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1385),
    CommentsCount: 7,
    isSubscriber: false,
    Slug: "/slos-acionaveis-portais",
    notice: `
      <article>
        <header><h1>SLOs acionáveis para operação de portais</h1></header>
        <p>SLOs bem definidos guiam operações e priorização. Demonstramos como transformar SLOs em runbooks acionáveis com playbooks automatizados para responder incidentes comuns.</p>
        <h2>Definição</h2>
        <p>Estabeleça SLOs alinhados ao impacto de negócio e com SLIs medíveis e confiáveis.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "kubeleo — engenheiro de plataforma",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Padronização de ambientes com templates IaC",
    Description: "Guia prático sobre templates IaC...",
    Creator: "opsbia",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1422),
    CommentsCount: 4,
    isSubscriber: false,
    Slug: "/padronizacao-ambientes-templates-iac",
    notice: `
      <article>
        <header><h1>Padronização de ambientes com templates IaC</h1></header>
        <p>Templates IaC padronizam infraestrutura e reduzem configuração manual. Fornecemos um template base e exemplos de variações para diferentes perfis de produto.</p>
        <h2>Variações</h2>
        <p>Defina parâmetros para adaptar templates a requisitos de compliance, performance e custo.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "opsbia — engenheira de plataforma",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Hardening de pipelines contra supply-chain attacks",
    Description: "Guia prático sobre hardening de pipelines...",
    Creator: "opsrafa",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1459),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "/hardening-pipelines-supply-chain",
    notice: `
      <article>
        <header><h1>Hardening de pipelines contra supply-chain attacks</h1></header>
        <p>Proteja pipelines aplicando assinaturas de artefatos, verificações de integridade e isolamento de runners. Exploramos controles técnicos e processos organizacionais para reduzir riscos na cadeia de build.</p>
        <h2>Contramedidas</h2>
        <ul>
          <li>Assinatura de artefatos</li>
          <li>Verificação de dependências</li>
          <li>Runners isolados e minimalistas</li>
        </ul>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "opsrafa — engenheira de confiabilidade",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Postmortems sem culpa e melhoria contínua",
    Description: "Guia prático sobre postmortems...",
    Creator: "kubeleo",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1496),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "/postmortems-melhoria-continua",
    notice: `
      <article>
        <header><h1>Postmortems sem culpa e melhoria contínua</h1></header>
        <p>Postmortems eficazes incentivam aprendizado. Fornecemos um template que separa fatos, timelines, causas raízes e ações verificáveis sem apontar culpas.</p>
        <h2>Formato</h2>
        <p>Inclua ambiente, impacto, timeline e ações com responsáveis e datas.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "kubeleo — engenheiro de plataforma",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Estratégia de feature flags para releases seguros",
    Description: "Guia prático sobre feature flags...",
    Creator: "opsbia",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1533),
    CommentsCount: 5,
    isSubscriber: false,
    Slug: "/feature-flags-releases-seguros",
    notice: `
      <article>
        <header><h1>Estratégia de feature flags para releases seguros</h1></header>
        <p>Feature flags permitem releases controlados. Descrevemos estratégias de segmentação, rollouts e automações para desligar rapidamente funcionalidades problemáticas.</p>
        <h2>Rollout seguro</h2>
        <p>Inicie em um pequeno percentual, monitore métricas e aumente gradualmente com automações de rollback em caso de regressão.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "opsbia — engenheira de plataforma",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Rollback automatizado por erro de negócio",
    Description: "Guia prático sobre rollback automatizado...",
    Creator: "opsrafa",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1570),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "/rollback-automatizado-erro-negocio",
    notice: `
      <article>
        <header><h1>Rollback automatizado por erro de negócio</h1></header>
        <p>Rollback automático baseado em métricas de negócio (por exemplo, falhas de pagamento) pode mitigar impactos rapidamente. Discutimos thresholds, segurança do processo e testes para evitar rollbacks indevidos.</p>
        <h2>Proteções</h2>
        <p>Combine múltiplos sinais e análise estatística para reduzir falsos positivos.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "opsrafa — engenheira de confiabilidade",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "GitOps para governança de múltiplos clusters",
    Description: "Guia prático sobre GitOps...",
    Creator: "kubeleo",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1607),
    CommentsCount: 4,
    isSubscriber: false,
    Slug: "/gitops-governanca-multiplos-clusters",
    notice: `
      <article>
        <header><h1>GitOps para governança de múltiplos clusters</h1></header>
        <p>GitOps promove consistência declarativa entre clusters; mostramos como organizar repositórios, políticas e ferramentas de verificação para manter governança em escala.</p>
        <h2>Estrutura</h2>
        <p>Use repositórios mono ou multi para gerir clusters e aplique policies-as-code para controlar mudanças.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "kubeleo — engenheiro de plataforma",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Métricas DORA para evolução de entrega",
    Description: "Guia prático sobre métricas DORA...",
    Creator: "opsbia",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1644),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "/metricas-dora-evolucao-entrega",
    notice: `
      <article>
        <header><h1>Métricas DORA para evolução de entrega</h1></header>
        <p>Métricas DORA ajudam equipes a priorizar melhorias de processo. Explicamos coleta, interpretação e ações práticas para cada métrica: Deployment Frequency, Lead Time for Changes, MTTR e Change Failure Rate.</p>
        <h2>Aplicação</h2>
        <p>Combine métricas com objetivos de negócio e trace experimentos para melhorar eficiência de entrega.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "opsbia — engenheira de plataforma",
    socialMediasCreator: [],
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Canary com análise estatística de regressão",
    Description: "Guia prático sobre canary deployments...",
    Creator: "opsrafa",
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1681),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "/canary-analise-estatistica-regressao",
    notice: `
      <article>
        <header><h1>Canary com análise estatística de regressão</h1></header>
        <p>Canary deployments devem ser guiados por análise estatística para distinguir sinal de ruído. Mostramos métodos para calcular significância e configurar thresholds acionáveis.</p>
        <h2>Metodologia</h2>
        <p>Use testes A/B com correção para múltiplas comparações e monitoramento contínuo para decidir expansão ou rollback.</p>
      </article>
    `.trim(),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: "opsrafa — engenheira de confiabilidade",
    socialMediasCreator: [],
    commentsNotice: [],
  },
];

export const DEVOPS_NEWS_MOCK: HomeSectionItem[] = DEVOPS_SEEDS.map((s) => ({
  ...s,
  Description: summarizeHtmlToDescription(s.notice),
}));
