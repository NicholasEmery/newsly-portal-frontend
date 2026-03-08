import Image from "next/image";
import Link from "next/link";
import { buildCreatorRoute } from "@/utils/userRoute";

interface CardSimplifiedProps {
  Title: string;
  Creator: string;
  Slug: string;
  ImgUrl?: string;
  ImgUrlCreator?: string;
}

function CardSimplified({
  Title,
  Creator,
  Slug,
  ImgUrl,
  ImgUrlCreator,
}: CardSimplifiedProps) {
  const resolvedCreatorHref = buildCreatorRoute(Creator);

  return (
    <div
      className={`flex ${ImgUrlCreator ? "xs:flex-col-reverse xl:flex-row justify-evenly" : "flex-col-reverse lg:flex-row justify-between"} items-center`}
    >
      <div
        className={`flex flex-col ${ImgUrlCreator ? "justify-center" : "justify-start"} w-full xl:max-w-[60%] lg:max-w-[60%]`}
      >
        <Link href={Slug}>
          <div className="flex justify-center gap-2 mb-2.5 cursor-pointer">
            <h1
              className={`text-[clamp(1rem,1vw,1.5rem)] text-center ${ImgUrlCreator ? "line-clamp-2 xl:text-left" : "line-clamp-2 md:text-left"} hover:text-primary-blue transition-colors duration-400`}
            >
              {Title}
            </h1>
          </div>
        </Link>
        <div
          className={`flex ${ImgUrlCreator ? "flex-col gap-0.5 xl:items-start" : "flex-row gap-1 md:justify-start"} justify-center items-center`}
        >
          <span className="text-gray-400 text-[clamp(0.7rem,0.6vw,0.8rem)] font-medium! text-left">
            by
          </span>
          <Link href={resolvedCreatorHref}>
            <p className="text-[clamp(0.7rem,0.6vw,0.8rem)] font-semibold! hover:text-gray-500 transition-colors duration-500 uppercase cursor-pointer">
              {Creator}
            </p>
          </Link>
        </div>
      </div>
      <Link href={ImgUrlCreator ? resolvedCreatorHref : Slug}>
        {ImgUrl ? (
          <div
            className="w-full h-30 mb-3 lg:w-23 lg:h-23 sm:h-35 flex items-center justify-center bg-cover bg-no-repeat bg-center rounded-xl cursor-pointer"
            style={{ backgroundImage: `url(${ImgUrl})` }}
          />
        ) : (
          <div
            className="w-23 h-23 xl:h-20 xl:w-20 2xl:w-23 2xl:h-23 flex items-center justify-center bg-cover bg-no-repeat bg-center rounded-full border-3 border-primary-blue cursor-pointer"
            style={{ backgroundImage: `url(${ImgUrlCreator})` }}
          />
        )}
      </Link>
    </div>
  );
}

export default CardSimplified;
