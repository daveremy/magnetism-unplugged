import type { ReactElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllModules,
  getModuleBySlug,
  getAdjacentModules,
} from "@/lib/modules";
import { compileMDXContent } from "@/lib/mdx";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

interface ModulePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const modules = getAllModules();
  return modules.map((mod) => ({ slug: mod.slug }));
}

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  if (!mod) return { title: "Module Not Found" };
  return {
    title: `${mod.title} — Magnetism Unplugged`,
    description: mod.description,
  };
}

export default async function ModulePage({ params }: ModulePageProps): Promise<ReactElement> {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  if (!mod) notFound();

  const content = await compileMDXContent(mod.content);
  const { prev, next } = getAdjacentModules(slug);

  return (
    <article className="mx-auto max-w-content px-6 py-12">
      {/* Module label */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-north">
            Module {mod.module}
          </span>
          <span className="flex-1 h-px bg-rule" aria-hidden="true" />
        </div>
        <h1 className="font-serif font-bold text-ink leading-tight text-h1">
          {mod.title}
        </h1>
        <p className="text-ink-muted mt-3 leading-relaxed">{mod.description}</p>
      </header>

      {/* MDX content */}
      <div className="prose max-w-none">{content}</div>

      {/* Prev / Next navigation */}
      <nav className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prev ? (
          <Link
            href={`/modules/${prev.slug}`}
            className="group flex items-center gap-3 rounded-lg border border-rule bg-paper-warm p-4 transition-all duration-200 hover:border-north hover:shadow-md hover:shadow-north/5"
          >
            <span className="shrink-0 text-ink-faint transition-transform duration-200 group-hover:-translate-x-1">
              <ChevronLeftIcon size={18} />
            </span>
            <div className="min-w-0">
              <span className="text-xs font-medium text-ink-faint uppercase tracking-wider">
                Previous
              </span>
              <p className="font-serif font-semibold text-ink text-sm truncate">
                {prev.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/modules/${next.slug}`}
            className="group flex items-center justify-end gap-3 rounded-lg border border-rule bg-paper-warm p-4 text-right transition-all duration-200 hover:border-north hover:shadow-md hover:shadow-north/5"
          >
            <div className="min-w-0">
              <span className="text-xs font-medium text-ink-faint uppercase tracking-wider">
                Next
              </span>
              <p className="font-serif font-semibold text-ink text-sm truncate">
                {next.title}
              </p>
            </div>
            <span className="shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-1">
              <ChevronRightIcon size={18} />
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
