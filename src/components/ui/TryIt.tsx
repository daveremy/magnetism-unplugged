import type { ReactNode } from "react";

interface TryItProps {
  children: ReactNode;
}

export function TryIt({ children }: TryItProps) {
  return (
    <div className="my-6 rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg" aria-hidden="true">🔬</span>
        <h4 className="font-semibold text-purple-900">Try It Yourself</h4>
      </div>
      <div className="text-sm text-purple-800 leading-relaxed">{children}</div>
    </div>
  );
}
