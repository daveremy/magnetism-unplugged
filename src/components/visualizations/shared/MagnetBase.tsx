interface MagnetBaseProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  label?: { north?: string; south?: string };
  fill?: { north?: string; south?: string };
}

const DEFAULT_LABEL = { north: "N", south: "S" } as const;
const DEFAULT_FILL = { north: "#ef4444", south: "#3b82f6" } as const;

/**
 * SVG bar magnet visual. North (red) on left, South (blue) on right.
 * Use within an SVG container.
 */
export function MagnetBase({
  x,
  y,
  width = 100,
  height = 40,
  rotation = 0,
  label = DEFAULT_LABEL,
  fill = DEFAULT_FILL,
}: MagnetBaseProps) {
  const halfW = width / 2;
  const halfH = height / 2;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      <rect
        x={-halfW}
        y={-halfH}
        width={halfW}
        height={height}
        rx={4}
        fill={fill.north ?? DEFAULT_FILL.north}
      />
      <rect
        x={0}
        y={-halfH}
        width={halfW}
        height={height}
        rx={4}
        fill={fill.south ?? DEFAULT_FILL.south}
      />

      {label.north && (
        <text
          x={-halfW / 2}
          y={5}
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize={14}
        >
          {label.north}
        </text>
      )}
      {label.south && (
        <text
          x={halfW / 2}
          y={5}
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize={14}
        >
          {label.south}
        </text>
      )}
    </g>
  );
}
