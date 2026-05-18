import {
  createCreatedAtFromMinutesAgo,
  type HomeSectionItem,
  type NewsCreators,
} from "./homeFactory";

// Função auxiliar para criar a estrutura de criadores
function buildOwnerCreators(creatorName: string): NewsCreators {
  return {
    Owner: {
      name: creatorName,
      imgProfile: "",
      bio: `Autor ${creatorName} — conteúdo exclusivo para assinantes`,
      socialMedias: [],
    },
    Colaborators: [],
  };
}

// Seeds agora usam Creators e não possuem mais Creator, Description e campos separados de perfil
const SUBSCRIBER_NEWS_SEEDS: Partial<HomeSectionItem>[] = [
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Arquitetura event-driven para checkout com alta resiliência",
    Creator: "backendjoao",
    Creators: buildOwnerCreators("backendjoao"),
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(160),
    CommentsCount: 24,
    isSubscriber: true,
    Slug: "event-driven-checkout-resiliencia",
    notice: `
        <article>
          <header><h1>Arquitetura event-driven para checkout com alta resiliência</h1></header>
          <p>Este guia aprofunda como desacoplar o fluxo de checkout para lidar com picos, retries e falhas parciais sem interromper a experiência do usuário.</p>
          <h2>Fluxo recomendado</h2>
          <p>Separe a confirmação do pagamento da finalização do pedido, persistindo eventos intermediários e usando compensações quando necessário.</p>
          <h2>Cuidados operacionais</h2>
          <p>Inclua idempotência, tracing distribuído e filas com redrive para lidar com duplicidade e reprocessamento.</p>
            <section>
              <h2>Leitura complementar</h2>
              <p>Quando o checkout depende de vários serviços, a modelagem event-driven ajuda a preservar a experiência do usuário mesmo com falhas parciais.</p>
              <p>Esse conteúdo extra deixa o mock mais próximo de um artigo editorial longo, com contexto e aplicação prática.</p>
            </section>
        </article>
      `.trim(),
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Governança multi-conta em cloud com políticas automatizadas",
    Creator: "cloudleo",
    Creators: buildOwnerCreators("cloudleo"),
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(115),
    CommentsCount: 19,
    isSubscriber: true,
    Slug: "governanca-multiconta-politicas-automatizadas",
    notice: `
        <article>
          <header><h1>Governança multi-conta em cloud com políticas automatizadas</h1></header>
          <p>Uma estratégia de governança multi-conta precisa combinar políticas, auditoria e visibilidade centralizada para manter consistência sem travar a operação.</p>
          <h2>Elementos centrais</h2>
          <p>Use guardrails, catálogos de contas e automações de compliance para bloquear desvios antes que eles cheguem à produção.</p>
          <h2>Benefícios</h2>
          <p>Além de reduzir risco, esse modelo melhora rastreabilidade de custo e simplifica a coordenação entre times de plataforma e produto.</p>
          <section>
            <h2>Visão de execução</h2>
            <p>O ponto principal é padronizar sem sufocar a operação, mantendo as equipes com autonomia dentro de limites seguros.</p>
            <p>O mock ganha mais densidade para ser usado como leitura completa na home.</p>
          </section>
        </article>
      `.trim(),
  },
];

// Converte cada seed com notice e descrição explícitos
export const SUBSCRIBER_NEWS_MOCK: HomeSectionItem[] =
  SUBSCRIBER_NEWS_SEEDS.map((s) => ({
    ImgUrl: s.ImgUrl ?? "/images/imageScience.png",
    Title: s.Title ?? "",
    Description:
      s.Description ??
      "Conteúdo exclusivo para assinantes com análise aprofundada e orientações práticas.",
    Creator: s.Creator ?? "",
    Category: s.Category ?? "",
    CreatedAt: s.CreatedAt ?? createCreatedAtFromMinutesAgo(0),
    CommentsCount: s.CommentsCount ?? 0,
    isSubscriber: s.isSubscriber ?? true,
    Slug: s.Slug ?? "",
    Creators: s.Creators ?? buildOwnerCreators(s.Creator ?? "newsly"),
    // preserve optional fields when present
    notice: s.notice,
    commentsNotice: s.commentsNotice,
  }));
