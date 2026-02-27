export interface TocHeading {
  level: 2 | 3;
  text: string;
  id: string;
}

export interface TocChild {
  text: string;
  id: string;
}

export interface TocSection {
  text: string;
  id: string;
  children: TocChild[];
}

/** Lowercase, spaces→hyphens, strip non-alphanumeric, collapse hyphens. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Extract h2/h3 headings from raw MDX, ignoring fenced code blocks. */
export function extractHeadings(mdxContent: string): TocHeading[] {
  const stripped = mdxContent.replace(/```[\s\S]*?```/g, "");

  return [...stripped.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    return { level, text, id: slugify(text) };
  });
}

/** Group h3 headings under their preceding h2. Orphan h3s (before any h2) are dropped. */
export function buildTocTree(headings: TocHeading[]): TocSection[] {
  const sections: TocSection[] = [];

  for (const h of headings) {
    if (h.level === 2) {
      sections.push({ text: h.text, id: h.id, children: [] });
    } else if (h.level === 3 && sections.length > 0) {
      sections[sections.length - 1].children.push({ text: h.text, id: h.id });
    }
  }

  return sections;
}
