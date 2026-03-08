import LatestNews from "@/app/components/server/LatestNews";
import TrendingNow from "@/app/components/server/TrendingNow";
import SubscriberBanner from "@/app/components/server/SubscriberBanner";
import SubscriberSection from "@/app/components/server/SubscriberSection";
import CardsGrid from "@/app/components/server/CardsGrid";
import { Fragment } from "react";
import { getHomeSections } from "@/api/services/homeSections";
import Newsletter from "../components/client/NewsLetter";

export default async function Home() {
  const homeData = await getHomeSections({
    trendingNow: { limit: 4, page: 1 },
    latestNews: { limit: 8, page: 1 },
    homeGrids: { limit: 4, page: 1 },
    subscriberNews: { limit: 2, page: 1 },
  });

  if (!homeData) {
    // O layout já faz o redirecionamento/fallback, então só retorna null
    return null;
  }

  const subscriberQueue = homeData.SubscriberNews;

  let bannerCount = 0; // tracks how many banners were rendered to alternate components
  let subscriberCursor = 0; // pointer to the next subscriber item to render
  return (
    <main className="w-full flex flex-col items-center justify-center mt-16 gap-15">
      <div className="w-3/4 flex flex-col items-center justify-center gap-16">
        <TrendingNow
          TopNotice={homeData.TopNotice}
          TrendingNow={homeData.TrendingNow}
        />
        {homeData.HomeGrids[0] && (
          <CardsGrid
            FilterLabel={homeData.HomeGrids[0].FilterLabel}
            Category={homeData.HomeGrids[0].Category}
            Items={homeData.HomeGrids[0].Items.filter(
              (item) => !item.isSubscriber,
            )}
          />
        )}
        <LatestNews section={homeData.LatestNews} />
        {homeData.HomeGrids.slice(1).map((section) => {
          return (
            <Fragment key={`${section.FilterLabel}-${section.Category}`}>
              <CardsGrid
                FilterLabel={section.FilterLabel}
                Category={section.Category}
                Items={section.Items.filter((item) => !item.isSubscriber)}
              />
              {subscriberCursor < subscriberQueue.length &&
                (() => {
                  const subscriberItem = subscriberQueue[subscriberCursor];
                  const bannerIndex = bannerCount + 1; // next banner position in overall order
                  const BannerComponent =
                    bannerIndex % 2 === 0
                      ? SubscriberSection
                      : SubscriberBanner;
                  bannerCount += 1;
                  subscriberCursor += 1;

                  return (
                    <BannerComponent
                      key={`${subscriberItem.Title}-${bannerIndex}`}
                      Category={subscriberItem.Category || section.Category}
                      Title={subscriberItem.Title || ""}
                      CreatedAt={subscriberItem.CreatedAt || "-"}
                      CountComments={subscriberItem.CommentsCount || 0}
                      ImageUrl={subscriberItem.ImgUrl || ""}
                      Creator={subscriberItem.Creator || ""}
                      Description={subscriberItem.Description || ""}
                      Slug={subscriberItem.Slug || ""}
                    />
                  );
                })()}
            </Fragment>
          );
        })}
        <Newsletter />
      </div>
    </main>
  );
}
