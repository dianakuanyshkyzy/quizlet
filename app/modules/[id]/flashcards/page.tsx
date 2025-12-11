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
  const [moduleInfo, setModuleInfo] = useState<{
    title: string;
    description: string;
  } | null>(null);
  useEffect(() => {
    async function loadModule() {
      try {
        const res = await fetch(
          `https://imba-server.up.railway.app/v2/modules/${moduleId}`,
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
      <main className="overflow-x-hidden bg-gray-100 min-h-screen">
        {moduleInfo && (
          <div className="text-[#4255FF] pt-10 mb-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold">{moduleInfo.title}</h1>
            <p className="text-gray-600 mt-4">{moduleInfo.description}</p>
          </div>
        )}
        <div className="flex flex-col items-center">
          <hr className=" w-full max-w-4xl mb-8 border-gray-300" />
        </div>

        <div className="flex flex-col items-center justify-start pt-10 p-6 flex-1">
          <div className="relative w-full max-w-[650px] h-[60vh] sm:h-[400px] perspective">
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
                flipped ? "rotate-y-180" : ""
              }`}
              onClick={() => setFlipped(!flipped)}
            >
              {!flipped && (
                <>
                  <button
                    className="absolute top-3 left-14 z-20 text-gray-500"
                    onClick={(e) => {
                      speak(current.term);
                      e.stopPropagation();
                    }}
                  >
                    <Volume2 size={26} />
                  </button>
                  <button
                    className="absolute top-3 right-3 z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(current);
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHint((v) => !v);
                    }}
                  >
                    <Lightbulb size={26} />
                  </button>
                </>
              )}

              {showHint && (
                <div className="absolute top-12 left-3 z-20 bg-white px-3 py-2 rounded-xl shadow text-sm text-gray-600">
                  {getHint(current.definition)}
                </div>
              )}

              <div className="absolute w-full h-full bg-white rounded-3xl shadow-lg flex items-center justify-center text-4xl font-semibold backface-hidden p-6">
                {current.term}
              </div>
              <div className="absolute w-full h-full bg-white rounded-3xl shadow-lg flex flex-col justify-between p-6 rotate-y-180 backface-hidden">
                <div className="flex justify-end gap-2">
                  <button
                    className="text-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(current.term);
                    }}
                  >
                    <Volume2 size={26} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(current);
                    }}
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
                </div>

                <div className="flex-1 flex items-center justify-center text-2xl p-8">
                  {current.definition}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              className="px-5 py-2 bg-[#4255FF] text-white rounded-full"
              onClick={() => {
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
                setFlipped(false);
                setShowHint(false);
                setIndex((i) => Math.min(words.length - 1, i + 1));
              }}
            >
              Next
            </button>
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
