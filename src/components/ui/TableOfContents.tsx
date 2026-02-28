"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import type { TocSection } from "@/lib/toc";

interface TableOfContentsProps {
  sections: TocSection[];
}

export function TableOfContents({ sections }: TableOfContentsProps): ReactElement | null {
  const [isOpen, setIsOpen] = useState(false);

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mb-10 rounded-lg border border-rule bg-paper-warm px-5 py-4"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 text-left font-serif text-xs font-semibold uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
        aria-expanded={isOpen}
      >
        <span
          className={`inline-block transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          aria-hidden="true"
        >
          ▸
        </span>
        Jump to section
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        {...(!isOpen && { inert: true })}
      >
        <div className="overflow-hidden">
          <ol className="space-y-1.5 list-none p-0 m-0 pt-3">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-sm text-ink-muted hover:text-north transition-colors"
                >
                  {section.text}
                </a>
                {section.children.length > 0 && (
                  <ol className="ml-4 mt-1 space-y-1 list-none p-0 m-0">
                    {section.children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={`#${child.id}`}
                          className="text-sm text-ink-faint hover:text-north transition-colors"
                        >
                          {child.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
}
