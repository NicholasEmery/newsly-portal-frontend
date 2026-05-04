import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type SectionFrameSpacing = "none" | "sm" | "md" | "lg";

type SectionFrameProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "article";
  spacing?: SectionFrameSpacing;
};

const spacingClassName: Record<SectionFrameSpacing, string> = {
  none: "",
  sm: "mt-6",
  md: "mt-8 md:mt-10 xl:mt-12",
  lg: "mt-10 md:mt-12 xl:mt-16",
};

const SectionFrame = ({
  as = "section",
  spacing = "none",
  className,
  children,
  ...props
}: SectionFrameProps) => {
  const Component = as;

  return (
    <Component
      className={cn(
        "relative isolate w-full",
        spacingClassName[spacing],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default SectionFrame;
