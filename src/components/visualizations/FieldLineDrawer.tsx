"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { MagnetBase } from "./shared/MagnetBase";
import type { DipoleState } from "@/lib/physics/interactions";
import {
  type PresetName,
  type Scene,
  computeAllFieldLines,
  getPresetScene,
  pointsToSvgPath,
} from "@/lib/physics/fieldLines";

const VIEW_W = 600;
const VIEW_H = 400;
const MAGNET_W = 100;
const MAGNET_H = 40;
const HALF_MAGNET_W = MAGNET_W / 2;
const PADDING = HALF_MAGNET_W;
const KEYBOARD_STEP = 10;
const MIN_MAGNET_GAP = MAGNET_W + 10;

const PRESETS: { name: PresetName; label: string }[] = [
  { name: "single", label: "Single Magnet" },
  { name: "attracting", label: "Attracting Pair" },
  { name: "repelling", label: "Repelling Pair" },
];

function clampPosition(
  x: number,
  y: number,
  otherDipoles: DipoleState[],
  selfIndex: number,
): { x: number; y: number } {
  const cx = Math.max(PADDING, Math.min(VIEW_W - PADDING, x));
  const cy = Math.max(PADDING, Math.min(VIEW_H - PADDING, y));

  // Prevent overlap with other magnets
  for (let i = 0; i < otherDipoles.length; i++) {
    if (i === selfIndex) continue;
    const other = otherDipoles[i];
    const dx = cx - other.center.x;
    const dy = cy - other.center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < MIN_MAGNET_GAP) {
      if (dist < 0.01) {
        // Perfectly overlapping — nudge right, or left if right would hit boundary
        const rightX = other.center.x + MIN_MAGNET_GAP;
        const nudgeX = rightX <= VIEW_W - PADDING ? rightX : other.center.x - MIN_MAGNET_GAP;
        return {
          x: Math.max(PADDING, Math.min(VIEW_W - PADDING, nudgeX)),
          y: cy,
        };
      }
      const nx = dx / dist;
      const ny = dy / dist;
      return {
        x: Math.max(PADDING, Math.min(VIEW_W - PADDING, other.center.x + nx * MIN_MAGNET_GAP)),
        y: Math.max(PADDING, Math.min(VIEW_H - PADDING, other.center.y + ny * MIN_MAGNET_GAP)),
      };
    }
  }
  return { x: cx, y: cy };
}

/** Compute a midpoint along a traced line + its tangent angle for arrowheads. */
function getArrowhead(points: { x: number; y: number }[]): {
  x: number;
  y: number;
  angle: number;
} | null {
  if (points.length < 3) return null;
  const mid = Math.floor(points.length / 2);
  const p = points[mid];
  const prev = points[mid - 1];
  const angle = Math.atan2(p.y - prev.y, p.x - prev.x) * (180 / Math.PI);
  return { x: p.x, y: p.y, angle };
}

const STATUS_TEXT: Record<PresetName, string> = {
  single: "Single magnet — drag to reposition",
  attracting: "Attracting pair — field lines bridge between opposite poles",
  repelling: "Repelling pair — field lines bend away from like poles",
};

