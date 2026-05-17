import { z } from "zod";

export const HomeSectionItemSchema = z.object({
  ImgUrl: z.string().min(1),
  Title: z.string().min(1),
  Description: z.string().min(1),
  Creator: z.string().min(1),
  Category: z.string().min(1),
  CreatedAt: z.string().min(1),
  CommentsCount: z.number().int().nonnegative(),
  isSubscriber: z.boolean(),
  Slug: z.string().min(1),
});

export const HomeSectionSchema = z.object({
  FilterLabel: z.string().min(1),
  Category: z.string().min(1),
  Items: z.array(HomeSectionItemSchema),
});

export const TopNoticeSchema = z.object({
  ImgUrl: z.string().min(1),
  Category: z.string().min(1),
  Creator: z.string().min(1),
  Title: z.string().min(1),
  Description: z.string().min(1),
  CreatedAt: z.string().min(1),
  Slug: z.string().min(1),
});

export const TrendingItemSchema = z.object({
  ImgUrl: z.string().min(1),
  Title: z.string().min(1),
  Creator: z.string().min(1),
  Category: z.string().min(1),
  CreatedAt: z.string().min(1),
  Slug: z.string().min(1),
});

export const LatestNewsImageItemSchema = z.object({
  Title: z.string().min(1),
  Creator: z.string().min(1),
  Category: z.string().min(1),
  CreatedAt: z.string().min(1),
  Slug: z.string().min(1),
  ImgUrl: z.string().min(1),
});

export const LatestNewsProfileItemSchema = z.object({
  Title: z.string().min(1),
  Creator: z.string().min(1),
  Category: z.string().min(1),
  CreatedAt: z.string().min(1),
  Slug: z.string().min(1),
  ImgProfileUrl: z.string(),
});

export const LatestNewsSectionSchema = z.object({
  Items: z.array(
    z.union([LatestNewsImageItemSchema, LatestNewsProfileItemSchema]),
  ),
  Hero: LatestNewsImageItemSchema,
  Feed: z.array(LatestNewsImageItemSchema),
  SideCard: LatestNewsImageItemSchema,
  SideProfile: LatestNewsProfileItemSchema,
  TotalNews: z.number().int().nonnegative(),
});

export const HomePageSectionsSchema = z.object({
  TopNotice: TopNoticeSchema,
  TrendingNow: z.array(TrendingItemSchema),
  LatestNews: LatestNewsSectionSchema,
  HomeGrids: z.array(HomeSectionSchema),
  SubscriberNews: z.array(HomeSectionItemSchema),
});

export type HomeSectionItemDto = z.infer<typeof HomeSectionItemSchema>;
export type HomeSectionDto = z.infer<typeof HomeSectionSchema>;
export type TopNoticeDto = z.infer<typeof TopNoticeSchema>;
export type TrendingItemDto = z.infer<typeof TrendingItemSchema>;
export type LatestNewsSectionDto = z.infer<typeof LatestNewsSectionSchema>;
export type HomePageSectionsDto = z.infer<typeof HomePageSectionsSchema>;
