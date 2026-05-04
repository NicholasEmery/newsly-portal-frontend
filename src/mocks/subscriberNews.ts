import {
  createCreatedAtFromMinutesAgo,
  summarizeHtmlToDescription,
  type HomeSectionItem,
  type NewsCreators,
} from "./homeFactory";
import { enrichNoticeHtml } from "./noticeEnhancer";

// Função auxiliar para criar a estrutura de criadores
function buildOwnerCreators(creatorName: string): NewsCreators {
  return {
    Owner: {
      name: creatorName,
      imgProfile: "/images/Nicholas-Emery.png",
      bio: `Autor ${creatorName} — conteúdo exclusivo para assinantes`,
      socialMedias: [],
    },
    Colaborators: [],
  };
}

// Seeds agora usam Creators e não possuem mais Creator, Description e campos separados de perfil
const SUBSCRIBER_NEWS_SEEDS: Omit<HomeSectionItem, "Description" | "notice">[] =
  [
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
      // notice será adicionado depois do enrich
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
    },
  ];

// Converte cada seed adicionando o notice enriquecido e a descrição derivada
export const SUBSCRIBER_NEWS_MOCK: HomeSectionItem[] =
  SUBSCRIBER_NEWS_SEEDS.map((s, index) => {
    // Como seeds não possuem notice, precisamos gerar um HTML mínimo para enriquecer
    const rawHtml = `
      <article>
        <header><h1>${s.Title}</h1></header>
        <p>Conteúdo completo disponível apenas para assinantes. Este artigo aborda ${s.Title} com profundidade.</p>
      </article>
    `.trim();
    const notice = enrichNoticeHtml({
      html: rawHtml,
      title: s.Title,
      category: s.Category,
      creator: s.Creators.Owner.name,
      index,
    });

    return {
      ...s,
      notice,
      Description: summarizeHtmlToDescription(notice),
    };
  });
