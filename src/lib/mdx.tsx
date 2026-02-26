import { evaluate } from "@mdx-js/mdx";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Callout } from "@/components/ui/Callout";
import { CommonMisconception } from "@/components/ui/CommonMisconception";
import { TryIt } from "@/components/ui/TryIt";
import { QuizQuestion } from "@/components/ui/QuizQuestion";

const mdxComponents = {
  Callout,
  CommonMisconception,
  TryIt,
  QuizQuestion,
};

export async function compileMDXContent(source: string) {
  const { default: Content } = await evaluate(source, {
    Fragment,
    jsx,
    jsxs,
  });

  return <Content components={mdxComponents} />;
}
