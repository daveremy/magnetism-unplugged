import type { ReactElement, ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

/**
 * Shared SVG wrapper that provides consistent defaults for all icons.
 * Individual icons only need to supply their unique `children` and
 * optional `strokeWidth` override.
 */
function SvgIcon({
  size = 20,
  strokeWidth = 1.75,
  children,
  ...props
}: IconProps & { children: ReactNode }): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function LightbulbIcon({ size, ...props }: IconProps): ReactElement {
  return (
    <SvgIcon size={size} {...props}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </SvgIcon>
  );
}

export function AlertTriangleIcon({ size, ...props }: IconProps): ReactElement {
  return (
    <SvgIcon size={size} {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </SvgIcon>
  );
}

export function CheckCircleIcon({ size, ...props }: IconProps): ReactElement {
  return (
    <SvgIcon size={size} {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </SvgIcon>
  );
}

export function BeakerIcon({ size, ...props }: IconProps): ReactElement {
  return (
    <SvgIcon size={size} {...props}>
      <path d="M4.5 3h15" />
      <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
      <path d="M6 14h12" />
    </SvgIcon>
  );
}

export function ChevronRightIcon({ size, ...props }: IconProps): ReactElement {
  return (
    <SvgIcon size={size} strokeWidth={2} {...props}>
      <polyline points="9 18 15 12 9 6" />
    </SvgIcon>
  );
}

export function ChevronLeftIcon({ size, ...props }: IconProps): ReactElement {
  return (
    <SvgIcon size={size} strokeWidth={2} {...props}>
      <polyline points="15 18 9 12 15 6" />
    </SvgIcon>
  );
}

export function XMarkIcon({ size, ...props }: IconProps): ReactElement {
  return (
    <SvgIcon size={size} strokeWidth={2} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </SvgIcon>
  );
}

export function CheckIcon({ size, ...props }: IconProps): ReactElement {
  return (
    <SvgIcon size={size} strokeWidth={2.5} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </SvgIcon>
  );
}

export function MenuIcon({ size = 24, ...props }: IconProps): ReactElement {
  return (
    <SvgIcon size={size} strokeWidth={2} {...props}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </SvgIcon>
  );
}
