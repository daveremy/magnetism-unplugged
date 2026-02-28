import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ModuleMeta, ModuleWithContent } from "@/types/module";

const MODULES_DIR = path.join(process.cwd(), "src/content/modules");

/** List .mdx filenames in the modules directory, or empty array if it doesn't exist. */
function getMdxFilenames(): string[] {
  if (!fs.existsSync(MODULES_DIR)) return [];
  return fs.readdirSync(MODULES_DIR).filter((f) => f.endsWith(".mdx"));
}

/** Validate that frontmatter data has the required ModuleMeta shape. */
function parseModuleMeta(data: Record<string, unknown>, filename: string): ModuleMeta {
  const { title, slug, module, description, learningObjectives, prerequisites, status } = data;

  if (
    typeof title !== "string" ||
    typeof slug !== "string" ||
    typeof module !== "number" ||
    typeof description !== "string" ||
    !Array.isArray(learningObjectives) ||
    !learningObjectives.every((o) => typeof o === "string") ||
    !Array.isArray(prerequisites) ||
    !prerequisites.every((p) => typeof p === "string") ||
    !["draft", "review", "published"].includes(status as string)
  ) {
    throw new Error(
      `Invalid frontmatter in ${filename}: missing or malformed required fields`,
    );
  }

  return {
    title,
    slug,
    module,
    description,
    learningObjectives: learningObjectives as string[],
    prerequisites: prerequisites as string[],
    status: status as ModuleMeta["status"],
  };
}

/** Read all MDX files and extract frontmatter metadata, sorted by module number */
export function getAllModules(): ModuleMeta[] {
  const modules = getMdxFilenames().map((filename) => {
    const filePath = path.join(MODULES_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    return parseModuleMeta(data, filename);
  });

  return modules.sort((a, b) => a.module - b.module);
}

/** Get a single module by slug, including its MDX content */
export function getModuleBySlug(
  slug: string,
): ModuleWithContent | undefined {
  const allMeta = getAllModules();
  const meta = allMeta.find((m) => m.slug === slug);
  if (!meta) return undefined;

  for (const filename of getMdxFilenames()) {
    const filePath = path.join(MODULES_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    if (data.slug === slug) {
      return { ...meta, content };
    }
  }

  return undefined;
}

/** Get the previous and next modules relative to the given slug */
export function getAdjacentModules(slug: string): {
  prev: ModuleMeta | null;
  next: ModuleMeta | null;
} {
  const all = getAllModules();
  const index = all.findIndex((m) => m.slug === slug);

  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}
