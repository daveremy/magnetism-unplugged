"use client";

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import type { ModuleMeta } from "@/types/module";
import { ModuleCard } from "./ModuleCard";
import { CourseRoadmap } from "./CourseRoadmap";
import { staggerContainer, fadeUp } from "@/lib/animations";

interface LandingContentProps {
  modules: ModuleMeta[];
}

export function LandingContent({ modules }: LandingContentProps): ReactElement {
  return (
    <div className="relative max-w-content">
      <div className="mx-auto px-6 py-12">
        {/* Decorative field-line background */}
        <svg
          className="pointer-events-none absolute top-0 right-0 w-64 h-64 text-rule opacity-30"
          viewBox="0 0 256 256"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M128 32C160 32 192 64 192 128C192 192 160 224 128 224"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M128 48C152 48 176 72 176 128C176 184 152 208 128 208"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M128 64C144 64 160 80 160 128C160 176 144 192 128 192"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M128 32C96 32 64 64 64 128C64 192 96 224 128 224"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M128 48C104 48 80 72 80 128C80 184 104 208 128 208"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M128 64C112 64 96 80 96 128C96 176 112 192 128 192"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>

        {/* Hero — compact, above the fold with roadmap */}
        <motion.header
          className="mb-10 relative"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="font-serif font-bold text-ink leading-tight text-hero"
            variants={fadeUp}
          >
            <span className="bg-gradient-to-r from-north via-experiment to-south bg-clip-text text-transparent">
              Magnetism
            </span>{" "}
            Unplugged
          </motion.h1>
          <motion.p
            className="mt-3 text-lg text-ink-muted leading-relaxed max-w-xl"
            variants={fadeUp}
          >
            An interactive journey through magnetism — no physics background
            required. Build real intuition through plain-language explanations
            and hands-on visualizations.
          </motion.p>
        </motion.header>

        {/* Course overview infographic */}
        <motion.img
          src="/images/course-overview.png"
          alt="Visual overview of the 10-module Magnetism Unplugged course journey"
          className="w-full max-w-sm mx-auto rounded-xl mb-10"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        />

        {/* Course roadmap — the main visual */}
        <motion.section
          className="mb-14"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="font-serif text-xl font-semibold text-ink mb-4">
            Your Journey
          </h2>
          <CourseRoadmap availableModules={modules} />
        </motion.section>

        {/* Detailed module list */}
        {modules.length > 0 && (
          <section>
            <motion.h2
              className="font-serif text-xl font-semibold text-ink mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Modules
            </motion.h2>
            <motion.div
              className="space-y-3"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {modules.map((mod) => (
                <ModuleCard key={mod.slug} module={mod} />
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}
