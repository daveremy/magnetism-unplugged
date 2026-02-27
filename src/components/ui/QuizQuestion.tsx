"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, XMarkIcon } from "./icons";

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function QuizQuestion({
  question,
  options,
  correctIndex,
  explanation,
}: QuizQuestionProps): ReactElement {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(index: number) {
    if (revealed) return;
    setSelected(index);
  }

  function handleCheck() {
    if (selected === null) return;
    setRevealed(true);
  }

  const isCorrect = revealed && selected === correctIndex;

  return (
    <div
      className="relative my-6 rounded-lg border border-rule bg-paper-warm p-5 overflow-hidden"
    >
      <p className="font-semibold text-ink mb-4">{question}</p>

      <div className="space-y-2" role="radiogroup" aria-label={question}>
        {options.map((option, i) => {
          const style = getOptionStyle(i, selected, correctIndex, revealed);

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              role="radio"
              aria-checked={selected === i}
              disabled={revealed}
              className={`w-full text-left rounded-lg border p-3 text-sm transition-all duration-150 ${style} disabled:cursor-default`}
            >
              <span className="inline-flex items-center gap-2.5">
                <span className="font-semibold text-ink-faint">
                  {String.fromCharCode(65 + i)}.
                </span>
                <span>{option}</span>
                {revealed && i === correctIndex && (
                  <CheckIcon size={16} className="text-success ml-auto shrink-0" />
                )}
                {revealed && i === selected && i !== correctIndex && (
                  <XMarkIcon size={16} className="text-north ml-auto shrink-0" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {!revealed && (
        <button
          onClick={handleCheck}
          disabled={selected === null}
          className="mt-4 rounded-md bg-north px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-north-vivid disabled:bg-rule disabled:text-ink-faint"
        >
          Check Answer
        </button>
      )}

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className={`mt-4 rounded-md p-4 text-sm ${
                isCorrect
                  ? "bg-success-soft text-ink-muted"
                  : "bg-north-soft text-ink-muted"
              }`}
            >
              <p className={`font-semibold mb-1 ${isCorrect ? "text-success" : "text-north"}`}>
                {isCorrect ? "Correct!" : "Not quite."}
              </p>
              <p>{explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti burst on correct answer */}
      {isCorrect && <ConfettiBurst />}
    </div>
  );
}

function getOptionStyle(
  index: number,
  selected: number | null,
  correctIndex: number,
  revealed: boolean,
): string {
  if (revealed && index === correctIndex)
    return "border-success bg-success-soft";
  if (revealed && index === selected)
    return "border-north bg-north-soft";
  if (index === selected)
    return "border-south bg-south-soft";
  return "border-rule bg-transparent hover:bg-paper hover:border-ink-faint";
}

function ConfettiBurst(): ReactElement {
  const particles = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * 360;
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * 60;
    const y = Math.sin(rad) * 60;
    const colors = [
      "var(--north)",
      "var(--south)",
      "var(--success)",
      "var(--caution)",
      "var(--experiment)",
      "var(--north-vivid)",
    ];
    return { x, y, color: colors[i] };
  });

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: p.x, y: p.y, scale: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
