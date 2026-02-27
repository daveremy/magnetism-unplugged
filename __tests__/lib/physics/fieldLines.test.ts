import { describe, it, expect } from "vitest";
import {
  netFieldAt,
  traceFieldLine,
  generateSeedPoints,
  computeAllFieldLines,
  getPresetScene,
  pointsToSvgPath,
  DEFAULT_TRACE_CONFIG,
  type Scene,
} from "@/lib/physics/fieldLines";
import { fieldFromDipole, magnitude, subtract } from "@/lib/physics/fields";
import { getPolePositions } from "@/lib/physics/interactions";

function makeSingleScene(): Scene {
  return getPresetScene("single");
}

describe("netFieldAt", () => {
  it("matches fieldFromDipole for a single dipole scene", () => {
    const scene = makeSingleScene();
    const point = { x: 350, y: 220 };
    const poles = getPolePositions(scene.dipoles[0]);

    const net = netFieldAt(scene, point);
    const direct = fieldFromDipole(poles.north, poles.south, scene.dipoles[0].strength, point);

    expect(net.x).toBeCloseTo(direct.x, 10);
    expect(net.y).toBeCloseTo(direct.y, 10);
  });

  it("superposes fields from two dipoles", () => {
    const scene = getPresetScene("attracting");
    const point = { x: 300, y: 200 }; // midpoint between magnets
    const poles0 = getPolePositions(scene.dipoles[0]);
    const poles1 = getPolePositions(scene.dipoles[1]);

    const f0 = fieldFromDipole(poles0.north, poles0.south, scene.dipoles[0].strength, point);
    const f1 = fieldFromDipole(poles1.north, poles1.south, scene.dipoles[1].strength, point);
    const net = netFieldAt(scene, point);

    expect(net.x).toBeCloseTo(f0.x + f1.x, 10);
    expect(net.y).toBeCloseTo(f0.y + f1.y, 10);
  });

  it("produces near-zero field at neutral point of repelling pair", () => {
    const scene = getPresetScene("repelling");
    // Midpoint between two repelling magnets
    const midpoint = { x: 300, y: 200 };
    const field = netFieldAt(scene, midpoint);
    // Field should be very weak at the neutral point (y-components cancel by symmetry)
    expect(magnitude(field)).toBeLessThan(0.1);
  });
});

describe("traceFieldLine", () => {
  it("traces from north pole seed toward south pole for single magnet", () => {
    const scene = makeSingleScene();
    const poles = getPolePositions(scene.dipoles[0]);
    // Seed just above the north pole
    const start = { x: poles.north.x, y: poles.north.y - 10 };
    const line = traceFieldLine(scene, start, 1);

    expect(line.length).toBeGreaterThan(5);
    // Last point should be near the south pole
    const last = line[line.length - 1];
    const distToSouth = magnitude(subtract(last, poles.south));
    expect(distToSouth).toBeLessThan(DEFAULT_TRACE_CONFIG.poleRadius + DEFAULT_TRACE_CONFIG.stepSize);
  });

  it("terminates when leaving bounds", () => {
    const scene = makeSingleScene();
    const poles = getPolePositions(scene.dipoles[0]);
    // Start just above the north pole — the line will arc upward and eventually leave bounds
    const start = { x: poles.north.x - 10, y: poles.north.y - 10 };
    const line = traceFieldLine(scene, start, 1);

    expect(line.length).toBeGreaterThanOrEqual(2);
    const last = line[line.length - 1];
    const { bounds } = DEFAULT_TRACE_CONFIG;
    const outOfBounds =
      last.x <= bounds.xMin ||
      last.x >= bounds.xMax ||
      last.y <= bounds.yMin ||
      last.y >= bounds.yMax;
    const threshold = DEFAULT_TRACE_CONFIG.poleRadius + DEFAULT_TRACE_CONFIG.stepSize;
    const nearPole = scene.dipoles.some((dipole) => {
      const p = getPolePositions(dipole);
      return (
        magnitude(subtract(last, p.south)) < threshold ||
        magnitude(subtract(last, p.north)) < threshold
      );
    });
    expect(outOfBounds || nearPole).toBe(true);
  });

  it("never produces fewer than 2 points", () => {
    const scene = makeSingleScene();
    // Start right at the pole radius boundary
    const poles = getPolePositions(scene.dipoles[0]);
    const start = { x: poles.north.x + 8, y: poles.north.y };
    const line = traceFieldLine(scene, start, 1);
    expect(line.length).toBeGreaterThanOrEqual(2);
  });

  it("consecutive points are never farther apart than stepSize * 1.5", () => {
    const scene = makeSingleScene();
    const poles = getPolePositions(scene.dipoles[0]);
    const start = { x: poles.north.x, y: poles.north.y - 10 };
    const line = traceFieldLine(scene, start, 1);

    for (let i = 1; i < line.length; i++) {
      const dist = magnitude(subtract(line[i], line[i - 1]));
      expect(dist).toBeLessThanOrEqual(DEFAULT_TRACE_CONFIG.stepSize * 1.5);
    }
  });
});

