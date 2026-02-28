"use client";

import type { ReactNode } from "react";
import { elements } from "@/lib/elements";
import { periodicContext } from "@/lib/periodic-context";
import { TooltipShell } from "./TooltipShell";

const behaviorColor: Record<string, string> = {
  ferromagnetic: "text-north",
  paramagnetic: "text-caution",
  diamagnetic: "text-south",
};

const behaviorLabel: Record<string, string> = {
  ferromagnetic: "Ferromagnetic",
  paramagnetic: "Paramagnetic",
  diamagnetic: "Diamagnetic",
};

interface ElementProps {
  /** Element symbol, e.g. "Fe" */
  id: string;
  /** Inline display text (e.g. "iron") */
  children: ReactNode;
}

export function Element({ id, children }: ElementProps) {
  const el = elements[id];
  if (!el) return <>{children}</>;

  const context = periodicContext[id];
  const color = behaviorColor[el.magneticBehavior];

  return (
    <TooltipShell
      triggerClassName="text-south border-b border-dashed border-south/40 cursor-help"
      maxWidth="max-w-sm"
      triggerContent={children}
    >
      <span className="block">
        {/* Header: atomic number + symbol + name */}
        <span className="flex items-start justify-between gap-3 mb-1">
          <span className="block">
            <span className="block text-xs text-ink-faint">{el.atomicNumber}</span>
            <span className={`block text-2xl font-bold leading-tight ${color}`}>
              {el.symbol}
            </span>
            <span className="block text-sm font-medium text-ink">{el.name}</span>
          </span>
          <span className="block text-right mt-1">
            <span className="block text-xs text-ink-faint mb-0.5">
              {el.unpairedElectrons} unpaired e⁻
            </span>
            <span className="block text-base tracking-wider" aria-label={`${el.unpairedElectrons} unpaired electrons`}>
              {Array.from({ length: el.unpairedElectrons }, (_, i) => (
                <span key={i} className={color}>↑</span>
              ))}
            </span>
          </span>
        </span>

        {/* Behavior badge */}
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${color} mb-2`}>
          <span className="inline-block w-2 h-2 rounded-full bg-current" />
          {behaviorLabel[el.magneticBehavior]}
        </span>

        {/* Note */}
        {el.note && (
          <span className="block text-xs text-ink-faint italic mb-2">{el.note}</span>
        )}

        {/* Periodic table row context */}
        {context && (
          <span className="block border-t border-rule pt-2 mt-1">
            <span className="flex justify-center gap-1">
              {context.map((cell) => {
                const isSelf = cell.symbol === el.symbol;
                return (
                  <span
                    key={cell.symbol}
                    className={`flex flex-col items-center px-1.5 py-1 rounded text-xs leading-tight ${
                      isSelf
                        ? "bg-south/15 font-bold ring-1 ring-south/30"
                        : "text-ink-faint"
                    }`}
                  >
                    <span className="text-[10px]">{cell.atomicNumber}</span>
                    <span className={isSelf ? color : ""}>{cell.symbol}</span>
                  </span>
                );
              })}
            </span>
          </span>
        )}
      </span>
    </TooltipShell>
  );
}
