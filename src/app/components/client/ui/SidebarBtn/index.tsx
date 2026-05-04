import { useGlobalStore } from "@/app/store/stateGlobals";
import { useTranslations } from "next-intl";

const SidebarBtn = () => {
  const { open, setOpen, setOpenSearchBar } = useGlobalStore();
  const t = useTranslations("header");

  const toggle = () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen) setOpenSearchBar(false);
  };

  return (
    <button
      className="relative w-6 h-6 flex items-center justify-center cursor-pointer"
      onClick={toggle}
      aria-label={t("openMenu")}
    >
      <span
        className={`block bg-white h-0.5 w-full rounded-full absolute transition-all duration-500 ${
          open
            ? "transform translate-y-0 -rotate-45"
            : "transform -translate-y-2"
        }`}
      ></span>
      <span
        className={`block bg-white h-0.5 rounded-full absolute transition-all duration-500 ${
          open ? "w-0" : "w-full"
        }`}
      ></span>
      <span
        className={`block bg-white h-0.5 w-full rounded-full absolute transition-all duration-500 ${
          open ? "transform translate-y-0 rotate-45" : "transform translate-y-2"
        }`}
      ></span>
    </button>
  );
};

export default SidebarBtn;
