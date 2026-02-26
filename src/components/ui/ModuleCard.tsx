"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ModuleMeta } from "@/types/module";
import { ChevronRightIcon } from "./icons";
import { fadeUp } from "@/lib/animations";

interface ModuleCardProps {
  module: ModuleMeta;
}

const statusBadge: Record<string, { label: string; bg: string; text: string }> = {
  draft: { label: "Coming soon", bg: "bg-caution-soft", text: "text-caution" },
  published: { label: "Available", bg: "bg-success-soft", text: "text-success" },
};

export function ModuleCard({ module }: ModuleCardProps): ReactElement {
  const badge = statusBadge[module.status];

  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/modules/${module.slug}`}
        className="group block rounded-lg border border-rule bg-paper-warm p-5 transition-all duration-200 hover:border-north hover:shadow-md hover:shadow-north/5"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-north font-serif text-base font-bold text-white">
            {module.module}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-semibold text-ink text-lg">
                {module.title}
              </h3>
              <span className="shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-1">
                <ChevronRightIcon size={16} />
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-muted leading-relaxed">
              {module.description}
            </p>
            {badge && (
              <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
