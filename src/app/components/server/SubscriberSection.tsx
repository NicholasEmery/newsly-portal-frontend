import { HiOutlineLockClosed } from "react-icons/hi";
import Comments from "./Comments";
import Link from "next/link";
import DateDisplay from "./DateDisplay";

interface SubscriberSectionProps {
  Category: string;
  Title: string;
  ImageUrl: string;
  CreatedAt: string;
  CountComments: number;
  Slug: string;
}

const SubscriberSetion = ({
  Category,
  Title,
  ImageUrl,
  CreatedAt = "-",
  CountComments,
  Slug,
}: SubscriberSectionProps) => {
  return (
    <Link href={Slug}>
      <section className="group relative overflow-hidden cursor-pointer flex flex-col justify-end items-center w-[calc(100vw-80px)] mx-10 h-150 py-10 text-white rounded-11xl shadow-inset-[inset_0_0_0_9999px_rgba(0,0,0,0.25)]">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-center transition-transform duration-800 ease-out will-change-transform group-hover:scale-105 "
          style={{
            backgroundImage: `url(${ImageUrl})`,
          }}
        />
        <div className="absolute inset-0 bg-black/25" />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/45 via-black/15 to-transparent backdrop-blur-sm"
          style={{
            WebkitMaskImage:
              "linear-gradient(to top, black 20%, transparent 100%)",
            maskImage: "linear-gradient(to top, black 20%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute top-0 left-0 w-32 h-32 transform -translate-x-4 -translate-y-4 scale-75 opacity-0 transition-translate duration-800 ease-out bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.50),transparent_70%)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100" />
          <span className="absolute top-0 right-0 w-32 h-32 transform translate-x-4 -translate-y-4 scale-75 opacity-0 transition-translate duration-800 ease-out bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.50),transparent_70%)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100" />
          <span className="absolute bottom-0 left-0 w-32 h-32 transform -translate-x-4 translate-y-4 scale-75 opacity-0 transition-translate duration-800 ease-out bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.50),transparent_70%)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100" />
          <span className="absolute bottom-0 right-0 w-32 h-32 transform translate-x-4 translate-y-4 scale-75 opacity-0 transition-translate duration-800 ease-out bg-[radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.50),transparent_70%)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100" />
        </div>
        <div className="mx-10 relative z-10 flex flex-col justify-center items-center gap-5">
          <div className="flex flex-row items-center justify-center gap-2">
            <p className="px-3 py-1 mr-2 bg-primary-blue rounded-full text-[clamp(0.7rem,0.6vw,0.8rem)] font-semibold! uppercase">
              {Category}
            </p>
            <div className="flex items-center justify-center gap-1">
              <HiOutlineLockClosed className="text-[clamp(0.9rem,1vw,1.1rem)] font-medium!" />
              <p className="text-[clamp(0.7rem,0.6vw,0.8rem)] font-medium! uppercase">
                For Subscribers
              </p>
            </div>
          </div>
          <h1 className="cursor-pointer font-bold text-center text-[clamp(1.5rem,2.3vw,3.1rem)] hover:text-primary-blue transition-colors duration-400 border-b border-gray-200/50 p-2">
            {Title}
          </h1>
          <div className="flex flex-row justify-center items-center gap-2">
            <DateDisplay date={CreatedAt} variant="white" />
            <Comments commentCount={CountComments} />
          </div>
        </div>
      </section>
    </Link>
  );
};

export default SubscriberSetion;
