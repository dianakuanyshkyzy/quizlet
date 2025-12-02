"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { ArrowLeft, Star, Lightbulb } from "lucide-react";
import { Volume2 } from "lucide-react";
type Word = {
  id: string;
  term: string;
  definition: string;
  status: string;
  isStarred: boolean;
};

export default function FlashcardsClient() {
  const params = useParams();
  const moduleId = params.id;

  const [words, setWords] = useState<Word[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  function shuffleArray(arr: any[]) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  async function toggleStar(word: Word) {
    try {
      await fetch(`https://imba-server.up.railway.app/terms/${word.id}/star`, {
        method: "PATCH",
        credentials: "include",
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
  async function markTermAsStudied(id: string) {
    try {
      const res = await fetch(
        `https://imba-server.up.railway.app/terms/update-status/${id}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ success: true }),
        }
      );

      const data = await res.json();
      if (!data.ok) console.error("status update error", data);

      setWords((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: "learned" } : w))
      );
    } catch (err) {
      console.error("failed to update status", err);
    }
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
  function speak(text: string) {
    if (typeof window === "undefined") return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1;
    utter.pitch = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  }

  useEffect(() => {
    async function loadWords() {
      try {
        const res = await fetch(
          `https://imba-server.up.railway.app/terms?moduleId=${moduleId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.ok && Array.isArray(data.data?.data)) {
          const shuffled = shuffleArray(data.data.data);
          setWords(shuffled);
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
  if (loading) return <p className="text-center mt-20">Loading words...</p>;
  if (!current) return <p className="text-center mt-20">No words found</p>;

  return (
    <>
      <Header />

      <main className="flex flex-col items-center justify-start pt-40 min-h-screen p-6 bg-gray-100">
        <div className="relative w-[550px] h-[360px] perspective">
          <button
            className="absolute top-3 left-14 z-20 text-gray-500"
            onClick={() => speak(current.term)}
          >
            <Volume2 size={26} />
          </button>
          <button
            className="absolute top-3 right-3 z-20"
            onClick={() => toggleStar(current)}
          >
            <Star
              size={28}
              className={
                current.isStarred
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-400"
              }
            />
          </button>

          <button
            className="absolute top-3 left-3 z-20 text-gray-500"
            onClick={() => setShowHint((v) => !v)}
          >
            <Lightbulb size={26} />
          </button>

          {showHint && (
            <div className="absolute top-12 left-3 z-20 bg-white px-3 py-2 rounded-xl shadow text-sm text-gray-600">
              {getHint(current.definition)}
            </div>
          )}

          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
              flipped ? "rotate-y-180" : ""
            }`}
            onClick={() => setFlipped(!flipped)}
          >
            <div className="absolute w-full h-full bg-white rounded-3xl shadow-lg flex items-center justify-center text-4xl font-semibold backface-hidden p-6">
              {current.term}
            </div>

            <div className="absolute w-full h-full bg-white rounded-3xl shadow-lg flex items-center justify-center text-2xl p-8 rotate-y-180 backface-hidden">
              {current.definition}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            className="px-5 py-2 bg-[#4255FF] text-white rounded-full"
            onClick={() => {
              if (flipped) {
                markTermAsStudied(current.id);
              }
              setFlipped(false);
              setShowHint(false);
              setIndex((i) => Math.max(0, i - 1));
            }}
          >
            Prev
          </button>

          <button
            className="px-5 py-2 bg-[#4255FF] text-white rounded-full"
            onClick={() => {
              if (flipped) {
                markTermAsStudied(current.id);
              }
              setFlipped(false);
              setShowHint(false);
              setIndex((i) => Math.min(words.length - 1, i + 1));
            }}
          >
            Next
          </button>
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

      <style jsx global>{`
        .perspective {
          perspective: 1400px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
}
