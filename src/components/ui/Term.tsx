"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { glossary } from "@/lib/glossary";

interface TermProps {
  /** Glossary key, e.g. "magnetic domain" */
  id: string;
  /** Inline text displayed (may differ from key, e.g. "domains") */
  children: ReactNode;
}

export function Term({ id, children }: TermProps) {
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(true);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  const definition = glossary[id];

  const close = useCallback(() => setOpen(false), []);

  // Position: flip below if near top of viewport
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setAbove(rect.top > 120);
  }, []);

  const toggle = useCallback(() => {
    if (!open) updatePosition();
    setOpen((prev) => !prev);
  }, [open, updatePosition]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open, close]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, close]);

  if (!definition) {
    // Fallback: render children without tooltip if term not in glossary
    return <>{children}</>;
  }

  return (
    <span className="relative inline" ref={triggerRef}>
      <span
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        className="text-north border-b border-dotted border-north/60 cursor-help"
        onClick={toggle}
        onMouseEnter={() => {
          updatePosition();
          setOpen(true);
        }}
        onMouseLeave={close}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        {children}
      </span>

      <AnimatePresence>
        {open && (
          <motion.span
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, y: above ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: above ? 4 : -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-1/2 z-50 w-max max-w-xs -translate-x-1/2 rounded-lg border border-rule bg-paper-warm p-3 text-sm leading-relaxed text-ink-muted shadow-md ${
              above ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            {/* Caret */}
            <span
              className={`absolute left-1/2 -translate-x-1/2 border-[6px] border-transparent ${
                above
                  ? "top-full border-t-paper-warm"
                  : "bottom-full border-b-paper-warm"
              }`}
            />
            {definition}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
