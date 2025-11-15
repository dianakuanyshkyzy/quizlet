"use client";

import { useState, useMemo } from "react";
import { Word } from "@/data/mockModules";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizClient({ words }: { words: Word[] }) {
  // shuffle once
  const shuffled = useMemo(() => shuffle(words), [words]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);

  const current = shuffled[index];

  // also ensure options don't reshuffle on every render
  const options = useMemo(() => {
    const wrong = shuffle(words.filter((w) => w !== current))
      .slice(0, 3)
      .map((w) => w.translation);

    return shuffle([current.translation, ...wrong]);
  }, [current, words]);

  function check(answer: string) {
    setSelected(answer);
    setCorrect(answer === current.translation);

    setTimeout(() => {
      setSelected(null);
      setCorrect(null);
      setIndex((i) => Math.min(shuffled.length - 1, i + 1));
    }, 900);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">{current.term}</h1>

      <div className="flex flex-col gap-3 w-full max-w-md">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => check(opt)}
            className={`p-4 rounded-xl border text-left transition
              ${
                selected === opt
                  ? correct
                    ? "bg-green-300"
                    : "bg-red-300"
                  : "bg-white"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </main>
  );
}
