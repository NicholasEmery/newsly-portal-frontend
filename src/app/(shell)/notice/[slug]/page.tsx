import { notFound } from "next/navigation";
import ProfilesCard from "./components/ProfilesCard";
import Notice from "./components/Notice";
import { getNoticeArticleBySlug } from "@/api/services/notice";
import NoticeHeader from "./components/NoticeHeader";
import SubscriberCard from "./components/SubscriberCard";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ slug: string }> };

export default async function NoticePage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("subscriberCard");

  const notice = await getNoticeArticleBySlug(slug);

  if (!notice) {
    notFound();
  }

  return (
    <div className="h-full w-full bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <section className="mx-auto grid w-full xl:max-w-8xl max-w-5xl gap-4 xl:gap-0 lg:px-4 py-8 px-10 grid-cols-1 lg:grid-cols-[minmax(0,0.99fr)_minmax(0,2fr)] 2xl:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col items-center justify-start lg:items-start">
          <ProfilesCard
            owner={notice.Creators.Owner}
            collaborators={notice.Creators.Colaborators}
          />
          {/* <TopicsCard /> */}
        </div>
        <div className="flex flex-col items-stretch justify-start gap-6">
          <NoticeHeader
            category={notice.Category}
            title={notice.Title}
            description={notice.Description ?? ""}
            createdAt={notice.CreatedAt}
            commentsCount={notice.CommentsCount}
          />
          <Notice htmlContent={notice.notice ?? ""} />
          {/* <CreatorsBanner /> */}
          {/* <NewsletterBanner /> */}
          {/* <NextOrPrevious /> */}
        </div>
        <div>
          <SubscriberCard
            texts={{
              badge: t("badge"),
              titleGuest: t("titleGuest"),
              titleMember: t("titleMember"),
              titlePremium: t("titlePremium"),
              descriptionGuest: t("descriptionGuest"),
              descriptionMember: t("descriptionMember"),
              descriptionPremium: t("descriptionPremium"),
              primaryGuest: t("primaryGuest"),
              primaryMember: t("primaryMember"),
              primaryPremium: t("primaryPremium"),
              secondaryGuest: t("secondaryGuest"),
              secondaryPremium: t("secondaryPremium"),
              secondaryPrompt: t("secondaryPrompt"),
              signedInAs: t("signedInAs"),
            }}
          />
          {/* <TrendingNowCard /> */}
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {/* <CardsGridClient /> */}
        </div>
      </section>
      <section
        id="comments"
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      >
        {/* <Comments /> */}
      </section>
    </div>
  );
}
