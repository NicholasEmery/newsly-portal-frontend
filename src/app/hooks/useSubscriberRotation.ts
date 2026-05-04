import type {
  HomeSectionDto,
  HomeSectionItemDto,
} from "@/api/schemas/homepage";

export type SubscriberVariant = "banner" | "card";

export type GridSectionWithSubscriber = {
  section: HomeSectionDto;
  subscriberItem: HomeSectionItemDto | null;
  subscriberVariant: SubscriberVariant;
};

export const useSubscriberRotation = (
  sections: HomeSectionDto[],
  subscriberQueue: HomeSectionItemDto[],
): GridSectionWithSubscriber[] => {
  let bannerCount = 0;
  let subscriberCursor = 0;

  return sections.map((section) => {
    const subscriberItem = subscriberQueue[subscriberCursor] || null;
    const nextBannerIndex = bannerCount + 1;

    if (subscriberItem) {
      bannerCount += 1;
      subscriberCursor += 1;
    }

    return {
      section,
      subscriberItem,
      subscriberVariant: nextBannerIndex % 2 === 0 ? "card" : "banner",
    };
  });
};
