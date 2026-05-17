import { createCreatedAtFromMinutesAgo } from "../utils/date";

// Informações de um criador (owner ou colaborador)
export interface CreatorInfo {
  name: string;
  imgProfile: string;
  bio: string;
  socialMedias: { type: string; url: string }[];
}

// Estrutura de criadores de uma notícia
export interface NewsCreators {
  Owner: CreatorInfo;
  Colaborators: CreatorInfo[]; // pode ser vazio
}

export interface HomeSectionItem {
  ImgUrl: string;
  Title: string;
  Description: string;
  Creator: string;
  Category: string;
  CreatedAt: string;
  CommentsCount: number;
  isSubscriber: boolean;
  Slug: string;
  // Nova estrutura de autoria
  Creators: NewsCreators;
  // Additional fields for full article structure
  notice?: string; // HTML string with the full news body
  commentsNotice?: {
    imgProfile?: string;
    nameProfile?: string;
    createdAtComment?: string;
    comment?: string;
    replyComments?: Array<{
      imgProfile?: string;
      nameProfile?: string;
      createdAtComment?: string;
      comment?: string;
    }>;
  }[];
}

export interface HomeSection {
  FilterLabel: string;
  Category: string;
  Items: HomeSectionItem[];
}

export type HomeSeed = {
  title: string;
  creator: string; // nome do criador principal (usado para gerar o Owner)
  slug: string;
};

// moved to utils/date.ts, re-export for backward compatibility
export {
  parseCreatedAtDisplay,
  formatCreatedAtDisplay,
  createCreatedAtFromMinutesAgo,
  clampCreatedAtToPolicy,
} from "@/utils/date";

const createdAtByOffset = (offsetMinutes: number) =>
  createCreatedAtFromMinutesAgo(offsetMinutes);

const makeDescription = (title: string, category: string, creator?: string) => {
  // Produz um HTML simples como placeholder para o corpo da notícia.
  // Pode conter imagens, headings e parágrafos — consumidor deve renderizar como HTML.
  const safeTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeCreator = creator
    ? creator.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    : "newsly";
  return `
    <article>
      <h1>${safeTitle}</h1>
      <p><em>Por ${safeCreator} — Categoria: ${category}</em></p>
      <img src="/images/imageScience.png" alt="${safeTitle}" />
      <p>Este é um conteúdo de exemplo que ilustra a estrutura HTML da notícia. ${safeTitle} aborda tópicos relevantes sobre ${category} e fornece dicas práticas para arquitetura, performance e manutenção.</p>
      <p>Continuação do artigo com mais detalhes, exemplos e código quando necessário.</p>
    </article>
  `.trim();
};

// Função auxiliar para gerar um objeto CreatorInfo padrão a partir de um nome e categoria
const buildCreatorInfo = (
  creatorName: string,
  category: string,
): CreatorInfo => ({
  name: creatorName,
  imgProfile: "",
  bio: `Autor ${creatorName} — especialista em ${category}`,
  socialMedias: [
    { type: "twitter", url: `https://twitter.com/${creatorName}` },
    { type: "github", url: `https://github.com/${creatorName}` },
  ],
});

export const buildCategoryItems = (
  seeds: HomeSeed[],
  devCategory: string,
  startOffset: number,
): HomeSectionItem[] =>
  seeds.map((seed, index) => {
    const owner = buildCreatorInfo(seed.creator, devCategory);
    return {
      ImgUrl: "/images/imageScience.png",
      Title: seed.title,
      Creator: owner.name,
      Description: `Artigo sobre ${seed.title} em ${devCategory}, com orientações práticas para arquitetura, performance e manutenção.`,
      Category: devCategory,
      CreatedAt: createdAtByOffset(startOffset + index * 37),
      CommentsCount: 8 + (index % 11),
      isSubscriber: false,
      Slug: `${seed.slug}`,
      // Nova estrutura de criadores
      Creators: {
        Owner: owner,
        Colaborators: [], // por padrão, sem colaboradores nos mocks gerados
      },
      notice: makeDescription(seed.title, devCategory, seed.creator),
      commentsNotice: [
        {
          imgProfile: "",
          nameProfile: seed.creator,
          createdAtComment: createdAtByOffset(startOffset + index * 10),
          comment: `Comentário de exemplo sobre ${seed.title}`,
          replyComments: [
            {
              imgProfile: "",
              nameProfile: "replyUser",
              createdAtComment: createdAtByOffset(startOffset + index * 5),
              comment: "Resposta de exemplo",
            },
          ],
        },
      ],
    };
  });
