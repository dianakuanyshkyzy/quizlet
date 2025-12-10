"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import TermItem from "./_components/TermItem";
import AddTerm from "./_components/AddTerm";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LearnPageClient({ id }: { id: string }) {
  const [moduleData, setModuleData] = useState<any | null>(null);
  const [termsList, setTermsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(
          `https://imba-server.up.railway.app/v2/modules/${id}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setModuleData(data);
      } catch (err) {
        if (err instanceof Error && mounted)
          console.error("module fetch error", err);
      }

      const terms = await fetch(
        `https://imba-server.up.railway.app/terms?moduleId=${id}`,
        { credentials: "include" }
      );
      if (terms.ok) {
        const t = await terms.json();
        if (mounted) {
          const list = t?.data?.data || [];
          setTermsList(list);
        }
      }

      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  async function toggleStar(term: any) {
    try {
      // send request to backend
      await fetch(`https://imba-server.up.railway.app/terms/${term.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isStarred: !term.isStarred,
        }),
      });

      // update UI
      setTermsList((prev) =>
        prev.map((t) =>
          t.id === term.id ? { ...t, isStarred: !t.isStarred } : t
        )
      );
    } catch (err) {
      console.error("star error", err);
    }
  }

  async function submitNewTerm(term: string, definition: string) {
    if (!term.trim() || !definition.trim()) return;

    const res = await fetch(`https://imba-server.up.railway.app/terms`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        term: term,
        definition: definition,
        moduleId: id,
        isStarred: false,
      }),
    });

    if (!res.ok) return;

    const created = await res.json();

    setTermsList((prev) => [...prev, created.data]);
  }
  async function deleteTerm(termId: string) {
    await fetch(`https://imba-server.up.railway.app/terms/${termId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setTermsList((prev) => prev.filter((t) => t.id !== termId));
  }

  async function submitEdit(termId: string, term: string, definition: string) {
    const res = await fetch(
      `https://imba-server.up.railway.app/terms/${termId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term: term,
          definition: definition,
        }),
      }
    );

    if (!res.ok) return;

    setTermsList((prev) =>
      prev.map((t) =>
        t.id === termId ? { ...t, term: term, definition: definition } : t
      )
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 relative p-8 pb-20">
      <div className="w-full max-w-4xl mb-8">
        {loading ? (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-10 w-52 bg-gray-200 mb-3" />
                <Skeleton className="h-5 w-72 bg-gray-200" />
              </div>
              <div className="flex gap-x-4 items-center">
                <Skeleton className="size-10 rounded-full bg-gray-200 mt-4" />
                <Skeleton className="h-5 w-24 bg-gray-200 mt-4" />
              </div>
            </div>
            <div className="space-y-4 my-10">
              <div className="flex gap-x-4">
                <Skeleton className="h-5 w-30 bg-gray-200" />
                <Skeleton className="h-5 w-30 bg-gray-200" />
                <Skeleton className="h-5 w-30 bg-gray-200" />
              </div>

              <Skeleton className="h-5 w-full bg-gray-200 " />
            </div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-700 rounded-2xl">{error}</div>
        ) : moduleData?.data ? (
          <div>
            <div className="rounded-2xl flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-[#4255FF]">
                  {moduleData.data.title}
                </h1>
                <p className="my-4 text-gray-600">
                  {moduleData.data.description}
                </p>
              </div>

              {/* <div>{JSON.stringify(moduleData.data)}</div> */}

              <div>
                <p className="text-sm text-gray-500 mb-1">Created by:</p>
                <div className="flex gap-x-2 items-center">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={
                        "https://imba-server.up.railway.app" +
                        moduleData.data.ownerImg
                      }
                      alt={moduleData.data.ownerName}
                      crossOrigin="anonymous"
                    />
                    <AvatarFallback>
                      {moduleData.data.ownerName[0] +
                        moduleData.data.ownerName[1]}
                    </AvatarFallback>
                  </Avatar>
                  <p>{moduleData.data.ownerName}</p>
                </div>
              </div>
            </div>
            <div className="">
              {moduleData.data.progress && (
                <div className="mt-4">
                  <div className="flex gap-4 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span className="text-gray-600">
                        Not Started:{" "}
                        {Math.round(moduleData.data.progress.not_started * 100)}
                        %
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span className="text-gray-600">
                        In Progress:{" "}
                        {Math.round(moduleData.data.progress.in_progress * 100)}
                        %
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-gray-600">
                        Completed:{" "}
                        {Math.round(moduleData.data.progress.completed * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
                    {moduleData.data.progress.not_started > 0 && (
                      <div
                        className="bg-gray-300 h-full"
                        style={{
                          width: `${
                            moduleData.data.progress.not_started * 100
                          }%`,
                        }}
                      ></div>
                    )}
                    {moduleData.data.progress.in_progress > 0 && (
                      <div
                        className="bg-yellow-400 h-full"
                        style={{
                          width: `${
                            moduleData.data.progress.in_progress * 100
                          }%`,
                        }}
                      ></div>
                    )}
                    {moduleData.data.progress.completed > 0 && (
                      <div
                        className="bg-green-500 h-full"
                        style={{
                          width: `${moduleData.data.progress.completed * 100}%`,
                        }}
                      ></div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
        <Link href={`/modules/${id}/flashcards`}>
          <Card className="bg-white rounded-2xl p-5 text-xl font-semibold hover:shadow-md flex flex-col items-center cursor-pointer">
            <Image
              src="/images/img3.png"
              width={150}
              height={150}
              alt="Flashcards"
            />
            Flashcards
          </Card>
        </Link>

        <Link href={`/modules/${id}/quiz`}>
          <Card className="bg-white rounded-2xl p-5 text-xl font-semibold hover:shadow-md flex flex-col items-center cursor-pointer">
            <Image src="/images/img1.png" width={150} height={150} alt="Quiz" />
            Quiz
          </Card>
        </Link>

        <Link href={`/modules/${id}/test`}>
          <Card className="bg-white rounded-2xl p-5 text-xl font-semibold hover:shadow-md flex flex-col items-center cursor-pointer">
            <Image src="/images/img4.png" width={150} height={150} alt="Test" />
            Test
          </Card>
        </Link>
      </div>

      <div className="w-full max-w-4xl mt-10">
        <h3 className="text-2xl font-semibold mb-4">Terms</h3>

        <div className="space-y-3">
          {termsList.map((t) => (
            <TermItem
              key={t.id}
              term={t}
              onDelete={() => deleteTerm(t.id)}
              onToggleStar={() => toggleStar(t)}
              onSaveEdit={submitEdit}
            />
          ))}
        </div>

        <AddTerm onSubmit={submitNewTerm} />
      </div>

      <Link href="/dashboard" className="mt-10">
        <span className="flex items-center gap-x-2 hover:underline underline-offset-4 hover:text-[#4255FF] transition">
          <ArrowLeft size={20} /> Back to modules
        </span>
      </Link>
    </main>
  );
}
