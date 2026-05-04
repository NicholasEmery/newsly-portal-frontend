import { notFound } from "next/navigation";
import ProfilesCard from "./components/ProfilesCard";
import Notice from "./components/Notice";
import { getNoticeArticleBySlug } from "@/api/services/notice";

type Props = { params: Promise<{ slug: string }> };

export default async function NoticePage({ params }: Props) {
  const { slug } = await params;

  const notice = await getNoticeArticleBySlug(slug);

  if (!notice) {
    notFound();
  }

  return (
    <div className="h-full w-full">
      <section className="grid grid-cols-3 px-30 py-10 gap-2">
        <div className="flex flex-col items-center justify-start">
          <ProfilesCard
            owner={notice.Creators.Owner}
            collaborators={notice.Creators.Colaborators}
          />
          {/* <TopicsCard /> */}
        </div>
        <div className="flex flex-col items-center justify-start">
          <Notice htmlContent={notice.notice ?? ""} />
          {/* <CreatorsBanner /> */}
          {/* <NewsletterBanner /> */}
          {/* <NextOrPrevious /> */}
        </div>
        <div>
          {/* <SubscriberCard /> */}
          {/* <TrendingNowCard /> */}
        </div>
      </section>
      <section className="grid grid-cols-3 grid-rows-2 gap-4 px-30 py-10">
        <div></div>
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          {/* <CardsGridClient /> */}
        </div>
      </section>
      <section className="px-30 py-10">{/* <Comments /> */}</section>
    </div>
  );
}
