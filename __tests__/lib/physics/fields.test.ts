import { describe, it, expect } from "vitest";
import {
  add,
  subtract,
  scale,
  magnitude,
  normalize,
  fieldFromPole,
  fieldFromDipole,
} from "@/lib/physics/fields";

describe("Vector operations", () => {
  it("adds two vectors", () => {
    expect(add({ x: 1, y: 2 }, { x: 3, y: 4 })).toEqual({ x: 4, y: 6 });
  });

  it("subtracts two vectors", () => {
    expect(subtract({ x: 5, y: 7 }, { x: 2, y: 3 })).toEqual({ x: 3, y: 4 });
  });

  it("scales a vector", () => {
    expect(scale({ x: 2, y: 3 }, 3)).toEqual({ x: 6, y: 9 });
  });

  it("computes magnitude", () => {
    expect(magnitude({ x: 3, y: 4 })).toBe(5);
  });

  it("computes magnitude of zero vector", () => {
    expect(magnitude({ x: 0, y: 0 })).toBe(0);
  });

  it("normalizes a vector", () => {
    const result = normalize({ x: 3, y: 4 });
    expect(result.x).toBeCloseTo(0.6);
    expect(result.y).toBeCloseTo(0.8);
  });

  it("normalizes zero vector to zero", () => {
    expect(normalize({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
  });
});

describe("fieldFromPole", () => {
  it("returns zero field when point is at the pole", () => {
    const result = fieldFromPole({ x: 0, y: 0 }, 1, { x: 0, y: 0 });
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("points away from a positive pole", () => {
    const result = fieldFromPole({ x: 0, y: 0 }, 1, { x: 1, y: 0 });
    expect(result.x).toBeGreaterThan(0);
    expect(result.y).toBeCloseTo(0);
  });

  it("points toward a negative pole", () => {
    const result = fieldFromPole({ x: 0, y: 0 }, -1, { x: 1, y: 0 });
    expect(result.x).toBeLessThan(0);
    expect(result.y).toBeCloseTo(0);
  });

  it("field is stronger at closer distances", () => {
    const close = fieldFromPole({ x: 0, y: 0 }, 1, { x: 1, y: 0 });
    const far = fieldFromPole({ x: 0, y: 0 }, 1, { x: 2, y: 0 });
    expect(magnitude(close)).toBeGreaterThan(magnitude(far));
  });

  it("follows inverse-square law", () => {
    const atOne = fieldFromPole({ x: 0, y: 0 }, 1, { x: 1, y: 0 });
    const atTwo = fieldFromPole({ x: 0, y: 0 }, 1, { x: 2, y: 0 });
    // At double distance, field should be 1/4 strength
    expect(magnitude(atOne) / magnitude(atTwo)).toBeCloseTo(4);
  });
});

describe("fieldFromDipole", () => {
  it("produces stronger field between poles than behind them", () => {
    const northPos = { x: -1, y: 0 };
    const southPos = { x: 1, y: 0 };
    const strength = 1;

    // Field at midpoint between poles
    const between = fieldFromDipole(northPos, southPos, strength, {
      x: 0,
      y: 0.5,
    });

    // Field far behind north pole
    const behind = fieldFromDipole(northPos, southPos, strength, {
      x: -3,
      y: 0,
    });

    expect(magnitude(between)).toBeGreaterThan(magnitude(behind));
  });

  it("field points from north to south along the axis", () => {
    const northPos = { x: -1, y: 0 };
    const southPos = { x: 1, y: 0 };
    const strength = 1;

    // Point between the poles on the axis
    const result = fieldFromDipole(northPos, southPos, strength, {
      x: 0,
      y: 0.1,
    });

    // Field should have a positive x component (pointing from N toward S)
    expect(result.x).toBeGreaterThan(0);
  });
});
