"use client";

import React, { useMemo } from "react";
import DOMPurify from "dompurify";
import { getComponent } from "./ComponentRegistry";
import styles from "./Notice.module.css";
// ensure built-in components register themselves (side-effect import)
import "./AccordionComponent";

type Props = {
  htmlContent: string;
};

export default function Notice({ htmlContent }: Props) {
  const nodes = useMemo<React.ReactNode[]>(() => {
    if (!htmlContent) return [];

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const body = doc.body;

      const entries: Array<
        | { type: "html"; html: string }
        | {
            type: "component";
            name: string;
            attributes: Record<string, string>;
            rawHtml: string;
          }
      > = [];

      const components = Array.from(body.querySelectorAll("[data-component]"));

      components.forEach((el, index) => {
        const marker = `__NOTICE_COMPONENT_${index}__`;
        const name = el.getAttribute("data-component") || "";
        const attributes: Record<string, string> = {};
        Array.from(el.attributes).forEach((a) => {
          attributes[a.name] = a.value;
        });

        entries.push({
          type: "component",
          name,
          attributes,
          rawHtml: el.innerHTML,
        });

        el.replaceWith(doc.createComment(marker));
      });

      const htmlWithMarkers = body.innerHTML;
      const markerRegex = /<!--\s*__NOTICE_COMPONENT_(\d+)__\s*-->/g;
      const out: React.ReactNode[] = [];
      let lastIndex = 0;
      let keyIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = markerRegex.exec(htmlWithMarkers)) !== null) {
        const htmlChunk = htmlWithMarkers.slice(lastIndex, match.index).trim();
        if (htmlChunk) {
          out.push(
            <div
              key={`html-${keyIndex++}`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(htmlChunk),
              }}
            />,
          );
        }

        const componentEntry = entries[Number(match[1])];
        if (componentEntry?.type === "component") {
          const Comp = getComponent(componentEntry.name);
          if (Comp) {
            out.push(
              <Comp
                key={`comp-${keyIndex++}`}
                attributes={componentEntry.attributes}
                rawHtml={componentEntry.rawHtml}
              />,
            );
          } else {
            out.push(
              <div
                key={`fallback-${keyIndex++}`}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    `<div data-component="${componentEntry.name}">${componentEntry.rawHtml}</div>`,
                  ),
                }}
              />,
            );
          }
        }

        lastIndex = markerRegex.lastIndex;
      }

      const trailing = htmlWithMarkers.slice(lastIndex).trim();
      if (trailing) {
        out.push(
          <div
            key={`html-${keyIndex++}`}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(trailing) }}
          />,
        );
      }

      return out;
    } catch {
      return [
        <div
          key="notice-fallback"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
        />,
      ];
    }
  }, [htmlContent]);

  return <article className={`${styles.content} max-w-none`}>{nodes}</article>;
}
