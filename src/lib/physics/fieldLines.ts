import {
  type Vector2D,
  add,
  subtract,
  scale,
  magnitude,
  normalize,
  fieldFromDipole,
} from "./fields";
import { type DipoleState, getPolePositions } from "./interactions";

export type PresetName = "single" | "attracting" | "repelling";

export interface TraceConfig {
  stepSize: number;
  maxSteps: number;
  poleRadius: number;
  minFieldMagnitude: number;
  bounds: { xMin: number; xMax: number; yMin: number; yMax: number };
}

export interface Scene {
  dipoles: DipoleState[];
}

export const DEFAULT_TRACE_CONFIG: TraceConfig = {
  stepSize: 2.5,
  maxSteps: 500,
  poleRadius: 6,
  minFieldMagnitude: 0.0005,
  bounds: { xMin: -20, xMax: 620, yMin: -20, yMax: 420 },
};

/** Net magnetic field at a point from all dipoles in the scene. */
export function netFieldAt(scene: Scene, point: Vector2D): Vector2D {
  let field: Vector2D = { x: 0, y: 0 };
  for (const dipole of scene.dipoles) {
    const poles = getPolePositions(dipole);
    field = add(
      field,
      fieldFromDipole(poles.north, poles.south, dipole.strength, point),
    );
  }
  return field;
}

/**
 * Trace a field line using RK4 integration.
 * @param direction — 1 for forward (N→S), -1 for backward (S→N)
 */
export function traceFieldLine(
  scene: Scene,
  startPoint: Vector2D,
  direction: 1 | -1,
  config: TraceConfig = DEFAULT_TRACE_CONFIG,
): Vector2D[] {
  const points: Vector2D[] = [startPoint];
  let current = startPoint;

  for (let i = 0; i < config.maxSteps; i++) {
    // RK4 integration
    const f1 = netFieldAt(scene, current);
    if (magnitude(f1) < config.minFieldMagnitude) break;
    const d1 = scale(normalize(f1), direction * config.stepSize);

    const p2 = add(current, scale(d1, 0.5));
    const f2 = netFieldAt(scene, p2);
    if (magnitude(f2) < config.minFieldMagnitude) break;
    const d2 = scale(normalize(f2), direction * config.stepSize);

    const p3 = add(current, scale(d2, 0.5));
    const f3 = netFieldAt(scene, p3);
    if (magnitude(f3) < config.minFieldMagnitude) break;
    const d3 = scale(normalize(f3), direction * config.stepSize);

    const p4 = add(current, d3);
    const f4 = netFieldAt(scene, p4);
    if (magnitude(f4) < config.minFieldMagnitude) break;
    const d4 = scale(normalize(f4), direction * config.stepSize);

    const next: Vector2D = {
      x: current.x + (d1.x + 2 * d2.x + 2 * d3.x + d4.x) / 6,
      y: current.y + (d1.y + 2 * d2.y + 2 * d3.y + d4.y) / 6,
    };

    // Terminate if out of bounds
    if (
      next.x < config.bounds.xMin ||
      next.x > config.bounds.xMax ||
      next.y < config.bounds.yMin ||
      next.y > config.bounds.yMax
    ) {
      points.push(next);
      break;
    }

    const nearPole = scene.dipoles.some((dipole) => {
      const poles = getPolePositions(dipole);
      return (
        magnitude(subtract(next, poles.north)) < config.poleRadius ||
        magnitude(subtract(next, poles.south)) < config.poleRadius
      );
    });

    points.push(next);
    if (nearPole) break;

    current = next;
  }

  return points;
}

/** Generate evenly spaced seed points in a ring around each pole. */
export function generateSeedPoints(
  scene: Scene,
  seedsPerPole: number,
  seedRadius: number,
): { point: Vector2D; direction: 1 | -1 }[] {
  const seeds: { point: Vector2D; direction: 1 | -1 }[] = [];

  for (const dipole of scene.dipoles) {
    const poles = getPolePositions(dipole);
    const poleConfigs: { center: Vector2D; direction: 1 | -1 }[] = [
      { center: poles.north, direction: 1 },
      { center: poles.south, direction: -1 },
    ];

    for (const { center, direction } of poleConfigs) {
      for (let i = 0; i < seedsPerPole; i++) {
        const angle = (2 * Math.PI * i) / seedsPerPole;
        seeds.push({
          point: {
            x: center.x + seedRadius * Math.cos(angle),
            y: center.y + seedRadius * Math.sin(angle),
          },
          direction,
        });
      }
    }
  }

  return seeds;
}

/** Compute all field lines for a scene. */
export function computeAllFieldLines(
  scene: Scene,
  config: TraceConfig = DEFAULT_TRACE_CONFIG,
): Vector2D[][] {
  const seedsPerPole = scene.dipoles.length === 1 ? 10 : 8;
  const seedRadius = config.poleRadius + 2;
  const seeds = generateSeedPoints(scene, seedsPerPole, seedRadius);

  return seeds
    .map((seed) => {
      const line = traceFieldLine(scene, seed.point, seed.direction, config);
      // Reverse backward-traced lines so all lines are oriented N→S
      return seed.direction === -1 ? line.reverse() : line;
    })
    .filter((line) => line.length >= 2);
}

/** Get preset dipole configuration. */
export function getPresetScene(preset: PresetName): Scene {
  switch (preset) {
    case "single":
      return {
        dipoles: [
          { center: { x: 300, y: 200 }, halfLength: 25, strength: 100, flipped: false },
        ],
      };
    case "attracting":
      // Both unflipped: A's south (right) faces B's north (left) — attraction
      return {
        dipoles: [
          { center: { x: 180, y: 200 }, halfLength: 25, strength: 100, flipped: false },
          { center: { x: 420, y: 200 }, halfLength: 25, strength: 100, flipped: false },
        ],
      };
    case "repelling":
      // B flipped: A's south (right) faces B's south (left) — repulsion
      return {
        dipoles: [
          { center: { x: 180, y: 200 }, halfLength: 25, strength: 100, flipped: false },
          { center: { x: 420, y: 200 }, halfLength: 25, strength: 100, flipped: true },
        ],
      };
  }
}

/** Convert traced points to an SVG path `d` attribute using quadratic Bezier curves. */
export function pointsToSvgPath(points: Vector2D[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;
  if (points.length === 2) {
    return `M${points[0].x},${points[0].y}L${points[1].x},${points[1].y}`;
  }

  // Start at first point
  let d = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  // Use quadratic Bezier: each original point becomes a control point,
  // and the curve passes through midpoints between consecutive original points.
  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    d += `Q${points[i].x.toFixed(1)},${points[i].y.toFixed(1)} ${midX.toFixed(1)},${midY.toFixed(1)}`;
  }

  // End at last point
  const last = points[points.length - 1];
  const secondLast = points[points.length - 2];
  d += `Q${secondLast.x.toFixed(1)},${secondLast.y.toFixed(1)} ${last.x.toFixed(1)},${last.y.toFixed(1)}`;

  return d;
}
