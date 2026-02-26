export interface ModuleMeta {
  title: string;
  slug: string;
  module: number;
  description: string;
  prerequisites: string[];
  status: "draft" | "review" | "published";
}

export interface ModuleWithContent extends ModuleMeta {
  content: string;
}
