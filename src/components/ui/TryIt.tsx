import type { ReactElement, ReactNode } from "react";
import { BeakerIcon } from "./icons";

interface TryItProps {
  children: ReactNode;
}

export function TryIt({ children }: TryItProps): ReactElement {
  return (
    <div className="my-6 rounded-lg border-2 border-dashed border-experiment bg-experiment-soft p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="relative text-experiment">
          <BeakerIcon size={20} />
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 animate-ping rounded-full bg-experiment/20" />
        </span>
        <h4 className="font-serif font-semibold text-experiment">
          Try It Yourself
        </h4>
      </div>
      <div className="text-sm text-ink-muted leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
