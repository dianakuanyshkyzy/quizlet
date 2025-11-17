"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Word } from "@/data/mockModules";
import Header from "@/components/Header";


type Question =
  | { type: "written"; word: Word; id: string }
  | { type: "written2"; word: Word; id: string }
  | { type: "mc"; word: Word; options: string[]; id: string }
  | { type: "matching"; pairs: Word[]; id: string }; 

export default function TestPageClient({
  words,
  moduleName,
}: {
  words: Word[];
  moduleName: string;
}) {
  const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
  const id = (prefix = "") => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

  const questions = useMemo<Question[]>(() => {
    if (!words || words.length === 0) return [];

    const shuffled = shuffle(words);
    const qs: Question[] = [];

    shuffled.forEach((w) => {
      if (Math.random() < 0.6) {
        const otherTranslations = shuffle(
          words.filter((x) => x.term !== w.term).map((x) => x.translation)
        ).slice(0, Math.min(3, words.length - 1));
        const options = shuffle([w.translation, ...otherTranslations]);

        qs.push({ type: "mc", word: w, options, id: id("mc-") });
      } else {
        if (Math.random() < 0.5) {
            qs.push({ type: "written", word: w, id: id("wr-") });
        } else {
            qs.push({ type: "written2", word: w, id: id("wr2-") });
        }
      }
    });

    if (words.length >= 2) {
      const insertAt = Math.max(1, Math.floor(qs.length / 2));
      const matchingPairs = shuffle(shuffled.slice(0, Math.min(6, shuffled.length))); 
      qs.splice(insertAt, 0, { type: "matching", pairs: matchingPairs, id: id("mt-") });
    }

    return qs;
  }, [JSON.stringify(words)]); 

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({}); 
  const [showResult, setShowResult] = useState(false);
  const [wrongList, setWrongList] = useState<{ word: Word; correct: string; given?: string }[]>([]);

  useEffect(() => {
    setIndex(0);
    setScore(0);
    setAnswers({});
    setShowResult(false);
    setWrongList([]);
  }, [questions.length]);

  if (!questions || questions.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <p>No words in this module.</p>
      </main>
    );
  }

  const current = questions[index];
  const total = questions.length;

  const handleSubmitWritten = (word: Word, value: string) => {
    const correct = value.trim().toLowerCase() === word.translation.trim().toLowerCase();
    if (correct) setScore((s) => s + 1);
    else setWrongList((arr) => [...arr, { word, correct: word.translation, given: value }]);
    setAnswers((a) => ({ ...a, [current.id]: { given: value, correct } }));
    next();
  };
  const handleSubmitWritten2 = (word: Word, value: string) => {
    const correct = value.trim().toLowerCase() === word.term.trim().toLowerCase();
    if (correct) setScore((s) => s + 1);
    else setWrongList((arr) => [...arr, { word, correct: word.term, given: value }]);
    setAnswers((a) => ({ ...a, [current.id]: { given: value, correct } }));
    next();
  };
  const handleSubmitMC = (choice: string) => {
    const correct = choice === (current as any).word.translation;
    if (correct) setScore((s) => s + 1);
    else setWrongList((arr) => [...arr, { word: (current as any).word, correct: (current as any).word.translation, given: choice }]);
    setAnswers((a) => ({ ...a, [current.id]: { given: choice, correct } }));
    setTimeout(next, 350);
  };

  const [matchLeftSelected, setMatchLeftSelected] = useState<string | null>(null);
  const [matchRightOrder, setMatchRightOrder] = useState<string[]>([]);
  const [matchPairsGiven, setMatchPairsGiven] = useState<Record<string, string>>({}); 

  useEffect(() => {
    if (current?.type === "matching") {
      setMatchRightOrder(shuffle((current as any).pairs.map((p: Word) => p.translation)));
      setMatchLeftSelected(null);
      setMatchPairsGiven({});
    }
  }, [current?.id]);

  const handleMatchSelectLeft = (term: string) => {
    setMatchLeftSelected(term);
  };

  const handleMatchSelectRight = (translation: string) => {
    if (!matchLeftSelected) return;
    setMatchPairsGiven((m) => ({ ...m, [matchLeftSelected]: translation }));
    setMatchLeftSelected(null);
  };

  const submitMatching = () => {
    const pairs = (current as any).pairs as Word[];
    let correctCount = 0;
    pairs.forEach((p) => {
      const given = matchPairsGiven[p.term];
      if (given && given.trim().toLowerCase() === p.translation.trim().toLowerCase()) {
        correctCount++;
      } else {
        setWrongList((arr) => [...arr, { word: p, correct: p.translation, given: matchPairsGiven[p.term] }]);
      }
    });
    setScore((s) => s + correctCount);
    setAnswers((a) => ({ ...a, [current.id]: { given: matchPairsGiven, correctCount } }));
    next();
  };

  function next() {
    if (index + 1 >= total) {
      setShowResult(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  const progressPct = Math.round(((index) / total) * 100);

  return (
    <>
    <Header/>
    
    <main className="min-h-screen p-8 bg-gray-50">
      <header className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#4255FF] mb-2">{moduleName} — Test</h1>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="h-2 rounded-full bg-[#4255FF] transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Question {index + 1} / {total}
        </p>
      </header>

      <section className="max-w-4xl mx-auto">
        {!showResult && (
          <div className="bg-white rounded-2xl shadow p-6">
            {current.type === "written" && (
              <WrittenQuestion
                key={current.id}
                word={(current as any).word}
                onSubmit={(val) => handleSubmitWritten((current as any).word, val)}
              />
            )}
            {current.type === "written2" && (
            <WrittenQuestion2
                key={current.id}
                word={(current as any).word}
                onSubmit={(val) => handleSubmitWritten2((current as any).word, val)}
            />
            )}

            {current.type === "mc" && (
              <MCQuestion
                key={current.id}
                word={(current as any).word}
                options={(current as any).options}
                onChoose={handleSubmitMC}
              />
            )}

            {current.type === "matching" && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Matching</h3>
                <p className="text-sm text-gray-600 mb-4">Click a term on the left, then its translation on the right.</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {((current as any).pairs as Word[]).map((p) => (
                      <button
                        key={p.term}
                        onClick={() => handleMatchSelectLeft(p.term)}
                        className={`w-full text-left p-3 rounded-xl mb-2 border ${
                          matchLeftSelected === p.term ? "border-[#4255FF] bg-[#eef2ff]" : "border-gray-200 bg-white"
                        }`}
                      >
                        {p.term}
                        <div className="text-sm text-gray-400">{matchPairsGiven[p.term] ? `(→ ${matchPairsGiven[p.term]})` : ""}</div>
                      </button>
                    ))}
                  </div>

                  <div>
                    {matchRightOrder.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleMatchSelectRight(t)}
                        className="w-full text-left p-3 rounded-xl mb-2 border border-gray-200 bg-white"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 border rounded"
                    onClick={() => {
                      setMatchPairsGiven({});
                      setMatchLeftSelected(null);
                    }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={submitMatching}
                    className="px-4 py-2 bg-[#4255FF] text-white rounded"
                  >
                    Submit Matching
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {showResult && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <h2 className="text-3xl font-bold mb-2">Test completed 🎉</h2>
            <p className="text-gray-600 mb-4">Score: {score}</p>
            <p className="text-sm text-gray-500 mb-6">
              {wrongList.length === 0 ? "Perfect! You got everything." : `You missed ${wrongList.length} items.`}
            </p>

            {wrongList.length > 0 && (
              <div className="text-left max-w-2xl mx-auto">
                <h3 className="font-semibold mb-2">Review</h3>
                <ul className="space-y-2">
                  {wrongList.map((w, i) => (
                    <li key={i} className="p-3 rounded-lg border">
                      <div className="font-semibold">{w.word.term}</div>
                      <div className="text-sm text-green-700">Correct: {w.correct}</div>
                      {w.given && <div className="text-sm text-red-600">Your answer: {String(w.given)}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="px-4 py-2 bg-[#4255FF] text-white rounded"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
    </>
  );
}

function WrittenQuestion({ word, onSubmit }: { word: Word; onSubmit: (val: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Choose the correct translation</h3>
      <p className="text-2xl font-bold mb-4">{word.term}</p>
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4"
        placeholder="Type translation..."
      />
      <div className="flex justify-end">
        <button
          onClick={() => onSubmit(val)}
          className="px-4 py-2 bg-[#4255FF] text-white rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
function WrittenQuestion2({ word, onSubmit }: { word: Word; onSubmit: (val: string) => void }) {
    const [val, setVal] = useState("");
    return (
      <div>
        <h3 className="text-lg font-semibold mb-3">Choose the correct translation</h3>
  
        <p className="text-2xl font-bold mb-4">{word.translation}</p>
  
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Type translation..."
        />
  
        <div className="flex justify-end">
          <button
            onClick={() => onSubmit(val)}
            className="px-4 py-2 bg-[#4255FF] text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
      
    );
  }
  

function MCQuestion({ word, options, onChoose }: { word: Word; options: string[]; onChoose: (choice: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const choose = (o: string) => {
    if (locked) return;
    setSelected(o);
    setLocked(true);
    setTimeout(() => {
      onChoose(o);
      setLocked(false);
      setSelected(null);
    }, 450);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Choose the correct translation</h3>
      <p className="text-2xl font-bold mb-4">{word.term}</p>

      <div className="flex flex-col gap-3">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => choose(o)}
            className={`p-3 rounded-xl border text-left transition ${
              selected === o ? "bg-gray-200" : "bg-white"
            }`}
            disabled={locked}
          >
            {o}
          </button>
        ))}
      </div>
    </div>

  );
}
