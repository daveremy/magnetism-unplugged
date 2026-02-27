import {
  type Vector2D,
  add,
  subtract,
  magnitude,
  normalize,
  scale,
  fieldFromPole,
} from "./fields";

export interface DipoleState {
  center: Vector2D;
  halfLength: number;
  strength: number;
  flipped: boolean;
}

/**
 * Returns pole positions for a dipole. Default: north = left, south = right.
 * When flipped: north = right, south = left.
 */
export function getPolePositions(d: DipoleState): {
  north: Vector2D;
  south: Vector2D;
} {
  const left: Vector2D = { x: d.center.x - d.halfLength, y: d.center.y };
  const right: Vector2D = { x: d.center.x + d.halfLength, y: d.center.y };
  return d.flipped
    ? { north: right, south: left }
    : { north: left, south: right };
}

/**
 * Returns the poles that face each other along the line between magnet centers.
 * "Facing" means the inner-facing pole of each magnet (the one closest to the
 * other magnet's center), determined by which side of each magnet's center the
 * other magnet lies on.
 */
export function facingPoles(
  a: DipoleState,
  b: DipoleState,
): { poleA: "north" | "south"; poleB: "north" | "south" } {
  const polesA = getPolePositions(a);
  const polesB = getPolePositions(b);

  // Which pole of A is closer to B's center?
  const distAN = magnitude(subtract(b.center, polesA.north));
  const distAS = magnitude(subtract(b.center, polesA.south));
  const poleA = distAN <= distAS ? "north" : "south";

  // Which pole of B is closer to A's center?
  const distBN = magnitude(subtract(a.center, polesB.north));
  const distBS = magnitude(subtract(a.center, polesB.south));
  const poleB = distBN <= distBS ? "north" : "south";

  return { poleA, poleB };
}

export function isAttraction(
  poleA: "north" | "south",
  poleB: "north" | "south",
): boolean {
  return poleA !== poleB;
}

const MAX_FORCE_MAGNITUDE = 500;

/**
 * Net force on dipole `b` from dipole `a`. Sums all four pole-pair
 * contributions using fieldFromPole. Force is clamped to prevent instability.
 */
export function forceBetweenDipoles(a: DipoleState, b: DipoleState): Vector2D {
  const polesA = getPolePositions(a);
  const polesB = getPolePositions(b);

  // Guard: magnets at same position → zero force
  const sep = magnitude(subtract(b.center, a.center));
  if (sep < 0.001) return { x: 0, y: 0 };

  // Sum all four pole-pair contributions: force on each B pole = its strength * field from each A pole.
  // North pole strength = +strength, south = -strength.
  const aPoles = [
    { pos: polesA.north, strength: a.strength },
    { pos: polesA.south, strength: -a.strength },
  ];
  const bPoles = [
    { pos: polesB.north, strength: b.strength },
    { pos: polesB.south, strength: -b.strength },
  ];

  let totalForce: Vector2D = { x: 0, y: 0 };

  for (const ap of aPoles) {
    for (const bp of bPoles) {
      const field = fieldFromPole(ap.pos, ap.strength, bp.pos);
      totalForce = add(totalForce, scale(field, bp.strength));
    }
  }

  const mag = magnitude(totalForce);
  if (mag > MAX_FORCE_MAGNITUDE) {
    return scale(normalize(totalForce), MAX_FORCE_MAGNITUDE);
  }

  return totalForce;
}
