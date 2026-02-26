import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllModules, getModuleBySlug, getAdjacentModules } from "@/lib/modules";
import { compileMDXContent } from "@/lib/mdx";

interface ModulePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const modules = getAllModules();
  return modules.map((mod) => ({ slug: mod.slug }));
}

export async function generateMetadata({ params }: ModulePageProps) {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  if (!mod) return { title: "Module Not Found" };
  return {
    title: `${mod.title} — Magnetism Unplugged`,
    description: mod.description,
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug } = await params;
  const mod = getModuleBySlug(slug);
  if (!mod) notFound();

  const content = await compileMDXContent(mod.content);
  const { prev, next } = getAdjacentModules(slug);

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-8">
        <span className="text-sm font-medium text-blue-600">
          Module {mod.module}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mt-1">{mod.title}</h1>
        <p className="text-gray-600 mt-2">{mod.description}</p>
      </header>

      <div className="prose prose-gray max-w-none">{content}</div>

      <nav className="mt-12 flex justify-between border-t border-gray-200 pt-6">
        {prev ? (
          <Link
            href={`/modules/${prev.slug}`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/modules/${next.slug}`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {next.title} &rarr;
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
