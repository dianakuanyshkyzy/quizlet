"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Lightbulb, Star } from "lucide-react";
import type { Term, TermProgress } from "../types";
import { getTermProgress, updateTermProgress } from "@/lib/api";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizClient() {
  const params = useParams();
  const moduleId = params.id;

  const [words, setWords] = useState<Term[]>([]);
  const [progressMap, setProgressMap] = useState<
    Record<string, TermProgress["status"]>
  >({});
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [moduleInfo, setModuleInfo] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  const current = words[index];
  const total = words.length;

  useEffect(() => {
    if (!moduleId) return;
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
    loadModule();
  }, [moduleId]);

  useEffect(() => {
    if (!moduleId) return;

    async function loadWordsAndProgress() {
      try {
        const res = await fetch(
          `https://imba-server.up.railway.app/terms?moduleId=${moduleId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.ok && Array.isArray(data.data?.data)) {
          setWords(data.data.data);

          const progressArr = await Promise.all(
            data.data.data.map(async (term: Term) => {
              try {
                const res = await getTermProgress(term.id);
                return res.data?.status ?? "not_started";
              } catch {
                return "not_started";
              }
            })
          );

          const map: Record<string, TermProgress["status"]> = {};
          data.data.data.forEach((term: Term, i: number) => {
            map[term.id] = progressArr[i];
          });
          setProgressMap(map);
        }
      } catch (err) {
        console.error("failed to load words/progress", err);
      } finally {
        setLoading(false);
      }
    }

    loadWordsAndProgress();
  }, [moduleId]);

  useEffect(() => {
    if (!current) return;
    const wrong = shuffle(words.filter((w) => w.id !== current.id))
      .slice(0, 3)
      .map((w) => w.definition);
    setOptions(shuffle([current.definition, ...wrong]));
  }, [current]);

  function getNextStatus(current: TermProgress["status"], isCorrect: boolean) {
    const order: TermProgress["status"][] = [
      "not_started",
      "in_progress",
      "completed",
    ];
    const idx = order.indexOf(current);
    if (idx === -1) return current;
    return isCorrect
      ? order[Math.min(idx + 1, order.length - 1)]
      : order[Math.max(idx - 1, 0)];
  }

  async function toggleStar(word: Term) {
    try {
      await fetch(`https://imba-server.up.railway.app/terms/${word.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: !word.isStarred }),
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
  async function check(answer: string) {
    if (!current) return;

    setSelected(answer);
    const isCorrect = answer === current.definition;
    setCorrect(isCorrect);

    const termId = current.id;
    const currentStatus = progressMap[termId] ?? "not_started";

    // determine the new status for this term
    const newStatus = getNextStatus(currentStatus, isCorrect);
    console.log(
      "updating term",
      termId,
      "from",
      currentStatus,
      "to",
      newStatus
    );

    try {
      // update on server
      await updateTermProgress(termId, newStatus);

      // update local state
      setProgressMap((prev) => {
        const updatedMap = { ...prev, [termId]: newStatus };

        // recalc module progress
        const total = Object.keys(updatedMap).length;
        const counts = { not_started: 0, in_progress: 0, completed: 0 };
        Object.values(updatedMap).forEach((status) => counts[status]++);
        const moduleProgress = {
          not_started: counts.not_started / total,
          in_progress: counts.in_progress / total,
          completed: counts.completed / total,
          completedTerms: counts.completed,
        };

        // update module info with new progress
        setModuleInfo((info) =>
          info ? { ...info, progress: moduleProgress } : info
        );

        return updatedMap;
      });
    } catch (err) {
      console.error("failed to update term progress", err);
    }

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
    if (words.length === 1) return words[0].slice(0, 3) + "...";
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

  if (loading) return <p className="text-center mt-20">Loading words...</p>;
  if (!current) return <p className="text-center mt-20">No words found</p>;

  return (
    <main className="bg-gray-100 min-h-screen overflow-x-hidden">
      {moduleInfo && (
        <div className="text-[#4255FF] pt-10 mb-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">{moduleInfo.title}</h1>
          <p className="text-gray-600 mt-4">{moduleInfo.description}</p>
        </div>
      )}

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
            <div className="flex justify-between items-center w-full mb-4">
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
              <button
                onClick={() => (window.location.href = `/modules/${moduleId}`)}
                className="ml-4 px-5 py-3 mt-2 bg-gray-200 text-black rounded-xl shadow"
              >
                Back to terms
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6">{current.term}</h1>
              <div className="flex flex-col gap-3 w-full">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => check(opt)}
                    className={`p-4 rounded-xl border text-left transition ${
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
        <div className="mt-6 flex">
          <button
            onClick={() => (window.location.href = `/modules/${moduleId}`)}
            className="ml-8 text-black flex items-center gap-2 text-lg"
          >
            <ArrowLeft size={20} /> Back to terms
          </button>
        </div>
      </div>
    </main>
  );
}
