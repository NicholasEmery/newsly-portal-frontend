import HeroSection from "./components/sections/HeroSection";
import LatestSection from "./components/sections/LatestSection";
import GridsSection from "./components/sections/GridsSection";
import CategoriesSection from "./components/sections/CategoriesSection";
import SectionFrame from "./components/layout/SectionFrame";
import Newsletter from "../components/client/forms/NewsLetter";

export default async function Home() {
  return (
    <main className="w-full mt-16">
      <div className="w-3/4 mx-auto flex flex-col items-center justify-center space-y-16">
        <div className="w-full rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
          Mock feature-flow test: frontend banner habilitado para validar o
          disparo do orchestrator.
        </div>

        <SectionFrame data-cy="home-section-hero">
          <HeroSection />
        </SectionFrame>

        <SectionFrame data-cy="home-section-latest">
          <LatestSection />
        </SectionFrame>

        <SectionFrame data-cy="home-section-grids">
          <GridsSection />
        </SectionFrame>

        <SectionFrame as="section" data-cy="home-section-newsletter">
          <Newsletter />
        </SectionFrame>

        <SectionFrame as="section" data-cy="home-section-category-columns">
          <CategoriesSection />
        </SectionFrame>
      </div>
    </main>
  );
}
