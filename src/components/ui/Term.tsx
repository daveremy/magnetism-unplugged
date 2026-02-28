"use client";

import type { ReactNode } from "react";
import { glossary } from "@/lib/glossary";
import { TooltipShell } from "./TooltipShell";

interface TermProps {
  /** Glossary key, e.g. "magnetic domain" */
  id: string;
  /** Inline text displayed (may differ from key, e.g. "domains") */
  children: ReactNode;
}

export function Term({ id, children }: TermProps) {
  const definition = glossary[id];

  if (!definition) {
    return <>{children}</>;
  }

  return (
    <TooltipShell
      triggerClassName="text-north border-b border-dotted border-north/60 cursor-help"
      triggerContent={children}
    >
      {definition}
    </TooltipShell>
  );
}
