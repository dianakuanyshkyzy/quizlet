"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";

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
  const [loading, setLoading] = useState(true);

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
        } else {
          console.error("words data error", data);
        }
      } catch (err) {
        console.error("failed to load words", err);
      } finally {
        setLoading(false);
      }
    }

    if (moduleId) {
      loadWords();
    }
  }, [moduleId]);

  const current = words[index];
  if (loading) return <p className="text-center mt-20">Loading words...</p>;
  if (!current) return <p className="text-center mt-20">No words found</p>;

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-start pt-48 min-h-screen p-8 bg-gray-50">
        <div
          className="bg-white rounded-2xl shadow-md w-96 h-56 flex items-center justify-center text-2xl font-semibold cursor-pointer"
          onClick={() => setFlipped(!flipped)}
        >
          {flipped ? current.definition : current.term}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            className="px-4 py-2 bg-[#4255FF] text-white rounded-full"
            onClick={() => {
              setFlipped(false);
              setIndex((i) => Math.max(0, i - 1));
            }}
          >
            Prev
          </button>

          <button
            className="px-4 py-2 bg-[#4255FF] text-white rounded-full"
            onClick={() => {
              setFlipped(false);
              setIndex((i) => Math.min(words.length - 1, i + 1));
            }}
          >
            Next
          </button>
        </div>

        <button
          className="mt-4 px-4 py-2 bg-gray-300 text-black rounded-full"
          onClick={() => (window.location.href = "/main")}
        >
          Home
        </button>
      </main>
    </>
  );
}
