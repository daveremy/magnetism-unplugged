import type { ReactNode } from "react";

interface CalloutProps {
  type?: "info" | "warning" | "tip";
  children: ReactNode;
}

const styles = {
  info: {
    container: "border-blue-200 bg-blue-50",
    icon: "text-blue-600",
    emoji: "💡",
  },
  warning: {
    container: "border-amber-200 bg-amber-50",
    icon: "text-amber-600",
    emoji: "⚠️",
  },
  tip: {
    container: "border-green-200 bg-green-50",
    icon: "text-green-600",
    emoji: "✅",
  },
};

export function Callout({ type = "info", children }: CalloutProps) {
  const style = styles[type];

  return (
    <div
      className={`my-4 rounded-lg border-l-4 p-4 ${style.container}`}
      role="note"
    >
      <div className="flex gap-3">
        <span className={`text-lg ${style.icon}`} aria-hidden="true">
          {style.emoji}
        </span>
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
