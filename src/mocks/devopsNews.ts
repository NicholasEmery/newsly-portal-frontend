// devopsNews.ts
import type { HomeSectionItem } from "./homeFactory";
import { createCreatedAtFromMinutesAgo } from "@/utils/date";

const DEVOPS_SEEDS = [
  {
    ImgUrl: "/images/imageScience.png",
    Title: "CI/CD com GitHub Actions e quality gates",
    Creators: {
      Owner: {
        name: "opsbia",
        imgProfile: "",
        bio: "opsbia — engenheira de plataforma",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1200),
    CommentsCount: 5,
    isSubscriber: false,
    Slug: "cicd-github-actions-quality-gates",
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
        <section>
          <h2>Resumo operacional</h2>
          <p>O objetivo desse fluxo é reduzir surpresa na entrega e transformar o pipeline em uma ferramenta de confiança, não só um gate automático.</p>
          <p>Com mais contexto, o mock passa a funcionar melhor como texto de leitura e como referência visual para cards maiores.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Deploy azul/verde com rollback orientado por métricas",
    Creators: {
      Owner: {
        name: "opsrafa",
        imgProfile: "",
        bio: "opsrafa — engenheira de confiabilidade",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1237),
    CommentsCount: 4,
    isSubscriber: false,
    Slug: "deploy-azul-verde-rollback-metricas",
    notice: `
      <article>
        <header><h1>Deploy azul/verde com rollback orientado por métricas</h1></header>
        <p>Deploys azul/verde reduzem downtime e permitem testes controlados. Integrar métricas de negócio e performance na decisão de rollback torna o processo seguro e automatizável.</p>
        <h2>Métricas-chave</h2>
        <p>Monitore erro de negócio, latência e taxa de sucesso por rota. Use análise estatística para evitar decisões precipitadas baseadas em ruído.</p>
        <p>Incluímos um exemplo de pipeline que automatiza a comparação e rota de rollback.</p>
        <section>
          <h2>Decisão na prática</h2>
          <p>O mais importante aqui é mostrar que rollback não precisa ser manual quando o sistema já tem métricas suficientes para tomar uma decisão segura.</p>
          <p>Esse bloco extra amplia o conteúdo sem mudar a intenção do mock.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Kubernetes: autoscaling por fila e latência",
    Creators: {
      Owner: {
        name: "kubeleo",
        imgProfile: "",
        bio: "kubeleo — engenheiro de plataforma",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1274),
    CommentsCount: 6,
    isSubscriber: false,
    Slug: "kubernetes-autoscaling-fila-latencia",
    notice: `
      <article>
        <header><h1>Kubernetes: autoscaling por fila e latência</h1></header>
        <p>Autoscaling tradicional por CPU pode não refletir carga real. Propomos autoscaling baseado em comprimento de fila e p95 de latência, com exemplos de adapters que expõem métricas customizadas para o HPA.</p>
        <h2>Arquitetura</h2>
        <p>Use exporters e prom/adapter para transformar métricas de aplicação em sinais consumíveis pelo autoscaler.</p>
        <h3>Considerações</h3>
        <p>Dimensione buffers e políticas de cooldown para evitar oscillation em picos.</p>
        <section>
          <h2>Visão complementar</h2>
          <p>Esse padrão só funciona bem quando a métrica certa realmente representa a pressão do sistema, e não só um número fácil de coletar.</p>
          <p>O conteúdo extra reforça essa leitura de operação, limites e automação.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Observabilidade com OpenTelemetry e alertas úteis",
    Creators: {
      Owner: {
        name: "opsbia",
        imgProfile: "",
        bio: "opsbia — engenheira de plataforma",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1311),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "observabilidade-opentelemetry-alertas",
    notice: `
      <article>
        <header><h1>Observabilidade com OpenTelemetry e alertas úteis</h1></header>
        <p>OpenTelemetry fornece padrão para traces, métricas e logs. Neste artigo abordamos como instrumentar spans significativos, aplicar sampling e enriquecer spans para reduzir falso-positivo em alertas.</p>
        <h2>Alertas acionáveis</h2>
        <p>Crie alertas com playbooks claros e contexto suficiente para triagem rápida. Evite alertas que só relatem sintoma sem causa raiz.</p>
        <h3>Sampling</h3>
        <p>Aplique sampling adaptativo para reduzir custos sem perder visibilidade em eventos raros.</p>
        <section>
          <h2>Mensagem prática</h2>
          <p>Observabilidade útil é aquela que ajuda alguém a agir, então o texto também precisa refletir esse foco em resposta e decisão.</p>
          <p>Com esse complemento, o mock fica mais rico para leitura e para apresentação em card.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Estratégias de release train para squads paralelos",
    Creators: {
      Owner: {
        name: "opsrafa",
        imgProfile: "",
        bio: "opsrafa — engenheira de confiabilidade",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1348),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "release-train-squads",
    notice: `
      <article>
        <header><h1>Estratégias de release train para squads paralelos</h1></header>
        <p>Release trains oferecem cadência e previsibilidade para múltiplos squads. Apresentamos modelos de coordenação, gating e comunicação para reduzir conflitos entre equipes.</p>
        <h2>Coordenação</h2>
        <p>Defina janelas de release, listas de dependências e integrações automatizadas para validar compatibilidade entre mudanças.</p>
        <section>
          <h2>Uso no dia a dia</h2>
          <p>Quando vários times dependem do mesmo fluxo, um release train bem estruturado ajuda a reduzir colisões e a organizar prioridades sem depender de improviso.</p>
          <p>Esse extra deixa o mock mais longo e mais próximo de um artigo completo.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "SLOs acionáveis para operação de portais",
    Creators: {
      Owner: {
        name: "kubeleo",
        imgProfile: "",
        bio: "kubeleo — engenheiro de plataforma",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1385),
    CommentsCount: 7,
    isSubscriber: false,
    Slug: "slos-acionaveis-portais",
    notice: `
      <article>
        <header><h1>SLOs acionáveis para operação de portais</h1></header>
        <p>SLOs bem definidos guiam operações e priorização. Demonstramos como transformar SLOs em runbooks acionáveis com playbooks automatizados para responder incidentes comuns.</p>
        <h2>Definição</h2>
        <p>Estabeleça SLOs alinhados ao impacto de negócio e com SLIs medíveis e confiáveis.</p>
        <section>
          <h2>Valor prático</h2>
          <p>SLO deixa de ser métrica decorativa quando ele orienta quais incidentes recebem atenção e qual nível de degradação é aceitável.</p>
          <p>Esse conteúdo amplia a base de leitura para a página de notícia.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Padronização de ambientes com templates IaC",
    Creators: {
      Owner: {
        name: "opsbia",
        imgProfile: "",
        bio: "opsbia — engenheira de plataforma",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1422),
    CommentsCount: 4,
    isSubscriber: false,
    Slug: "padronizacao-ambientes-templates-iac",
    notice: `
      <article>
        <header><h1>Padronização de ambientes com templates IaC</h1></header>
        <p>Templates IaC padronizam infraestrutura e reduzem configuração manual. Fornecemos um template base e exemplos de variações para diferentes perfis de produto.</p>
        <h2>Variações</h2>
        <p>Defina parâmetros para adaptar templates a requisitos de compliance, performance e custo.</p>
        <section>
          <h2>Como aplicar</h2>
          <p>Quanto mais reutilizável e parametrizável o template, menor o esforço para expandir ambientes mantendo consistência.</p>
          <p>O mock ganha corpo sem perder a objetividade técnica.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Hardening de pipelines contra supply-chain attacks",
    Creators: {
      Owner: {
        name: "opsrafa",
        imgProfile: "",
        bio: "opsrafa — engenheira de confiabilidade",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1459),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "hardening-pipelines-supply-chain",
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
        <section>
          <h2>Contexto adicional</h2>
          <p>O hardening faz sentido quando o pipeline inteiro é pensado como superfície de ataque e não como uma simples sequência de comandos.</p>
          <p>Esse bloco extra reforça a leitura de segurança e operação em conjunto.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Postmortems sem culpa e melhoria contínua",
    Creators: {
      Owner: {
        name: "kubeleo",
        imgProfile: "",
        bio: "kubeleo — engenheiro de plataforma",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1496),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "postmortems-melhoria-continua",
    notice: `
      <article>
        <header><h1>Postmortems sem culpa e melhoria contínua</h1></header>
        <p>Postmortems eficazes incentivam aprendizado. Fornecemos um template que separa fatos, timelines, causas raízes e ações verificáveis sem apontar culpas.</p>
        <h2>Formato</h2>
        <p>Inclua ambiente, impacto, timeline e ações com responsáveis e datas.</p>
        <section>
          <h2>Objetivo cultural</h2>
          <p>O valor do postmortem está menos em explicar o incidente e mais em garantir que a equipe aprenda sem medo de responsabilização improdutiva.</p>
          <p>Esse detalhe adicional torna o mock mais expressivo e completo.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Estratégia de feature flags para releases seguros",
    Creators: {
      Owner: {
        name: "opsbia",
        imgProfile: "",
        bio: "opsbia — engenheira de plataforma",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1533),
    CommentsCount: 5,
    isSubscriber: false,
    Slug: "feature-flags-releases-seguros",
    notice: `
      <article>
        <header><h1>Estratégia de feature flags para releases seguros</h1></header>
        <p>Feature flags permitem releases controlados. Descrevemos estratégias de segmentação, rollouts e automações para desligar rapidamente funcionalidades problemáticas.</p>
        <h2>Rollout seguro</h2>
        <p>Inicie em um pequeno percentual, monitore métricas e aumente gradualmente com automações de rollback em caso de regressão.</p>
        <section>
          <h2>Regras úteis</h2>
          <p>Feature flag só é bom quando ele permite avançar com segurança sem criar uma nova camada de dívida operacional difícil de gerenciar.</p>
          <p>O conteúdo adicional fortalece esse argumento dentro do mock.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Rollback automatizado por erro de negócio",
    Creators: {
      Owner: {
        name: "opsrafa",
        imgProfile: "",
        bio: "opsrafa — engenheira de confiabilidade",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1570),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "rollback-automatizado-erro-negocio",
    notice: `
      <article>
        <header><h1>Rollback automatizado por erro de negócio</h1></header>
        <p>Rollback automático baseado em métricas de negócio (por exemplo, falhas de pagamento) pode mitigar impactos rapidamente. Discutimos thresholds, segurança do processo e testes para evitar rollbacks indevidos.</p>
        <h2>Proteções</h2>
        <p>Combine múltiplos sinais e análise estatística para reduzir falsos positivos.</p>
        <section>
          <h2>Leitura operacional</h2>
          <p>Esse tipo de proteção precisa ser calibrado com cuidado para não transformar o mecanismo de segurança em uma fonte de interrupções desnecessárias.</p>
          <p>O mock agora carrega mais contexto para explicar essa tomada de decisão.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "GitOps para governança de múltiplos clusters",
    Creators: {
      Owner: {
        name: "kubeleo",
        imgProfile: "",
        bio: "kubeleo — engenheiro de plataforma",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1607),
    CommentsCount: 4,
    isSubscriber: false,
    Slug: "gitops-governanca-multiplos-clusters",
    notice: `
      <article>
        <header><h1>GitOps para governança de múltiplos clusters</h1></header>
        <p>GitOps promove consistência declarativa entre clusters; mostramos como organizar repositórios, políticas e ferramentas de verificação para manter governança em escala.</p>
        <h2>Estrutura</h2>
        <p>Use repositórios mono ou multi para gerir clusters e aplique policies-as-code para controlar mudanças.</p>
        <section>
          <h2>Mais detalhes</h2>
          <p>Em ambientes maiores, a governança declarativa vira o ponto central de alinhamento entre segurança, infraestrutura e times de produto.</p>
          <p>Esse acréscimo deixa o conteúdo mais denso e útil para uma página de leitura longa.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Métricas DORA para evolução de entrega",
    Creators: {
      Owner: {
        name: "opsbia",
        imgProfile: "",
        bio: "opsbia — engenheira de plataforma",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1644),
    CommentsCount: 2,
    isSubscriber: false,
    Slug: "metricas-dora-evolucao-entrega",
    notice: `
      <article>
        <header><h1>Métricas DORA para evolução de entrega</h1></header>
        <p>Métricas DORA ajudam equipes a priorizar melhorias de processo. Explicamos coleta, interpretação e ações práticas para cada métrica: Deployment Frequency, Lead Time for Changes, MTTR e Change Failure Rate.</p>
        <h2>Aplicação</h2>
        <p>Combine métricas com objetivos de negócio e trace experimentos para melhorar eficiência de entrega.</p>
        <section>
          <h2>Como usar</h2>
          <p>Essas métricas só fazem sentido quando orientam decisões reais de time, e não quando viram apenas um painel bonito.</p>
          <p>O mock agora possui mais corpo para refletir essa leitura estratégica.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Canary com análise estatística de regressão",
    Creators: {
      Owner: {
        name: "opsrafa",
        imgProfile: "",
        bio: "opsrafa — engenheira de confiabilidade",
        socialMedias: [],
      },
      Colaborators: [],
    },
    Category: "DevOps",
    CreatedAt: createCreatedAtFromMinutesAgo(1681),
    CommentsCount: 3,
    isSubscriber: false,
    Slug: "canary-analise-estatistica-regressao",
    notice: `
      <article>
        <header><h1>Canary com análise estatística de regressão</h1></header>
        <p>Canary deployments devem ser guiados por análise estatística para distinguir sinal de ruído. Mostramos métodos para calcular significância e configurar thresholds acionáveis.</p>
        <h2>Metodologia</h2>
        <p>Use testes A/B com correção para múltiplas comparações e monitoramento contínuo para decidir expansão ou rollback.</p>
        <section>
          <h2>Decisão mais segura</h2>
          <p>A ideia é evitar que a expansão de tráfego seja guiada por impressões subjetivas e passar a tomar decisões com base em evidência real.</p>
          <p>Esse trecho adicional amplia a leitura técnica do mock.</p>
        </section>
      </article>
    `.trim(),
    commentsNotice: [],
  },
];

export const DEVOPS_NEWS_MOCK: HomeSectionItem[] = DEVOPS_SEEDS.map((s) => ({
  ...s,
  Creator: s.Creators.Owner.name,
  notice: s.notice,
  Description:
    "Conteúdo de DevOps sobre CI/CD, observabilidade, deploys e confiabilidade operacional.",
}));
