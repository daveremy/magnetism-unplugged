import { describe, it, expect } from "vitest";
import {
  type DipoleState,
  getPolePositions,
  facingPoles,
  isAttraction,
  forceBetweenDipoles,
} from "@/lib/physics/interactions";

function makeDipole(
  cx: number,
  flipped = false,
  halfLength = 25,
): DipoleState {
  return { center: { x: cx, y: 100 }, halfLength, strength: 100, flipped };
}

describe("getPolePositions", () => {
  it("default: north = left, south = right", () => {
    const d = makeDipole(200);
    const poles = getPolePositions(d);
    expect(poles.north.x).toBe(175);
    expect(poles.south.x).toBe(225);
    expect(poles.north.y).toBe(100);
  });

  it("flipped: north = right, south = left", () => {
    const d = makeDipole(200, true);
    const poles = getPolePositions(d);
    expect(poles.north.x).toBe(225);
    expect(poles.south.x).toBe(175);
  });
});

describe("facingPoles", () => {
  it("default A left, default B right → A's south faces B's north", () => {
    const a = makeDipole(150);
    const b = makeDipole(350);
    const result = facingPoles(a, b);
    expect(result.poleA).toBe("south");
    expect(result.poleB).toBe("north");
  });

  it("flipped B → A's south faces B's south", () => {
    const a = makeDipole(150);
    const b = makeDipole(350, true);
    const result = facingPoles(a, b);
    expect(result.poleA).toBe("south");
    expect(result.poleB).toBe("south");
  });

  it("flipped A → A's north faces B's north", () => {
    const a = makeDipole(150, true);
    const b = makeDipole(350);
    const result = facingPoles(a, b);
    expect(result.poleA).toBe("north");
    expect(result.poleB).toBe("north");
  });

  it("both flipped → A's north faces B's south", () => {
    const a = makeDipole(150, true);
    const b = makeDipole(350, true);
    const result = facingPoles(a, b);
    expect(result.poleA).toBe("north");
    expect(result.poleB).toBe("south");
  });
});

describe("isAttraction", () => {
  it("north-south → attraction", () => {
    expect(isAttraction("north", "south")).toBe(true);
  });

  it("south-north → attraction", () => {
    expect(isAttraction("south", "north")).toBe(true);
  });

  it("north-north → repulsion", () => {
    expect(isAttraction("north", "north")).toBe(false);
  });

  it("south-south → repulsion", () => {
    expect(isAttraction("south", "south")).toBe(false);
  });
});

describe("forceBetweenDipoles", () => {
  it("N–S facing → attraction (force pulls B toward A)", () => {
    const a = makeDipole(150);
    const b = makeDipole(350);
    const force = forceBetweenDipoles(a, b);
    expect(force.x).toBeLessThan(0);
  });

  it("S–S facing → repulsion (force pushes B away from A)", () => {
    const a = makeDipole(150);
    const b = makeDipole(350, true);
    const force = forceBetweenDipoles(a, b);
    expect(force.x).toBeGreaterThan(0);
  });

  it("N–N facing → repulsion", () => {
    const a = makeDipole(150, true);
    const b = makeDipole(350);
    const force = forceBetweenDipoles(a, b);
    expect(force.x).toBeGreaterThan(0);
  });

  it("force magnitude increases as magnets approach", () => {
    const a = makeDipole(100);
    const bFar = makeDipole(400);
    const bClose = makeDipole(250);
    const forceFar = forceBetweenDipoles(a, bFar);
    const forceClose = forceBetweenDipoles(a, bClose);
    expect(Math.abs(forceClose.x)).toBeGreaterThan(Math.abs(forceFar.x));
  });

  it("force is clamped at very close range", () => {
    const a = makeDipole(100);
    const b = makeDipole(155);
    const force = forceBetweenDipoles(a, b);
    const mag = Math.sqrt(force.x * force.x + force.y * force.y);
    expect(mag).toBeLessThanOrEqual(500);
  });

  it("magnets at same position → zero force", () => {
    const a = makeDipole(200);
    const b = makeDipole(200);
    const force = forceBetweenDipoles(a, b);
    expect(force.x).toBe(0);
    expect(force.y).toBe(0);
  });
});
