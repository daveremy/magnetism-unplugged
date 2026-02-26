import type { ReactElement } from "react";
import { XMarkIcon, CheckIcon } from "./icons";

interface CommonMisconceptionProps {
  myth: string;
  reality: string;
}

export function CommonMisconception({
  myth,
  reality,
}: CommonMisconceptionProps): ReactElement {
  return (
    <div
      className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-0 rounded-lg overflow-hidden border border-rule"
      role="note"
    >
      {/* Myth panel */}
      <div className="bg-myth-soft p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-myth/15 text-myth">
            <XMarkIcon size={12} />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-myth">
            Myth
          </span>
        </div>
        <p className="text-sm text-ink-muted italic leading-relaxed">
          &ldquo;{myth}&rdquo;
        </p>
      </div>

      {/* Reality panel */}
      <div className="bg-success-soft p-4 border-t sm:border-t-0 sm:border-l border-rule">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckIcon size={12} />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-success">
            Reality
          </span>
        </div>
        <p className="text-sm text-ink-muted leading-relaxed">{reality}</p>
      </div>
    </div>
  );
}
