"use client";

import type { ReactNode } from "react";
import { alloys } from "@/lib/alloys";
import { TooltipShell } from "./TooltipShell";

const behaviorLabel: Record<string, string> = {
  ferromagnetic: "Ferromagnetic",
  varies: "Varies by grade",
};

interface AlloyProps {
  /** Alloy key, e.g. "steel" */
  id: string;
  /** Inline display text */
  children: ReactNode;
}

export function Alloy({ id, children }: AlloyProps) {
  const alloy = alloys[id];
  if (!alloy) return <>{children}</>;

  return (
    <TooltipShell
      triggerClassName="text-experiment border-b border-solid border-experiment/40 cursor-help"
      maxWidth="max-w-sm"
      triggerContent={children}
    >
      <span className="block">
        {/* Name */}
        <span className="block text-sm font-semibold text-ink mb-0.5">
          {alloy.name}
        </span>

        {/* Behavior badge */}
        <span className="inline-flex items-center gap-1 text-xs font-medium text-experiment mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-current" />
          {behaviorLabel[alloy.magneticBehavior]}
        </span>

        {/* Composition bar */}
        <span className="block border-t border-rule pt-2 mt-1">
          <span
            className="flex w-full h-6 rounded overflow-hidden"
            role="img"
            aria-label={`Composition: ${alloy.ingredients
              .map((i) => `${i.label} ${Math.round(i.proportion * 100)}%`)
              .join(", ")}`}
          >
            {alloy.ingredients.map((ingredient) => (
              <span
                key={ingredient.symbol}
                className="flex items-center justify-center text-[10px] font-bold text-white"
                style={{
                  width: `${ingredient.proportion * 100}%`,
                  backgroundColor: ingredient.color,
                  minWidth: ingredient.proportion < 0.08 ? "1.5rem" : undefined,
                }}
              >
                {ingredient.proportion < 0.08
                  ? ingredient.symbol
                  : `${ingredient.label} ${Math.round(ingredient.proportion * 100)}%`}
              </span>
            ))}
          </span>
        </span>

        {/* Note */}
        {alloy.note && (
          <span className="block text-xs text-ink-faint italic mt-2">
            {alloy.note}
          </span>
        )}
      </span>
    </TooltipShell>
  );
}
