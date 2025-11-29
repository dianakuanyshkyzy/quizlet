"use client";

import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LearnPageClient({ id }: { id: string }) {
  const [moduleData, setModuleData] = useState<any | null>(null);
  const [termsData, setTermsData] = useState<any | null>(null);
  const [termsList, setTermsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(
          `https://imba-server.up.railway.app/modules/${id}`,
          {
            credentials: "include",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setModuleData(data);
      } catch (err: any) {
        if (mounted) setError(err.message ?? "Failed to load module");
      } finally {
        if (mounted) setLoading(false);
      }

      const terms = await fetch(
        `https://imba-server.up.railway.app/terms?moduleId=${id}`,
        {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (terms.ok) {
        const termsDataRes = await terms.json();
        if (mounted) {
          setTermsData(termsDataRes);
          // normalize local list for UI interactions
          const list = termsDataRes?.data?.data || [];
          setTermsList(list);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const router = useRouter();

  function toggleStar(termId: string) {
    setTermsList((prev) =>
      prev.map((t) => (t.id === termId ? { ...t, isStarred: !t.isStarred } : t))
    );
  }

  function cycleStatus(termId: string) {
    setTermsList((prev) =>
      prev.map((t) => {
        if (t.id !== termId) return t;
        const order = ["not_started", "in_progress", "completed"];
        const idx = order.indexOf(t.status);
        const next = order[(idx + 1) % order.length];
        return { ...t, status: next };
      })
    );
  }

  function editTerm(termId: string) {
    const term = termsList.find((t) => t.id === termId);
    if (!term) return;
    const newTerm = prompt("Edit term", term.term);
    if (newTerm === null) return; // cancelled
    const newDef = prompt("Edit definition", term.definition);
    if (newDef === null) return;
    setTermsList((prev) =>
      prev.map((t) =>
        t.id === termId ? { ...t, term: newTerm, definition: newDef } : t
      )
    );
  }

  return (
    <>
      <Header />

      <main className="flex flex-col items-center justify-start min-h-screen p-8 bg-gray-50">
        <div className="w-full max-w-4xl mb-8">
          {loading ? (
            <div className="rounded-2xl">Loading module…</div>
          ) : error ? (
            <div className="p-6 bg-red-50 text-red-700 rounded-2xl">
              {error}
            </div>
          ) : moduleData && moduleData.data ? (
            <div className="rounded-2xl">
              <h1 className="text-4xl font-bold text-[#4255FF]">
                {moduleData.data.title}
              </h1>
              <p className="mt-2 text-gray-600">
                {moduleData.data.description}
              </p>
            </div>
          ) : (
            <div className="p-6 bg-yellow-50 text-yellow-800 rounded-2xl">
              Module not found
            </div>
          )}
        </div>

        <hr className="w-full max-w-4xl mb-8 border-gray-300" />

        <h2 className="text-2xl font-semibold mb-6">Choose your mode</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <button
            className="bg-white shadow-md rounded-2xl p-5 text-xl font-semibold hover:shadow-xl transition flex flex-col items-center"
            onClick={() => router.push(`/modules/${id}/flashcards`)}
          >
            <Image
              src="/images/img3.png"
              width={150}
              height={150}
              alt="Flashcards"
            />
            Flashcards
          </button>

          <button
            className="bg-white shadow-md rounded-2xl p-5 text-xl font-semibold hover:shadow-xl transition flex flex-col items-center"
            onClick={() => router.push(`/modules/${id}/quiz`)}
          >
            <Image src="/images/img1.png" width={150} height={150} alt="Quiz" />
            Quiz
          </button>

          <button
            className="bg-white shadow-md rounded-2xl p-5 text-xl font-semibold hover:shadow-xl transition flex flex-col items-center"
            onClick={() => router.push(`/modules/${id}/test`)}
          >
            <Image src="/images/img4.png" width={150} height={150} alt="Test" />
            Test
          </button>
        </div>

        {/* Terms list */}
        <div className="w-full max-w-4xl mt-10">
          <h3 className="text-2xl font-semibold mb-4">Terms</h3>
          {termsList.length === 0 ? (
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              No terms yet.
            </div>
          ) : (
            <div className="space-y-4">
              {termsList.map((t) => (
                <div
                  key={t.id}
                  className=" bg-white rounded-2xl shadow-md h-16 w-full flex"
                >
                  <div
                    className={`w-3 h-full rounded-full ${
                      t.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : t.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  ></div>

                  <div className="flex-1 p-4 flex flex-row ">
                    <div className="flex-1">
                      <div className="flex justify-start gap-5">
                        <div className="font-semibold text-lg w-1/4">
                          {t.term}
                        </div>
                        <div className="bg-gray-300 w-1 h-6 rounded-full"></div>
                        <div className="font-semibold text-lg">
                          {t.definition}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6 flex items-center gap-3">
                      <button
                        onClick={() => editTerm(t.id)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-2xl text-sm"
                      >
                        Edit
                      </button>

                      <button
                        aria-label={t.isStarred ? "Unstar" : "Star"}
                        onClick={() => toggleStar(t.id)}
                        className="text-2xl"
                      >
                        {t.isStarred ? "★" : "☆"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className=" bg-white rounded-2xl shadow-md h-16 w-full flex justify-center items-center font-semibold cursor-pointer">
                Add New Term
              </div>
            </div>
          )}
        </div>
        <div>
          <button
            className="mt-8 bg-white p-5 rounded-2xl shadow-md"
            onClick={() => router.push("/main")}
          >
            Back to Modules
          </button>
        </div>
      </main>
    </>
  );
}
