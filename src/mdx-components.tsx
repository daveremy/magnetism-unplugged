import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Children, isValidElement } from "react";
import { Callout } from "@/components/ui/Callout";
import { CommonMisconception } from "@/components/ui/CommonMisconception";
import { TryIt } from "@/components/ui/TryIt";
import { QuizQuestion } from "@/components/ui/QuizQuestion";
import { MagnetPoles } from "@/components/visualizations/MagnetPoles";
import { slugify } from "@/lib/toc";

/** Recursively extract plain text from React children (handles inline formatting). */
function extractTextFromChildren(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string") return child;
      if (typeof child === "number") return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return extractTextFromChildren(child.props.children);
      }
      return "";
    })
    .join("");
}

/** Create an MDX heading override that injects a slugified id. */
function headingWithId(Tag: "h2" | "h3") {
  return function HeadingWithId(props: ComponentPropsWithoutRef<typeof Tag>) {
    return <Tag id={slugify(extractTextFromChildren(props.children))} {...props} />;
  };
}

/** Shared component map used by both Next.js MDX integration and manual compilation. */
export const mdxComponents: MDXComponents = {
  Callout,
  CommonMisconception,
  TryIt,
  QuizQuestion,
  MagnetPoles,
  h2: headingWithId("h2"),
  h3: headingWithId("h3"),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
