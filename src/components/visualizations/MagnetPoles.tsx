"use client";

import { useState, useRef, useCallback } from "react";
import { animate } from "framer-motion";
import { MagnetBase } from "./shared/MagnetBase";
import { Arrow } from "./shared/Arrow";
import {
  type DipoleState,
  facingPoles,
  isAttraction,
  forceBetweenDipoles,
} from "@/lib/physics/interactions";
import { magnitude } from "@/lib/physics/fields";

const VIEW_W = 600;
const VIEW_H = 200;
const MAGNET_W = 100;
const MAGNET_H = 40;
const HALF_MAGNET = MAGNET_W / 2;
const CENTER_Y = VIEW_H / 2;
const MIN_X = HALF_MAGNET;
const MAX_X = VIEW_W - HALF_MAGNET;
const INITIAL_AX = 150;
const INITIAL_BX = 450;
const INTERACTION_RANGE = 200;
const SNAP_THRESHOLD = 50;
const REPEL_DISTANCE = 80;
const ARROW_MIN = 15;
const ARROW_MAX = 60;
const KEYBOARD_STEP = 10;

type InteractionState = "idle" | "attracting" | "repelling";

function clampX(x: number, otherX: number, isLeft: boolean): number {
  const clamped = Math.max(MIN_X, Math.min(MAX_X, x));
  if (isLeft) {
    return Math.min(clamped, otherX - MAGNET_W);
  }
  return Math.max(clamped, otherX + MAGNET_W);
}

function makeDipole(cx: number, flipped: boolean): DipoleState {
  return {
    center: { x: cx, y: CENTER_Y },
    halfLength: HALF_MAGNET / 2,
    strength: 100,
    flipped,
  };
}

