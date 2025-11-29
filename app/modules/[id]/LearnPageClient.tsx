"use client";

import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function LearnPageClient({ id }: { id: string }) {
  const router = useRouter();

  return (
    <>
      <Header />

      <main className="flex flex-col items-center justify-start min-h-screen p-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-[#4255FF] mb-6">
          Choose your mode
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <button
            className="bg-white shadow-md rounded-2xl p-8 text-xl font-semibold hover:shadow-xl transition"
            onClick={() => router.push(`/modules/${id}/flashcards`)}
          >
            <img src="/images/img3.png" />
            Flashcards
          </button>

          <button
            className="bg-white shadow-md rounded-2xl p-8 text-xl font-semibold hover:shadow-xl transition"
            onClick={() => router.push(`/modules/${id}/quiz`)}
          >
            <img src="/images/img1.png" />
            Quiz
          </button>

          <button
            className="bg-white shadow-md rounded-2xl p-8 text-xl font-semibold hover:shadow-xl transition"
            onClick={() => router.push(`/modules/${id}/test`)}
          >
            <img src="/images/img4.png" />
            Test
          </button>
        </div>
        
        <div>
          <button
            className="mt-8 text-blue-500 underline"
            onClick={() => router.push("/main")}
          >
            Back to Modules
          </button>
        </div>
      </main>
    </>
  );
}
