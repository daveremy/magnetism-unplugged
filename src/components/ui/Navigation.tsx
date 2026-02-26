"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ModuleMeta } from "@/types/module";

interface NavigationProps {
  modules: ModuleMeta[];
}

export function Navigation({ modules }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="w-64 shrink-0 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto hidden md:block">
      <Link href="/" className="block mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Magnetism Unplugged
        </h2>
      </Link>

      <ol className="space-y-1">
        {modules.map((mod) => {
          const href = `/modules/${mod.slug}`;
          const isActive = pathname === href;

          return (
            <li key={mod.slug}>
              <Link
                href={href}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-900 font-medium"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="text-gray-400 mr-2">{mod.module}.</span>
                {mod.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