export function MagnetPoles() {
  const [ax, setAx] = useState(INITIAL_AX);
  const [bx, setBx] = useState(INITIAL_BX);
  const [bFlipped, setBFlipped] = useState(false);
  const [dragging, setDragging] = useState<"a" | "b" | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  const cancelAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
  }, []);

  const dipoleA = makeDipole(ax, false);
  const dipoleB = makeDipole(bx, bFlipped);
  const gap = Math.abs(bx - ax) - MAGNET_W;
  const touching = gap <= 1;
  const inRange = gap < INTERACTION_RANGE && gap > 0;
  const facing = facingPoles(dipoleA, dipoleB);
  const attracts = isAttraction(facing.poleA, facing.poleB);
  const force = inRange ? forceBetweenDipoles(dipoleA, dipoleB) : null;
  const forceMag = force ? magnitude(force) : 0;

  let interaction: InteractionState = "idle";
  if ((touching || inRange) && attracts) interaction = "attracting";
  else if (touching || inRange) interaction = "repelling";

  const arrowLength = inRange
    ? ARROW_MIN + (ARROW_MAX - ARROW_MIN) * Math.min(forceMag / 200, 1)
    : 0;

  const clientToSvgX = useCallback(
    (clientX: number): number => {
      const svg = svgRef.current;
      if (!svg) return 0;
      const ctm = svg.getScreenCTM();
      if (!ctm) return 0;
      const point = new DOMPoint(clientX, 0);
      return point.matrixTransform(ctm.inverse()).x;
    },
    [],
  );

  const handlePointerDown = useCallback(
    (magnet: "a" | "b", e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as Element).setPointerCapture(e.pointerId);
      cancelAnimation();
      setDragging(magnet);
    },
    [cancelAnimation],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const svgX = clientToSvgX(e.clientX);
      if (dragging === "a") {
        setAx(clampX(svgX, bx, true));
      } else {
        setBx(clampX(svgX, ax, false));
      }
    },
    [dragging, ax, bx, clientToSvgX],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      (e.target as Element).releasePointerCapture(e.pointerId);
      setDragging(null);

      const currentGap = Math.abs(bx - ax) - MAGNET_W;
      if (currentGap > SNAP_THRESHOLD) return;

      const currentFacing = facingPoles(makeDipole(ax, false), makeDipole(bx, bFlipped));
      const currentAttracts = isAttraction(currentFacing.poleA, currentFacing.poleB);

      const midpoint = (ax + bx) / 2;
      let targetAx: number;
      let targetBx: number;
      let stiffness: number;
      let damping: number;

      if (currentAttracts) {
        targetAx = midpoint - MAGNET_W / 2;
        targetBx = midpoint + MAGNET_W / 2;
        stiffness = 300;
        damping = 20;
      } else {
        targetAx = Math.max(MIN_X, midpoint - REPEL_DISTANCE);
        targetBx = Math.min(MAX_X, midpoint + REPEL_DISTANCE);
        stiffness = 200;
        damping = 15;
      }

      cancelAnimation();
      animationRef.current = animate(0, 1, {
        type: "spring",
        stiffness,
        damping,
        onUpdate: (t) => {
          setAx(ax + (targetAx - ax) * t);
          setBx(bx + (targetBx - bx) * t);
        },
      });
    },
    [dragging, ax, bx, bFlipped, cancelAnimation],
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      (e.target as Element).releasePointerCapture(e.pointerId);
      setDragging(null);
    },
    [dragging],
  );

  const handleKeyDown = useCallback(
    (magnet: "a" | "b", e: React.KeyboardEvent) => {
      let delta = 0;
      if (e.key === "ArrowLeft") delta = -KEYBOARD_STEP;
      else if (e.key === "ArrowRight") delta = KEYBOARD_STEP;
      else return;

      e.preventDefault();
      cancelAnimation();
      if (magnet === "a") {
        setAx((prev) => clampX(prev + delta, bx, true));
      } else {
        setBx((prev) => clampX(prev + delta, ax, false));
      }
    },
    [ax, bx, cancelAnimation],
  );

  const handleFlip = useCallback(() => {
    cancelAnimation();
    setBFlipped((f) => !f);
  }, [cancelAnimation]);

  const handleReset = useCallback(() => {
    cancelAnimation();
    setAx(INITIAL_AX);
    setBx(INITIAL_BX);
    setBFlipped(false);
  }, [cancelAnimation]);

  let statusText: string;
  switch (interaction) {
    case "attracting":
      statusText = "Opposite poles — attracting!";
      break;
    case "repelling":
      statusText = "Same poles — repelling!";
      break;
    default:
      statusText = "Drag the magnets toward each other";
  }

  const aRightEdge = ax + HALF_MAGNET;
  const bLeftEdge = bx - HALF_MAGNET;
  const arrowMidX = (aRightEdge + bLeftEdge) / 2;

  return (
    <figure className="my-8 flex flex-col items-center gap-3">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full max-w-[600px]"
        style={{ touchAction: "none" }}
        aria-label="Magnet poles interaction simulation"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* Track line */}
        <line
          x1={MIN_X}
          y1={CENTER_Y}
          x2={MAX_X}
          y2={CENTER_Y}
          stroke="var(--rule)"
          strokeWidth={2}
          strokeDasharray="6 4"
        />

        {/* Force arrows: offset from center for attraction, centered for repulsion */}
        {inRange && arrowLength > ARROW_MIN && (() => {
          const offset = attracts ? arrowLength / 2 : 0;
          return (
            <>
              <Arrow
                x={arrowMidX + offset}
                y={CENTER_Y}
                angle={180}
                length={arrowLength / 2}
                color="var(--experiment)"
                strokeWidth={2.5}
              />
              <Arrow
                x={arrowMidX - offset}
                y={CENTER_Y}
                angle={0}
                length={arrowLength / 2}
                color="var(--experiment)"
                strokeWidth={2.5}
              />
            </>
          );
        })()}

        {/* Magnet A */}
        <g
          tabIndex={0}
          role="slider"
          aria-label="Magnet A"
          aria-valuemin={MIN_X}
          aria-valuemax={MAX_X}
          aria-valuenow={Math.round(ax)}
          aria-orientation="horizontal"
          style={{ cursor: dragging === "a" ? "grabbing" : "grab" }}
          onPointerDown={(e) => handlePointerDown("a", e)}
          onKeyDown={(e) => handleKeyDown("a", e)}
        >
          <MagnetBase x={ax} y={CENTER_Y} width={MAGNET_W} height={MAGNET_H} />
        </g>

        {/* Magnet B */}
        <g
          tabIndex={0}
          role="slider"
          aria-label="Magnet B"
          aria-valuemin={MIN_X}
          aria-valuemax={MAX_X}
          aria-valuenow={Math.round(bx)}
          aria-orientation="horizontal"
          style={{ cursor: dragging === "b" ? "grabbing" : "grab" }}
          onPointerDown={(e) => handlePointerDown("b", e)}
          onKeyDown={(e) => handleKeyDown("b", e)}
        >
          <MagnetBase
            x={bx}
            y={CENTER_Y}
            width={MAGNET_W}
            height={MAGNET_H}
            label={
              bFlipped
                ? { north: "S", south: "N" }
                : { north: "N", south: "S" }
            }
            fill={
              bFlipped
                ? { north: "#3b82f6", south: "#ef4444" }
                : undefined
            }
          />
        </g>
      </svg>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleFlip}
          className="rounded-md border border-rule px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-paper-warm"
        >
          Flip Magnet B
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
        style={{
          color:
            interaction === "idle"
              ? "var(--ink-muted)"
              : "var(--experiment)",
        }}
      >
        {statusText}
      </div>

      <figcaption className="sr-only">
        Interactive simulation: drag two bar magnets to explore how magnetic
        poles attract and repel.
      </figcaption>
    </figure>
  );
}
