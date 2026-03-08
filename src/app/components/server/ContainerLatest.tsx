import Image from "next/image";
import type { HomeSectionItemDto as HomeSectionItem } from "@/api/schemas/homepage";

interface ContainerLatestProps {
  item: HomeSectionItem;
}

const ContainerLatest = ({ item }: ContainerLatestProps) => {
  return (
    <div className="flex flex-col-reverse lg:flex-row justify-center gap-4 cursor-pointer">
      <div className="flex flex-col justify-center">
        <div className="flex justify-center gap-2 mb-2.5">
          <h1 className="text-[clamp(1rem,1vw,1.5rem)] text-left mr-3 hover:text-primary-blue transition-colors duration-400">
            {item.Title}
          </h1>
        </div>
        <div className="flex flex-col justify-center gap-0.5">
          <span className="text-gray-400 text-[clamp(0.7rem,0.6vw,0.8rem)] font-medium! text-left">
            by
          </span>
          <p className="text-[clamp(0.7rem,0.6vw,0.8rem)] font-semibold! text-left uppercase">
            {item.Creator}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Image
          src={item.ImgUrl}
          width={100}
          height={100}
          alt=""
          className="w-60 rounded-full border-3 border-primary-blue"
        />
      </div>
    </div>
  );
};

export default ContainerLatest;
