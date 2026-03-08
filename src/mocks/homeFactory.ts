import { createCreatedAtFromMinutesAgo } from "../utils/date";

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
  // Additional fields for full article structure
  notice?: string; // HTML string with the full news body
  imgProfile?: string; // creator profile image
  bioCreator?: string;
  socialMediasCreator?: { type: string; url: string }[];
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
  creator: string;
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

// Remove imagens e links do HTML e extrai texto puro limitado a N linhas.
export const summarizeHtmlToDescription = (
  html: string | undefined,
  maxLines = 10,
): string => {
  if (!html) return "";

  // Remove <img ...> tags entirely
  let cleaned = html.replace(/<img[^>]*>/gi, "");

  // Replace block-level tags that should create line breaks with newline
  cleaned = cleaned.replace(/<\/(p|div|h[1-6]|li|br)\s*>/gi, "\n");

  // Unwrap anchor tags but keep their inner text
  cleaned = cleaned.replace(/<a[^>]*>(.*?)<\/a>/gi, "$1");

  // Remove all remaining tags
  cleaned = cleaned.replace(/<[^>]+>/g, "");

  // Decode a few common HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  // Normalize whitespace and split into lines
  const lines = cleaned
    .split(/\n|\r/)
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.slice(0, maxLines).join("\n");
};

export const buildCategoryItems = (
  seeds: HomeSeed[],
  devCategory: string,
  startOffset: number,
): HomeSectionItem[] =>
  seeds.map((seed, index) => ({
    ImgUrl: "/images/imageScience.png",
    Title: seed.title,
    // Description should be a short plain-text summary extracted from full HTML
    Description: summarizeHtmlToDescription(
      makeDescription(seed.title, devCategory, seed.creator),
    ),
    Creator: seed.creator,
    Category: devCategory,
    CreatedAt: createdAtByOffset(startOffset + index * 37),
    CommentsCount: 8 + (index % 11),
    isSubscriber: false,
    // store slug without category prefix; server components will compose
    // full URLs using the category when needed
    Slug: `/${seed.slug}`,
    // new structured fields
    notice: makeDescription(seed.title, devCategory, seed.creator),
    imgProfile: "/images/Nicholas-Emery.png",
    bioCreator: `Autor ${seed.creator} — especialista em ${devCategory}`,
    socialMediasCreator: [
      { type: "twitter", url: `https://twitter.com/${seed.creator}` },
      { type: "github", url: `https://github.com/${seed.creator}` },
    ],
    commentsNotice: [
      {
        imgProfile: "/images/Nicholas-Emery.png",
        nameProfile: seed.creator,
        createdAtComment: createdAtByOffset(startOffset + index * 10),
        comment: `Comentário de exemplo sobre ${seed.title}`,
        replyComments: [
          {
            imgProfile: "/images/Nicholas-Emery.png",
            nameProfile: "replyUser",
            createdAtComment: createdAtByOffset(startOffset + index * 5),
            comment: "Resposta de exemplo",
          },
        ],
      },
    ],
  }));
