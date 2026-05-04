import Image from "next/image";
import { getTranslations } from "next-intl/server";

interface CardLatestNewsProps {
  imgUrl?: string;
  Title: string;
  Creator: string;
}

const CardLatestNews = async ({
  imgUrl,
  Title,
  Creator,
}: CardLatestNewsProps) => {
  const t = await getTranslations("cards");
  return (
    <div className="flex flex-col items-center justify-center gap-4 border-b-2 py-5 border-gray-300">
      {imgUrl && (
        <div className="w-full">
          <Image
            src={imgUrl}
            width={500}
            height={500}
            alt=""
            className="rounded-11xl w-full"
          />
        </div>
      )}
      <div className="flex flex-col items-start justify-center gap-3">
        <h1 className="text-[clamp(1rem,1vw,1.5rem)] hover:text-primary-blue cursor-pointer transition-all duration-300">
          {Title}
        </h1>
        <div className="flex flex-wrap flex-row items-center justify-start gap-2">
          <div className="flex items-center justify-center">
            <span className="mr-1 text-gray-400 text-[clamp(0.7rem,0.6vw,0.8rem)] !font-medium">
              {t("by")}
            </span>
            <p className="text-[clamp(0.7rem,0.6vw,0.8rem)] !font-semibold uppercase">
              {Creator}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardLatestNews;
