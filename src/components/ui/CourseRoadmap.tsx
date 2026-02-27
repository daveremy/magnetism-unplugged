"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ModuleMeta } from "@/types/module";
import { staggerContainer, fadeUp } from "@/lib/animations";

/** All 10 modules — title and slug for the full roadmap. */
const ALL_MODULES: Array<{ module: number; title: string; slug: string }> = [
  { module: 1, title: "The Invisible Push & Pull", slug: "the-invisible-push-and-pull" },
  { module: 2, title: "Fields — The Invisible Landscape", slug: "fields-the-invisible-landscape" },
  { module: 3, title: "Why Iron but Not Aluminum?", slug: "why-iron-but-not-aluminum" },
  { module: 4, title: "Earth as a Giant Magnet", slug: "earth-as-a-giant-magnet" },
  { module: 5, title: "Electricity & Magnetism", slug: "electricity-and-magnetism" },
  { module: 6, title: "Electromagnets", slug: "electromagnets-and-why-they-matter" },
  { module: 7, title: "Induction", slug: "induction-magnetism-creates-electricity" },
  { module: 8, title: "Magnetism in Daily Life", slug: "magnetism-in-your-daily-life" },
  { module: 9, title: "The Bigger Picture", slug: "the-bigger-picture" },
  { module: 10, title: "Frontiers", slug: "frontiers" },
];

/**
 * Rainbow gradient colors for each module number (1-10).
 * Progresses from warm red through orange, gold, green, teal, blue, to indigo.
 */
const MODULE_COLORS = [
  "bg-[oklch(0.58_0.22_25)]",   // 1 — red
  "bg-[oklch(0.62_0.19_45)]",   // 2 — red-orange
  "bg-[oklch(0.68_0.17_70)]",   // 3 — orange
  "bg-[oklch(0.72_0.15_95)]",   // 4 — gold
  "bg-[oklch(0.65_0.17_145)]",  // 5 — green
  "bg-[oklch(0.60_0.14_175)]",  // 6 — teal
  "bg-[oklch(0.55_0.14_220)]",  // 7 — blue
  "bg-[oklch(0.50_0.15_250)]",  // 8 — blue
  "bg-[oklch(0.48_0.17_275)]",  // 9 — indigo
  "bg-[oklch(0.45_0.18_300)]",  // 10 — purple
];

interface CourseRoadmapProps {
  availableModules: ModuleMeta[];
}

export function CourseRoadmap({ availableModules }: CourseRoadmapProps): ReactElement {
  const availableSlugs = new Set(availableModules.map((m) => m.slug));

  return (
    <motion.nav
      aria-label="Course modules"
      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {ALL_MODULES.map((mod) => {
        const available = availableSlugs.has(mod.slug);
        const inner = (
          <>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${MODULE_COLORS[mod.module - 1]}`}
            >
              {mod.module}
            </span>
            <span className="text-sm font-medium leading-tight">
              {mod.title}
            </span>
          </>
        );

        return (
          <motion.div key={mod.module} variants={fadeUp}>
            {available ? (
              <Link
                href={`/modules/${mod.slug}`}
                className="flex items-center gap-3 rounded-lg border border-rule bg-paper-warm px-3 py-2.5 transition-all duration-200 hover:border-north hover:shadow-sm text-ink"
              >
                {inner}
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-rule/50 bg-paper px-3 py-2.5 text-ink-faint">
                {inner}
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
