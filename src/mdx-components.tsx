import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/ui/Callout";
import { CommonMisconception } from "@/components/ui/CommonMisconception";
import { TryIt } from "@/components/ui/TryIt";
import { QuizQuestion } from "@/components/ui/QuizQuestion";
import { MagnetPoles } from "@/components/visualizations/MagnetPoles";

/** Shared component map used by both Next.js MDX integration and manual compilation. */
export const mdxComponents: MDXComponents = {
  Callout,
  CommonMisconception,
  TryIt,
  QuizQuestion,
  MagnetPoles,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
