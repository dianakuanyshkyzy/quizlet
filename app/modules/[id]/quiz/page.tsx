"use client";

import { useState, useMemo, useEffect, use } from "react";
import Header from "@/components/Header";
import { useParams } from "next/navigation";
import { ArrowLeft, Lightbulb, Star } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

type Word = {
  id: string;
  term: string;
  definition: string;
  status: string;
  isStarred: boolean;
};

export default function QuizClient() {
  const params = useParams();
  const moduleId = params.id;
  const [showHint, setShowHint] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  const [moduleInfo, setModuleInfo] = useState<{
    title: string;
    description: string;
  } | null>(null);
  async function toggleStar(word: Word) {
    try {
      await fetch(`https://imba-server.up.railway.app/terms/${word.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isStarred: !word.isStarred,
        }),
      });

      setWords((prev) =>
        prev.map((w) =>
          w.id === word.id ? { ...w, isStarred: !w.isStarred } : w
        )
      );
    } catch (err) {
      console.error("star error", err);
    }
  }

  useEffect(() => {
    async function loadModule() {
      try {
        const res = await fetch(
          `https://imba-server.up.railway.app/modules/${moduleId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.ok && data.data) {
          setModuleInfo({
            title: data.data.title,
            description: data.data.description,
          });
        }
      } catch (err) {
        console.error("failed to load module info", err);
      }
    }

    if (moduleId) loadModule();
  }, [moduleId]);
  useEffect(() => {
    async function loadWords() {
      try {
        const res = await fetch(
          `https://imba-server.up.railway.app/terms?moduleId=${moduleId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.ok && Array.isArray(data.data?.data)) {
          setWords(data.data.data);
        }
      } catch (err) {
        console.error("failed to load words", err);
      } finally {
        setLoading(false);
      }
    }
    if (moduleId) loadWords();
  }, [moduleId]);

  const current = words[index];
  const total = words.length;

  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!current) return;

    const wrong = shuffle(words.filter((w) => w.id !== current.id))
      .slice(0, 3)
      .map((w) => w.definition);

    setOptions(shuffle([current.definition, ...wrong]));
  }, [current]);

  if (loading) return <p className="text-center mt-20">Loading words...</p>;
  if (!current) return <p className="text-center mt-20">No words found</p>;

  function check(answer: string) {
    setSelected(answer);
    const isCorrect = answer === current.definition;
    setCorrect(isCorrect);
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      setSelected(null);
      setCorrect(null);

      if (index === total - 1) setFinished(true);
      else setIndex((i) => i + 1);
    }, 900);
  }
  function getHint(term: string) {
    const words = term.trim().split(" ");

    if (words.length === 1) {
      const w = words[0];
      if (w.length <= 4) return w[0] + "...";
      return w.slice(0, 3) + "...";
    }
    return words.slice(0, Math.ceil(words.length / 2)).join(" ") + "…";
  }
  function retry() {
    setIndex(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setCorrect(null);
    setWords((prev) => shuffle(prev));
  }

  const progressPct = Math.round((index / total) * 100);

  return (
    <main className="bg-gray-100 min-h-screen overflow-x-hidden">
      {moduleInfo && (
        <div className="text-[#4255FF] pt-10 mb-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">{moduleInfo.title}</h1>
          <p className="text-gray-600 mt-4">{moduleInfo.description}</p>
        </div>
      )}
      <div className="flex flex-col items-center overflow-x-hidden">
        <hr className=" w-full max-w-4xl mb-2 border-gray-300" />
      </div>
      <div className="flex flex-col items-center min-h-screen p-6">
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow p-8 pb-16 flex flex-col items-center">
          {!finished && (
            <div className="w-full mb-6">
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

          {!finished && (
            <div className="flex justify-between items-center w-full">
              <button
                className="text-gray-500"
                onClick={() => setShowHint((v) => !v)}
              >
                <Lightbulb size={26} />
              </button>

              <button onClick={() => toggleStar(current)} type="button">
                <Star
                  size={28}
                  className={
                    current.isStarred
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>
          )}

          {!finished && showHint && (
            <div className="self-start top-12 left-3 z-20 bg-white px-3 py-2 rounded-xl shadow text-sm text-gray-600">
              {getHint(current.definition)}
            </div>
          )}
          {finished ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Quiz finished 🎉</h2>
              <p className="text-xl font-semibold mb-4">
                Your score: {score} / {total}
              </p>

              <button
                onClick={retry}
                className="px-5 py-3 mt-2 bg-blue-500 text-white rounded-xl shadow"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6 ">{current.term}</h1>

              <div className="flex flex-col gap-3 w-full">
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
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full fixed bottom-0 left-0 bg-gray-200 shadow-md py-4">
        <button
          onClick={() => (window.location.href = `/modules/${moduleId}`)}
          className="ml-8 text-black flex items-center gap-2 text-lg"
        >
          <ArrowLeft size={20} /> Back to terms
        </button>
      </div>
    </main>
  );
}
