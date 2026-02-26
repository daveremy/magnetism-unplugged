export interface Vector2D {
  x: number;
  y: number;
}

/** Add two 2D vectors */
export function add(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x + b.x, y: a.y + b.y };
}

/** Subtract vector b from vector a */
export function subtract(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

/** Scale a vector by a scalar */
export function scale(v: Vector2D, s: number): Vector2D {
  return { x: v.x * s, y: v.y * s };
}

/** Compute the magnitude (length) of a vector */
export function magnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/** Normalize a vector to unit length. Returns zero vector if magnitude is 0. */
export function normalize(v: Vector2D): Vector2D {
  const mag = magnitude(v);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

/**
 * Calculate the magnetic field contribution from a single magnetic pole
 * at a given point. Uses inverse-square law: B ~ strength / r^2
 *
 * @param polePosition - Position of the magnetic pole
 * @param poleStrength - Strength of the pole (positive = north, negative = south)
 * @param point - Point where we want to know the field
 * @returns Field vector at the given point
 */
export function fieldFromPole(
  polePosition: Vector2D,
  poleStrength: number,
  point: Vector2D,
): Vector2D {
  const dx = point.x - polePosition.x;
  const dy = point.y - polePosition.y;
  const distSq = dx * dx + dy * dy;

  // Avoid division by zero — return zero field very close to the pole
  if (distSq < 0.0001) return { x: 0, y: 0 };

  const dist = Math.sqrt(distSq);
  // Field strength falls off with inverse-square; direction is displacement/dist
  const factor = poleStrength / (distSq * dist);

  return { x: dx * factor, y: dy * factor };
}

/**
 * Calculate the net magnetic field at a point from a bar magnet
 * modeled as two poles (north + south) separated by a distance.
 *
 * @param northPos - Position of the north pole
 * @param southPos - Position of the south pole
 * @param strength - Magnet strength (arbitrary units)
 * @param point - Point where we want to know the field
 * @returns Net field vector at the given point
 */
export function fieldFromDipole(
  northPos: Vector2D,
  southPos: Vector2D,
  strength: number,
  point: Vector2D,
): Vector2D {
  const northField = fieldFromPole(northPos, strength, point);
  const southField = fieldFromPole(southPos, -strength, point);
  return add(northField, southField);
}
