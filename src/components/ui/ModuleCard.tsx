import Link from "next/link";
import type { ModuleMeta } from "@/types/module";

interface ModuleCardProps {
  module: ModuleMeta;
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Link
      href={`/modules/${module.slug}`}
      className="block rounded-lg border border-gray-200 p-5 transition-all hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          {module.module}
        </span>
        <div>
          <h3 className="font-semibold text-gray-900">{module.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{module.description}</p>
          {module.status === "draft" && (
            <span className="mt-2 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
              Coming soon
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
