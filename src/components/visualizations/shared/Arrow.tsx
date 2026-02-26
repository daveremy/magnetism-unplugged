"use client";

interface ArrowProps {
  x: number;
  y: number;
  angle: number;
  length?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * SVG arrow component for representing field vectors.
 * Use within an SVG container.
 */
export function Arrow({
  x,
  y,
  angle,
  length = 20,
  color = "#3b82f6",
  strokeWidth = 2,
}: ArrowProps) {
  const headSize = Math.min(length * 0.3, 8);
  const rad = (angle * Math.PI) / 180;

  // Arrow shaft endpoint
  const endX = x + Math.cos(rad) * length;
  const endY = y + Math.sin(rad) * length;

  // Arrowhead points
  const head1X = endX - Math.cos(rad - 0.4) * headSize;
  const head1Y = endY - Math.sin(rad - 0.4) * headSize;
  const head2X = endX - Math.cos(rad + 0.4) * headSize;
  const head2Y = endY - Math.sin(rad + 0.4) * headSize;

  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={endX}
        y2={endY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <polygon
        points={`${endX},${endY} ${head1X},${head1Y} ${head2X},${head2Y}`}
        fill={color}
      />
    </g>
  );
}
