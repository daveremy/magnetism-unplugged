"use client";

import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { ModuleMeta } from "@/types/module";
import { MenuIcon, XMarkIcon } from "./icons";

interface NavigationProps {
  modules: ModuleMeta[];
}

export function Navigation({ modules }: NavigationProps): ReactElement {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change (state adjustment during render)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
  }

  // Close drawer on Escape
  useEffect(() => {
    if (!drawerOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [drawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const navContent = (
    <>
      <Link href="/" className="block mb-8 group">
        <h2 className="font-serif text-lg font-bold text-ink">
          Magnetism Unplugged
        </h2>
        {/* Decorative field-line flourish */}
        <svg
          className="mt-1.5 text-rule"
          width="80"
          height="8"
          viewBox="0 0 80 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 4C10 4 10 1 20 1C30 1 30 7 40 7C50 7 50 1 60 1C70 1 70 4 80 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Link>

      <ol className="space-y-0.5">
        {modules.map((mod) => {
          const href = `/modules/${mod.slug}`;
          const isActive = pathname === href;

          return (
            <li key={mod.slug}>
              <Link
                href={href}
                className={`group relative flex items-center gap-3 rounded-r-md py-2 pl-4 pr-3 text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-north-soft text-ink font-medium"
                    : "text-ink-muted hover:text-ink hover:translate-x-0.5"
                }`}
              >
                {/* Active accent bar */}
                {isActive && (
                  <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-north" />
                )}

                {/* Module number circle */}
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-north text-white"
                      : "border border-rule text-ink-faint group-hover:border-ink-faint"
                  }`}
                >
                  {mod.module}
                </span>

                <span className="truncate">{mod.title}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="hidden md:block shrink-0 w-sidebar bg-paper-warm border-r border-rule p-5 overflow-y-auto"
      >
        {navContent}
      </nav>

      {/* Mobile menu button */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden flex items-center justify-center w-10 h-10 rounded-md bg-paper-warm border border-rule text-ink-muted hover:text-ink transition-colors"
        aria-label="Open navigation"
      >
        <MenuIcon size={20} />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.nav
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-paper-warm p-5 overflow-y-auto shadow-xl md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-md text-ink-faint hover:text-ink transition-colors"
                  aria-label="Close navigation"
                >
                  <XMarkIcon size={18} />
                </button>
              </div>
              {navContent}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
