import type { ReactElement, ReactNode } from "react";
import { LightbulbIcon, AlertTriangleIcon, CheckCircleIcon } from "./icons";

type CalloutType = "info" | "warning" | "tip";

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
}

const config = {
  info: {
    bg: "bg-south-soft",
    border: "border-south",
    iconColor: "text-south",
    Icon: LightbulbIcon,
  },
  warning: {
    bg: "bg-caution-soft",
    border: "border-caution",
    iconColor: "text-caution",
    Icon: AlertTriangleIcon,
  },
  tip: {
    bg: "bg-success-soft",
    border: "border-success",
    iconColor: "text-success",
    Icon: CheckCircleIcon,
  },
} as const;

export function Callout({ type = "info", children }: CalloutProps): ReactElement {
  const { bg, border, iconColor, Icon } = config[type];

  return (
    <div
      className={`my-5 rounded-tr-lg rounded-br-lg border-l-4 p-4 ${bg} ${border}`}
      role="note"
    >
      <div className="flex gap-3">
        <span className={`shrink-0 mt-0.5 ${iconColor}`}>
          <Icon size={18} />
        </span>
        <div className="text-sm leading-relaxed text-ink-muted [&>p]:mb-2 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
