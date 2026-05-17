"use client";

import React, { useMemo, useState } from "react";
import DOMPurify from "dompurify";
import {
  registerComponent,
  type NoticeComponentProps,
} from "./ComponentRegistry";

type AccordionItem = {
  title: string;
  contentHtml: string;
};

const AccordionComponent: React.FC<NoticeComponentProps> = ({
  rawHtml,
  attributes,
}) => {
  const items = useMemo<AccordionItem[]>(() => {
    if (!rawHtml) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");
    const list = Array.from(doc.querySelectorAll("item")).map((item, index) => {
      const title =
        item.getAttribute("data-title")?.trim() || `Item ${index + 1}`;

      return {
        title,
        contentHtml: DOMPurify.sanitize(item.innerHTML),
      };
    });

    return list;
  }, [rawHtml]);

  const initialOpenIndex = useMemo(() => {
    const openFirst = attributes?.["data-open-first"];
    if (openFirst?.toLowerCase() === "false") return -1;
    return 0;
  }, [attributes]);

  const [openIndex, setOpenIndex] = useState<number>(initialOpenIndex);

  if (!items.length) return null;

  return (
    <section className="my-8 rounded-[32px] bg-white px-6 py-5 md:px-12 md:py-9 dark:bg-gray-800 dark:border dark:border-gray-400/30">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.title + index}
            className="border-b border-[#d7d7d7] py-4 md:py-6 dark:border-gray-400/20"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span className="pr-4 text-[24px] font-semibold leading-tight text-[#131722] md:text-[30px] dark:text-gray-100">
                {item.title}
              </span>
              <span
                className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-2xl leading-none transition-colors ${
                  isOpen
                    ? "border-[#4a5cf2] bg-[#4a5cf2] text-white"
                    : "border-[#d0d0d0] bg-transparent text-[#121722] dark:border-gray-400/30 dark:text-gray-100"
                }`}
              >
                {isOpen ? "-" : "+"}
              </span>
            </button>

            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div
                  className={`max-w-225 pt-4 text-[24px] leading-[1.55] text-[#3b3f49] transition-all duration-300 dark:text-gray-300 md:pt-6 ${
                    isOpen
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-1 opacity-0"
                  }`}
                  dangerouslySetInnerHTML={{ __html: item.contentHtml }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

// Register the component so the renderer can find it
try {
  registerComponent("accordion", AccordionComponent);
} catch (e) {
  // noop in case of SSR or double-register
}

export default AccordionComponent;
