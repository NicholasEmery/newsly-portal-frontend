"use client";

import { useEffect, useState } from "react";

export const useSectionReveal = (ready: boolean) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ready) {
      setShow(false);
      return;
    }

    const frame = requestAnimationFrame(() => {
      setShow(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [ready]);

  const revealClass = `transition-all duration-500 ease-out motion-reduce:transition-none ${
    show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
  }`;

  return { show, revealClass };
};
