"use client";

import { CgClose } from "react-icons/cg";
import { useGlobalStore } from "@/app/store/stateGlobals";

const SidebarMenu = () => {
  const { open, setOpen } = useGlobalStore();
  return (
    <div
      className={`fixed top-0 left-0 shrink-0 h-screen max-h-screen overflow-y-auto bg-gray-100 dark:bg-gray-700 border-l-0 border-white dark:border-white/20 shadow-lg transition-transform duration-500 ease-in-out ${open ? "translate-x-0 w-64 min-w-[16rem] dark:border-r" : "-translate-x-full w-64 min-w-[16rem]"} overflow-hidden z-[1200]`}
    >
      <div className="p-6 text-black h-full flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-[clamp(0.9rem,1.5vw,2.5rem)] font-bold dark:text-white">
            Menu
          </h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="my-4">
              <a
                href="#"
                className="block p-2 text-[clamp(0.875rem,1vw,1.75rem)] text-black rounded hover:bg-gray-700 hover:text-white dark:hover:bg-gray-500 dark:hover:text-gray-300 dark:text-white"
              >
                Home
              </a>
            </li>
            <li className="my-4">
              <a
                href="#"
                className="block p-2 text-[clamp(0.875rem,1vw,1.75rem)] text-black rounded hover:bg-gray-700 hover:text-white dark:hover:bg-gray-500 dark:hover:text-gray-300 dark:text-white"
              >
                About
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SidebarMenu;
