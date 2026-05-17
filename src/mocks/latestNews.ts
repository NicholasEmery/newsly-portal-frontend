import {
  LATEST_NEWS,
  LATEST_NEWS_HERO,
  PROFILE_SPOTLIGHT_NEWS,
} from "./newsCollections";
import { type NewsCreators, type HomeSectionItem } from "./homeFactory";

// Tipo base para itens da seção "Latest News" com imagem
type LatestNewsImageItem = {
  Title: string;
  Creator: string;
  Creators: NewsCreators;
  Category: string;
  CreatedAt: string;
  Slug: string;
  ImgUrl: string;
};

// Tipo para o card especial com foto de perfil
type LatestNewsProfileItem = {
  Title: string;
  Creator: string;
  Creators: NewsCreators;
  Category: string;
  CreatedAt: string;
  Slug: string;
  ImgProfileUrl: string;
};

// Função para normalizar a estrutura de criadores a partir de um HomeSectionItem
// Assume que o item já possui Creators (nova estrutura)
function getCreators(item: HomeSectionItem): NewsCreators {
  return item.Creators;
}

// Converte um item da coleção para LatestNewsImageItem
const toImageItem = (item: HomeSectionItem): LatestNewsImageItem => ({
  Title: item.Title,
  Creator: item.Creator,
  Creators: getCreators(item),
  Category: item.Category,
  CreatedAt: item.CreatedAt,
  Slug: item.Slug,
  ImgUrl: item.ImgUrl,
});

// Itens regulares (até 7)
const regularBase = LATEST_NEWS.slice(0, 7);
const LATEST_NEWS_REGULAR: LatestNewsImageItem[] =
  regularBase.length > 0
    ? regularBase.map(toImageItem)
    : [toImageItem(LATEST_NEWS_HERO)];

while (LATEST_NEWS_REGULAR.length < 7) {
  LATEST_NEWS_REGULAR.push(LATEST_NEWS_REGULAR[0]);
}

// Item especial de perfil
const profileSource = PROFILE_SPOTLIGHT_NEWS ?? LATEST_NEWS_HERO;
const LATEST_NEWS_PROFILE_LAST: LatestNewsProfileItem = {
  Title: profileSource.Title,
  Creator: profileSource.Creator,
  Creators: profileSource.Creators, // diretamente, sem normalização
  Category: profileSource.Category,
  CreatedAt: profileSource.CreatedAt,
  Slug: profileSource.Slug,
  ImgProfileUrl: "",
};

export const LATEST_NEWS_ITEMS_MOCK = [
  ...LATEST_NEWS_REGULAR.slice(0, 7),
  LATEST_NEWS_PROFILE_LAST,
];

export const LATEST_NEWS_SECTION_MOCK = {
  Items: LATEST_NEWS_ITEMS_MOCK,
  Hero: LATEST_NEWS_ITEMS_MOCK[0] as LatestNewsImageItem,
  Feed: LATEST_NEWS_ITEMS_MOCK.slice(2, 7) as LatestNewsImageItem[],
  SideCard: LATEST_NEWS_ITEMS_MOCK[1] as LatestNewsImageItem,
  SideProfile: LATEST_NEWS_ITEMS_MOCK[7] as LatestNewsProfileItem,
  TotalNews: 8,
};
