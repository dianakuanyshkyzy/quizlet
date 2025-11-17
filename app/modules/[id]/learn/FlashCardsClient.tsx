"use client";

import { useState } from "react";
import type { Word } from "@/data/mockModules";
import Header from "@/components/Header";

export default function FlashcardsClient({ words }: { words: Word[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = words[index];

  if (!current) return <p className="text-center mt-20">No words found</p>;

  return (
    <>
    <Header />
    
    <main className="flex flex-col items-center justify-start pt-48 min-h-screen p-8 bg-gray-50">
      <div
        className="bg-white rounded-2xl shadow-md w-96 h-56 flex items-center justify-center text-2xl font-semibold cursor-pointer"
        onClick={() => setFlipped(!flipped)}
      >
        {flipped ? current.translation : current.term}
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
    </main>
    </>
  );
}