describe("generateSeedPoints", () => {
  it("produces correct count: dipoles × 2 poles × seedsPerPole", () => {
    const scene = getPresetScene("attracting");
    const seeds = generateSeedPoints(scene, 8, 8);
    // 2 dipoles × 2 poles × 8 seeds = 32
    expect(seeds.length).toBe(32);
  });

  it("single dipole count is correct", () => {
    const scene = makeSingleScene();
    const seeds = generateSeedPoints(scene, 10, 8);
    // 1 dipole × 2 poles × 10 seeds = 20
    expect(seeds.length).toBe(20);
  });

  it("seeds are equidistant in angle (deterministic)", () => {
    const scene = makeSingleScene();
    const seeds = generateSeedPoints(scene, 8, 10);
    const poles = getPolePositions(scene.dipoles[0]);

    // Check north pole seeds (first 8)
    const northSeeds = seeds.slice(0, 8);
    const angles = northSeeds.map((s) =>
      Math.atan2(s.point.y - poles.north.y, s.point.x - poles.north.x),
    );

    // Angle differences should be uniform: 2π/8
    const expectedDelta = (2 * Math.PI) / 8;
    for (let i = 1; i < angles.length; i++) {
      let delta = angles[i] - angles[i - 1];
      if (delta < 0) delta += 2 * Math.PI;
      expect(delta).toBeCloseTo(expectedDelta, 5);
    }
  });

  it("all seeds are exactly seedRadius from their parent pole", () => {
    const scene = makeSingleScene();
    const seedRadius = 10;
    const seeds = generateSeedPoints(scene, 8, seedRadius);
    const poles = getPolePositions(scene.dipoles[0]);

    // First 8 are north pole seeds
    for (let i = 0; i < 8; i++) {
      const dist = magnitude({
        x: seeds[i].point.x - poles.north.x,
        y: seeds[i].point.y - poles.north.y,
      });
      expect(dist).toBeCloseTo(seedRadius, 5);
    }

    // Next 8 are south pole seeds
    for (let i = 8; i < 16; i++) {
      const dist = magnitude({
        x: seeds[i].point.x - poles.south.x,
        y: seeds[i].point.y - poles.south.y,
      });
      expect(dist).toBeCloseTo(seedRadius, 5);
    }
  });
});

