"use client";
import SearchBtnIcon from "@/app/components/client/ui/SearchBtnIcon";
import ThemeModeBtn from "@/app/components/client/ui/ThemeModeBtn";
import BtnSignIn from "@/app/components/client/ui/BtnSign";
import NavMenu from "@/app/components/client/navigation/NavMenu";
import Image from "next/image";
import Link from "next/link";
import SidebarBtn from "@/app/components/client/ui/SidebarBtn";
import { useGlobalStore } from "@/app/store/stateGlobals";
import { useState, useEffect } from "react";
import LanguageSelector from "@/app/components/client/ui/LanguageSelector";

const Header = () => {
  const { openSearchBar } = useGlobalStore();
  const [categories, setCategories] = useState<
    Array<{ label: string; href: string }>
  >([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          // Fix to ensure href is always valid
          const mapped = Array.isArray(data)
            ? data
                .filter(
                  (cat) =>
                    typeof cat.label === "string" &&
                    typeof cat.Slug === "string",
                )
                .map((cat) => ({ label: cat.label, href: cat.Slug }))
            : [];
          setCategories(mapped);
        }
      } catch {}
    };
    load();
  }, []);

  return (
    <div className="max-w-screen" id="header">
      <header
        id="site-header"
        className={`w-full relative py-4 bg-primary-blue flex flex-row items-center px-[10%] shadow-[inset_0_-5px_10px_rgba(0,0,0,0.1)] justify-between`}
      >
        <div className="relative z-20 flex items-center justify-center gap-2 md:gap-5">
          <SidebarBtn />
          <div className="hidden lg:block">
            <SearchBtnIcon />
          </div>
        </div>
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div
            className={`flex items-center justify-center ${openSearchBar ? "w-0 opacity-0 xl:opacity-100 xl:w-50" : "w-40 opacity-100 xl:w-50"} transition-all duration-500 ease-in-out`}
          >
            <Link href="/" className="pointer-events-auto inline-flex">
              <Image
                src="/images/logo-header.png"
                width={500}
                height={500}
                alt=""
                loading="eager"
                className={`transition-all duration-500 ease-in-out`}
              />
            </Link>
          </div>
        </div>
        <div
          className={`relative z-20 lg:flex lg:items-center lg:justify-center lg:gap-5 transition-all duration-500 ease-in-out ${openSearchBar ? "w-full lg:w-auto" : "w-6 justify-end lg:justify-center lg:w-auto"}`}
        >
          <div className="xs:hidden xl:block">
            <LanguageSelector />
          </div>
          <ThemeModeBtn />
          <BtnSignIn />
          <div
            className={`block lg:hidden transition-all duration-500 ease-in-out`}
          >
            <SearchBtnIcon />
          </div>
        </div>
      </header>
      <NavMenu categories={categories} />
    </div>
  );
};

export default Header;
