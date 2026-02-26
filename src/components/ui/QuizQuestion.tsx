"use client";

import { useState } from "react";

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
}: QuizQuestionProps) {
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

  return (
    <div className="my-6 rounded-lg border border-gray-200 bg-white p-5">
      <p className="font-medium text-gray-900 mb-3">{question}</p>

      <div className="space-y-2" role="radiogroup" aria-label={question}>
        {options.map((option, i) => {
          const optionStyle = getOptionStyle(i, selected, correctIndex, revealed);

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              role="radio"
              aria-checked={selected === i}
              disabled={revealed}
              className={`w-full text-left rounded-md border p-3 text-sm transition-colors ${optionStyle} disabled:cursor-default`}
            >
              <span className="font-medium text-gray-500 mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {!revealed && (
        <button
          onClick={handleCheck}
          disabled={selected === null}
          className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
        >
          Check Answer
        </button>
      )}

      {revealed && (
        <div
          className={`mt-3 rounded-md p-3 text-sm ${
            selected === correctIndex
              ? "bg-green-50 text-green-800"
              : "bg-amber-50 text-amber-800"
          }`}
        >
          <p className="font-medium mb-1">
            {selected === correctIndex ? "Correct!" : "Not quite."}
          </p>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}

function getOptionStyle(
  index: number,
  selected: number | null,
  correctIndex: number,
  revealed: boolean,
): string {
  if (revealed && index === correctIndex) return "border-green-500 bg-green-50";
  if (revealed && index === selected) return "border-red-500 bg-red-50";
  if (index === selected) return "border-blue-500 bg-blue-50";
  return "border-gray-200 hover:border-gray-300";
}