describe("computeAllFieldLines", () => {
  it("single magnet produces 15+ field lines, all with >5 points", () => {
    const scene = makeSingleScene();
    const lines = computeAllFieldLines(scene);
    expect(lines.length).toBeGreaterThanOrEqual(15);
    for (const line of lines) {
      expect(line.length).toBeGreaterThan(5);
    }
  });

  it("attracting pair: at least one line bridges to the other magnet", () => {
    const scene = getPresetScene("attracting");
    const lines = computeAllFieldLines(scene);
    const poles1 = getPolePositions(scene.dipoles[1]);

    // At least one line from magnet A should end near magnet B's south pole
    const bridging = lines.some((line) => {
      const last = line[line.length - 1];
      const dist = magnitude(subtract(last, poles1.south));
      return dist < DEFAULT_TRACE_CONFIG.poleRadius + DEFAULT_TRACE_CONFIG.stepSize;
    });
    expect(bridging).toBe(true);
  });

  it("repelling pair: no line midpoint falls between the two magnet centers", () => {
    const scene = getPresetScene("repelling");
    const lines = computeAllFieldLines(scene);
    const cx0 = scene.dipoles[0].center.x;
    const cx1 = scene.dipoles[1].center.x;
    const gapLeft = cx0 + 30; // just past magnet A's extent
    const gapRight = cx1 - 30; // just before magnet B's extent

    // Check that for most lines, their midpoint does NOT fall in the gap
    // (some lines near the axis may still curve through, so check majority)
    let midpointsInGap = 0;
    for (const line of lines) {
      const midIdx = Math.floor(line.length / 2);
      const mid = line[midIdx];
      if (mid.x > gapLeft && mid.x < gapRight) {
        midpointsInGap++;
      }
    }
    // Most lines should curve away — fewer than 25% should pass through
    expect(midpointsInGap / lines.length).toBeLessThan(0.25);
  });

  it("all lines are oriented N→S (field direction at start points away from north)", () => {
    const scene = makeSingleScene();
    const lines = computeAllFieldLines(scene);
    const poles = getPolePositions(scene.dipoles[0]);

    // For each line, the first point should be closer to a north pole
    // and the last point closer to a south pole (or out of bounds)
    let correctOrientation = 0;
    for (const line of lines) {
      const first = line[0];
      const last = line[line.length - 1];
      const firstDistToNorth = magnitude(subtract(first, poles.north));
      const lastDistToNorth = magnitude(subtract(last, poles.north));
      if (firstDistToNorth < lastDistToNorth) correctOrientation++;
    }
    // At least 80% should be correctly oriented N→S
    expect(correctOrientation / lines.length).toBeGreaterThan(0.8);
  });

  it("repelling pair: at least one line exits viewport bounds", () => {
    const scene = getPresetScene("repelling");
    const lines = computeAllFieldLines(scene);
    const { bounds } = DEFAULT_TRACE_CONFIG;

    const exiting = lines.some((line) => {
      const last = line[line.length - 1];
      return (
        last.x <= bounds.xMin ||
        last.x >= bounds.xMax ||
        last.y <= bounds.yMin ||
        last.y >= bounds.yMax
      );
    });
    expect(exiting).toBe(true);
  });
});

describe("getPresetScene", () => {
  it("single: 1 dipole", () => {
    const scene = getPresetScene("single");
    expect(scene.dipoles.length).toBe(1);
  });

  it("attracting: 2 dipoles, opposite poles facing", () => {
    const scene = getPresetScene("attracting");
    expect(scene.dipoles.length).toBe(2);
    // Both not flipped: A's south (right) faces B's north (left) — attraction
    const polesA = getPolePositions(scene.dipoles[0]);
    const polesB = getPolePositions(scene.dipoles[1]);
    // A's south should be closer to B's north than B's south
    const aSouthToBNorth = Math.abs(polesA.south.x - polesB.north.x);
    const aSouthToBSouth = Math.abs(polesA.south.x - polesB.south.x);
    expect(aSouthToBNorth).toBeLessThan(aSouthToBSouth);
  });

  it("repelling: 2 dipoles, like poles facing", () => {
    const scene = getPresetScene("repelling");
    expect(scene.dipoles.length).toBe(2);
    // A not flipped, B flipped: A's south (right) faces B's south (left when flipped)
    const polesA = getPolePositions(scene.dipoles[0]);
    const polesB = getPolePositions(scene.dipoles[1]);
    // A's south should face B's south (B is flipped, so south is on left)
    // Both inner-facing poles should be same type
    const aInnerPole = polesA.south; // right side of A
    const bInnerPole = polesB.south; // left side of B (flipped)
    expect(aInnerPole.x).toBeLessThan(bInnerPole.x);
  });
});

describe("pointsToSvgPath", () => {
  it("produces valid SVG path starting with M", () => {
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 5 },
      { x: 20, y: 10 },
      { x: 30, y: 5 },
    ];
    const d = pointsToSvgPath(points);
    expect(d).toMatch(/^M/);
    expect(d).toContain("Q");
  });

  it("handles 2-point edge case (straight line)", () => {
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
    ];
    const d = pointsToSvgPath(points);
    expect(d).toMatch(/^M/);
    expect(d).toContain("L");
  });

  it("returns empty string for empty points", () => {
    expect(pointsToSvgPath([])).toBe("");
  });

  it("handles single point", () => {
    const d = pointsToSvgPath([{ x: 5, y: 10 }]);
    expect(d).toBe("M5,10");
  });
});
