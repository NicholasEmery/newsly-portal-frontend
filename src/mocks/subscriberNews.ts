import {
  createCreatedAtFromMinutesAgo,
  type HomeSectionItem,
} from "./homeFactory";

export const SUBSCRIBER_NEWS_MOCK: HomeSectionItem[] = [
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Arquitetura event-driven para checkout com alta resiliência",
    Description:
      "Estratégias de backend com mensageria, consistência eventual e observabilidade para fluxos críticos de pagamento.",
    Creator: "backendjoao",
    Category: "Backend",
    CreatedAt: createCreatedAtFromMinutesAgo(160),
    CommentsCount: 24,
    isSubscriber: true,
    Slug: "/event-driven-checkout-resiliencia",
  },
  {
    ImgUrl: "/images/imageScience.png",
    Title: "Governança multi-conta em cloud com políticas automatizadas",
    Description:
      "Como aplicar guardrails, auditoria contínua e gestão de custos em ambientes cloud de grande escala.",
    Creator: "cloudleo",
    Category: "Cloud",
    CreatedAt: createCreatedAtFromMinutesAgo(115),
    CommentsCount: 19,
    isSubscriber: true,
    Slug: "/governanca-multiconta-politicas-automatizadas",
  },
];
