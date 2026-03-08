import Card, { CardProps } from "./Card";
import Link from "next/link";

interface CardsGridProps {
  FilterLabel: string;
  Category: string;
  Items: CardProps[];
}

const CardsGrid = ({ FilterLabel, Category, Items }: CardsGridProps) => {
  const ViewMoreSlug = `/${Category.toLowerCase()}`;

  return (
    <section className="w-full flex flex-col justify-center items-center gap-10">
      <div className="w-full flex flex-row items-center justify-between p-4 border-b-2 border-gray-300">
        <h1 className="font-bold uppercase text-[clamp(1rem,1vw,1.5rem)] text-left">
          {FilterLabel}
        </h1>
        <p className="text-black font-space-grotesk! font-semibold! text-[clamp(0.8rem,0.8vw,1.2rem)] hover:text-primary-blue transition-colors duration-400 dark:text-white">
          <Link href={ViewMoreSlug}>View More</Link>
        </p>
      </div>
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 ${FilterLabel === "Dont Miss Out" ? "2xl:grid-cols-3" : "2xl:grid-cols-4"} items-start justify-center gap-6`}
      >
        {Items.slice(0, FilterLabel === "Dont Miss Out" ? 3 : 4).map(
          (item, idx) => (
            <Card
              key={item.Title + idx}
              {...item}
              Category={
                FilterLabel === "Dont Miss Out" ? item.Category : undefined
              }
            />
          ),
        )}
      </div>
    </section>
  );
};

export default CardsGrid;
