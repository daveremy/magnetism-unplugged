import { describe, expect, it } from "vitest";
import { slugify, extractHeadings, buildTocTree } from "@/lib/toc";

describe("slugify", () => {
  it("converts basic text to a slug", () => {
    expect(slugify("What Is a Magnet")).toBe("what-is-a-magnet");
  });

  it("strips parentheses and apostrophes", () => {
    expect(slugify("What's Next (Advanced)")).toBe("whats-next-advanced");
  });

  it("strips colons", () => {
    expect(slugify("Safety Note: Be Careful")).toBe("safety-note-be-careful");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("collapses multiple spaces into a single hyphen", () => {
    expect(slugify("too   many   spaces")).toBe("too-many-spaces");
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugify("  hello  ")).toBe("hello");
  });
});

describe("extractHeadings", () => {
  it("extracts h2 and h3 headings", () => {
    const mdx = "## First\n\nSome text\n\n### Sub One\n\n## Second\n";
    expect(extractHeadings(mdx)).toEqual([
      { level: 2, text: "First", id: "first" },
      { level: 3, text: "Sub One", id: "sub-one" },
      { level: 2, text: "Second", id: "second" },
    ]);
  });

  it("ignores h1 and h4 headings", () => {
    const mdx = "# Title\n\n## Keep This\n\n#### Too Deep\n";
    expect(extractHeadings(mdx)).toEqual([
      { level: 2, text: "Keep This", id: "keep-this" },
    ]);
  });

  it("ignores headings inside fenced code blocks", () => {
    const mdx = [
      "## Real Heading",
      "",
      "```markdown",
      "## Fake Heading",
      "### Also Fake",
      "```",
      "",
      "## Another Real",
    ].join("\n");

    expect(extractHeadings(mdx)).toEqual([
      { level: 2, text: "Real Heading", id: "real-heading" },
      { level: 2, text: "Another Real", id: "another-real" },
    ]);
  });

  it("returns empty array for content with no headings", () => {
    expect(extractHeadings("Just some text\n\nMore text")).toEqual([]);
  });
});

describe("buildTocTree", () => {
  it("groups h3 under their preceding h2", () => {
    const headings = extractHeadings(
      "## Section A\n### Sub 1\n### Sub 2\n## Section B\n### Sub 3\n",
    );
    expect(buildTocTree(headings)).toEqual([
      {
        text: "Section A",
        id: "section-a",
        children: [
          { text: "Sub 1", id: "sub-1" },
          { text: "Sub 2", id: "sub-2" },
        ],
      },
      {
        text: "Section B",
        id: "section-b",
        children: [{ text: "Sub 3", id: "sub-3" }],
      },
    ]);
  });

  it("drops h3 that appear before any h2", () => {
    const headings = extractHeadings("### Orphan\n## First Section\n### Child\n");
    expect(buildTocTree(headings)).toEqual([
      {
        text: "First Section",
        id: "first-section",
        children: [{ text: "Child", id: "child" }],
      },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(buildTocTree([])).toEqual([]);
  });

  it("handles h2 with no children", () => {
    const headings = extractHeadings("## Alone\n## Also Alone\n");
    expect(buildTocTree(headings)).toEqual([
      { text: "Alone", id: "alone", children: [] },
      { text: "Also Alone", id: "also-alone", children: [] },
    ]);
  });
});