export function FieldLineDrawer() {
  const [preset, setPreset] = useState<PresetName>("single");
  const [dipoles, setDipoles] = useState<DipoleState[]>(
    () => getPresetScene("single").dipoles,
  );
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [dragging, setDragging] = useState<number | null>(null);
  const [statusText, setStatusText] = useState(STATUS_TEXT.single);

  const svgRef = useRef<SVGSVGElement>(null);

  const scene: Scene = useMemo(() => ({ dipoles }), [dipoles]);

  const fieldLines = useMemo(() => {
    if (!showFieldLines) return [];
    return computeAllFieldLines(scene);
  }, [scene, showFieldLines]);

  const svgPaths = useMemo(
    () => fieldLines.map((line) => pointsToSvgPath(line)),
    [fieldLines],
  );

  const arrowheads = useMemo(
    () =>
      fieldLines
        .map((line) => getArrowhead(line))
        .filter((a): a is NonNullable<typeof a> => a !== null),
    [fieldLines],
  );

  const clientToSvg = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      const point = new DOMPoint(clientX, clientY);
      const svgPoint = point.matrixTransform(ctm.inverse());
      return { x: svgPoint.x, y: svgPoint.y };
    },
    [],
  );

  const handlePreset = useCallback((p: PresetName) => {
    setPreset(p);
    setDipoles(getPresetScene(p).dipoles);
    setShowFieldLines(true);
    setStatusText(STATUS_TEXT[p]);
  }, []);

  const handlePointerDown = useCallback(
    (index: number, e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as Element).setPointerCapture(e.pointerId);
      setDragging(index);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragging === null) return;
      const svg = clientToSvg(e.clientX, e.clientY);
      setDipoles((prev) => {
        const next = [...prev];
        const clamped = clampPosition(svg.x, svg.y, prev, dragging);
        next[dragging] = { ...next[dragging], center: clamped };
        return next;
      });
    },
    [dragging, clientToSvg],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragging === null) return;
      (e.target as Element).releasePointerCapture(e.pointerId);
      setDragging(null);
      if (showFieldLines) setStatusText(STATUS_TEXT[preset]);
    },
    [dragging, preset, showFieldLines],
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent) => {
      if (dragging === null) return;
      (e.target as Element).releasePointerCapture(e.pointerId);
      setDragging(null);
    },
    [dragging],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      let dx = 0;
      let dy = 0;
      if (e.key === "ArrowLeft") dx = -KEYBOARD_STEP;
      else if (e.key === "ArrowRight") dx = KEYBOARD_STEP;
      else if (e.key === "ArrowUp") dy = -KEYBOARD_STEP;
      else if (e.key === "ArrowDown") dy = KEYBOARD_STEP;
      else return;

      e.preventDefault();
      setDipoles((prev) => {
        const next = [...prev];
        const { x, y } = prev[index].center;
        const clamped = clampPosition(x + dx, y + dy, prev, index);
        next[index] = { ...next[index], center: clamped };
        return next;
      });
    },
    [],
  );

  const handleReset = useCallback(() => {
    setDipoles(getPresetScene(preset).dipoles);
    if (showFieldLines) setStatusText(STATUS_TEXT[preset]);
  }, [preset, showFieldLines]);

  const handleToggle = useCallback(() => {
    setShowFieldLines((prev) => {
      const next = !prev;
      setStatusText(next ? STATUS_TEXT[preset] : "Field lines hidden");
      return next;
    });
  }, [preset]);

  return (
    <figure className="my-8 flex flex-col items-center gap-3">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full max-w-[600px]"
        style={{ touchAction: "none" }}
        aria-label="Magnetic field line visualization"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* Field lines */}
        {showFieldLines &&
          svgPaths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="var(--ink-muted)"
              strokeWidth={1.2}
              strokeLinecap="round"
              opacity={0.6}
            />
          ))}

        {/* Direction arrowheads at midpoints */}
        {showFieldLines &&
          arrowheads.map((arrow, i) => (
            <polygon
              key={`arrow-${i}`}
              points="-5,-3.5 5,0 -5,3.5"
              fill="var(--ink-muted)"
              opacity={0.6}
              transform={`translate(${arrow.x},${arrow.y}) rotate(${arrow.angle})`}
            />
          ))}

        {/* Magnets */}
        {dipoles.map((dipole, index) => (
            <g
              key={index}
              tabIndex={0}
              role="group"
              aria-roledescription="draggable magnet"
              aria-label={`Magnet ${index + 1}, position x=${Math.round(dipole.center.x)} y=${Math.round(dipole.center.y)}`}
              style={{ cursor: dragging === index ? "grabbing" : "grab" }}
              onPointerDown={(e) => handlePointerDown(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            >
              <MagnetBase
                x={dipole.center.x}
                y={dipole.center.y}
                width={MAGNET_W}
                height={MAGNET_H}
                label={
                  dipole.flipped
                    ? { north: "S", south: "N" }
                    : { north: "N", south: "S" }
                }
                fill={
                  dipole.flipped
                    ? { north: "#3b82f6", south: "#ef4444" }
                    : undefined
                }
              />
            </g>
        ))}
      </svg>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => handlePreset(p.name)}
            aria-pressed={preset === p.name}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              preset === p.name
                ? "border-experiment bg-experiment/10 text-experiment"
                : "border-rule text-ink-muted hover:bg-paper-warm"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleToggle}
          aria-pressed={showFieldLines}
          className="rounded-md border border-rule px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-paper-warm"
        >
          {showFieldLines ? "Hide" : "Show"} Field Lines
        </button>
        <button
          onClick={handleReset}
          className="rounded-md border border-rule px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-paper-warm"
        >
          Reset
        </button>
      </div>

      {/* Status / aria-live region */}
      <div
        aria-live="polite"
        className="text-sm font-medium"
        style={{ color: "var(--ink-muted)" }}
      >
        {statusText}
      </div>

      <figcaption className="sr-only">
        Interactive magnetic field line visualization. Choose a preset to see
        different field patterns, drag magnets to reposition them, and toggle
        field lines on or off. Field lines show the direction and shape of the
        magnetic field around bar magnets.
      </figcaption>
    </figure>
  );
}
