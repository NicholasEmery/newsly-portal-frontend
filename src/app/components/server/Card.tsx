import Image from "next/image";
import Link from "next/link";
import Comments from "./Comments";
import { buildCreatorRoute } from "@/utils/userRoute";
import DateDisplay from "./DateDisplay";

export interface CardProps {
  ImgUrl?: string;
  Title: string;
  Description?: string;
  Creator: string;
  Slug: string;
  CommentsCount?: number;
  Category?: string;
  CreatedAt?: string;
}

const Card = ({
  ImgUrl,
  Title,
  Description,
  Creator,
  Slug,
  CommentsCount,
  Category,
  CreatedAt,
}: CardProps) => {
  const resolvedCreatorHref = buildCreatorRoute(Creator);

  return (
    <div className="flex flex-col items-start justify-center gap-4">
      <Link href={Slug} className="w-full">
        {ImgUrl ? (
          <div
            className={`w-full ${Category ? "h-36 sm:h-48 md:h-56 lg:h-64 xl:h-72" : "h-30 sm:h-40 md:h-60 lg:h-50 xl:h-50"} bg-cover bg-no-repeat bg-center rounded-11xl`}
            style={{ backgroundImage: `url(${ImgUrl})` }}
          />
        ) : (
          <div className="w-full hidden" aria-hidden />
        )}
      </Link>
      <div
        className={`w-full text-center lg:text-left ${Category ? "lg:max-w-none" : "lg:max-w-[340px]"} flex flex-col lg:items-start items-center justify-center gap-3`}
      >
        {Category && (
          <p className="text-[clamp(0.7rem,0.6vw,0.8rem)] font-semibold! uppercase">
            {Category}
          </p>
        )}
        <Link href={Slug} className="flex flex-col gap-3">
          <h1
            className={`${Description ? "line-clamp-1" : "line-clamp-2"} text-[clamp(1rem,1vw,1.5rem)] hover:text-primary-blue cursor-pointer transition-all duration-300`}
          >
            {Title}
          </h1>
          {Description && !Category ? (
            <p className="line-clamp-3 dark:text-gray-400 text-[clamp(0.8rem,0.7vw,0.9rem)]">
              {Description}
            </p>
          ) : (
            <p className="hidden" aria-hidden />
          )}
        </Link>
        <div
          className={`flex flex-wrap ${Category ? "flex-row-reverse" : "flex-row"} items-center justify-center lg:justify-start gap-2`}
        >
          <div className="flex items-center justify-center">
            <span className="mr-1 text-gray-400 text-[clamp(0.7rem,0.6vw,0.8rem)] font-medium!">
              by
            </span>
            <Link href={resolvedCreatorHref}>
              <p className="text-[clamp(0.7rem,0.6vw,0.8rem)] font-semibold! hover:text-gray-500 transition-colors duration-500 uppercase">
                {Creator}
              </p>
            </Link>
          </div>
          {!Category && <Comments commentCount={CommentsCount ?? 0} />}
          {Category && <DateDisplay date={CreatedAt || ""} variant="gray" />}
        </div>
      </div>
    </div>
  );
};

export default Card;
