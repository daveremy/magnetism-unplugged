import type { ReactElement } from "react";
import { evaluate } from "@mdx-js/mdx";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { mdxComponents } from "@/mdx-components";

export async function compileMDXContent(source: string): Promise<ReactElement> {
  try {
    const { default: Content } = await evaluate(source, {
      Fragment,
      jsx,
      jsxs,
    });

    return <Content components={mdxComponents} />;
  } catch (error) {
    throw new Error(
      `MDX compilation failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
