"use client";

import { useState, useMemo } from "react";
import { Word } from "@/data/mockModules";
import Header from "@/components/Header";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizClient({ words }: { words: Word[] }) {
  const shuffled = useMemo(() => shuffle(words), [words]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = shuffled[index];
  const total = shuffled.length;

  const options = useMemo(() => {
    const wrong = shuffle(words.filter((w) => w !== current))
      .slice(0, 3)
      .map((w) => w.translation);

    return shuffle([current.translation, ...wrong]);
  }, [current, words]);

  function check(answer: string) {
    setSelected(answer);

    const isCorrect = answer === current.translation;
    setCorrect(isCorrect);
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      setSelected(null);
      setCorrect(null);

      if (index === total - 1) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
      }
    }, 900);
  }

  function retry() {
    setIndex(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setCorrect(null);
  }

  const progressPct = Math.round((index / total) * 100);

  return (
    <>
      <Header />

      <main className="flex flex-col items-center justify-start pt-24 min-h-screen p-8 bg-gray-50">
        {!finished && (
          <div className="w-full max-w-md mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {index + 1} / {total}
            </p>
          </div>
        )}

        {finished ? (
          <div className="bg-white p-6 rounded-2xl shadow max-w-md text-center">
            <h2 className="text-3xl font-bold mb-4">Quiz finished 🎉</h2>
            <p className="text-xl font-semibold mb-3">
              Your score: {score} / {total}
            </p>

            <button
              onClick={retry}
              className="px-5 py-2 mt-4 bg-blue-500 text-white rounded-xl"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
        <div className="flex justify-center items-center">
          <button
            className="mt-4 px-4 py-2 bg-gray-300 text-black rounded-full"
            onClick={() => (window.location.href = "/main")}
          >
            Home
          </button>
        </div>
      </main>
    </>
  );
}
