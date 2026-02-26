import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/ui/Callout";
import { CommonMisconception } from "@/components/ui/CommonMisconception";
import { TryIt } from "@/components/ui/TryIt";
import { QuizQuestion } from "@/components/ui/QuizQuestion";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    CommonMisconception,
    TryIt,
    QuizQuestion,
    ...components,
  };
}
