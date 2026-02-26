import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ModuleMeta, ModuleWithContent } from "@/types/module";

const MODULES_DIR = path.join(process.cwd(), "src/content/modules");

/** Read all MDX files and extract frontmatter metadata, sorted by module number */
export function getAllModules(): ModuleMeta[] {
  if (!fs.existsSync(MODULES_DIR)) return [];

  const files = fs.readdirSync(MODULES_DIR).filter((f) => f.endsWith(".mdx"));

  const modules = files.map((filename) => {
    const filePath = path.join(MODULES_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    return data as ModuleMeta;
  });

  return modules.sort((a, b) => a.module - b.module);
}

/** Get a single module by slug, including its MDX content */
export function getModuleBySlug(
  slug: string,
): ModuleWithContent | undefined {
  if (!fs.existsSync(MODULES_DIR)) return undefined;

  const files = fs.readdirSync(MODULES_DIR).filter((f) => f.endsWith(".mdx"));

  for (const filename of files) {
    const filePath = path.join(MODULES_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    if (data.slug === slug) {
      return { ...(data as ModuleMeta), content };
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

  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}
