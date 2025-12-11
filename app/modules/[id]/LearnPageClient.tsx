"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import TermItem from "./_components/TermItem";
import AddTerm from "./_components/AddTerm";
import { Button } from "@/components/ui/button";
import ModuleHeader from "./_components/ModuleHeader";
import type { ApiTerm, ModuleResponse, Term } from "./types";

export default function LearnPageClient({ id }: { id: string }) {
  const [moduleData, setModuleData] = useState<ModuleResponse | null>(null);
  const [termsList, setTermsList] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(
          `https://imba-server.up.railway.app/v2/modules/${id}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ModuleResponse = await res.json();
        if (mounted) setModuleData(data);
      } catch (err) {
        if (err instanceof Error && mounted) {
          console.error("module fetch error", err);
          setError(err.message);
        }
      }

      const terms = await fetch(
        `https://imba-server.up.railway.app/terms?moduleId=${id}`,
        { credentials: "include" }
      );
      if (terms.ok) {
        const t = await terms.json();
        if (mounted) {
  const list: Term[] = await Promise.all(
    (t?.data?.data || []).map(async (item: ApiTerm) => {
      let status: string = "not_started"; // default
      try {
        const progressRes = await fetch(
          `https://imba-server.up.railway.app/v2/terms/${item.id}/progress`,
          { credentials: "include" }
        );
        const progressData = await progressRes.json();
        status = progressData?.data?.status ?? "not_started";
      } catch {
        status = "not_started";
      }

      return {
        ...item,
        isStarred: !!item.isStarred,
        status,
      };
    })
  );

  setTermsList(list);
}

      }

      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  async function toggleStar(term: Term) {
    try {
      await fetch(`https://imba-server.up.railway.app/terms/${term.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isStarred: !term.isStarred,
        }),
      });

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

    setTermsList((prev) => [
      ...prev,
      { ...created.data, isStarred: !!created.data?.isStarred },
    ]);
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

  async function collectModule(moduleId: string) {
    try {
      const res = await fetch(
        `https://imba-server.up.railway.app/v2/modules/${moduleId}/collect`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const payload: ModuleResponse | null = await res.json();

      if (payload?.data) {
        setModuleData(payload);
      } else {
        setModuleData((prev: ModuleResponse | null) =>
          prev?.data
            ? { ...prev, data: { ...prev.data, isCollected: true } }
            : prev
        );
      }
    } catch (err) {
      console.error("collect module error", err);
    }
  }

  const moduleInfo = moduleData?.data;

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
        ) : moduleInfo ? (
          <ModuleHeader module={moduleInfo} />
        ) : (
          <div className="p-6 bg-yellow-50 text-yellow-800 rounded-2xl">
            Module not found
          </div>
        )}
      </div>

      <hr className="w-full max-w-4xl mb-8 border-gray-300" />

      {loading ? (
        <div className="w-full max-w-4xl space-y-4 flex flex-col items-center">
          <Skeleton className="w-1/4 h-10 bg-gray-200 mb-3" />
          <Skeleton className="w-full h-40 bg-gray-200 mb-3" />
        </div>
      ) : moduleInfo?.isCollected ? (
        <>
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
                <Image
                  src="/images/img1.png"
                  width={150}
                  height={150}
                  alt="Quiz"
                />
                Quiz
              </Card>
            </Link>

            <Link href={`/modules/${id}/test`}>
              <Card className="bg-white rounded-2xl p-5 text-xl font-semibold hover:shadow-md flex flex-col items-center cursor-pointer">
                <Image
                  src="/images/img4.png"
                  width={150}
                  height={150}
                  alt="Test"
                />
                Test
              </Card>
            </Link>
          </div>
        </>
      ) : (
        <Card className="bg-yellow-50 text-yellow-800 w-full max-w-4xl">
          <CardHeader className="text-lg font-semibold">
            Module not collected
          </CardHeader>
          <CardContent>
            You need to collect this module to start learning. Go back to the
            dashboard and collect it first.
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => collectModule(id)}
            >
              Add to Collected Modules
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="w-full max-w-4xl mt-10">
        {loading ? (
          <div>
            <Skeleton className="h-10 w-48 bg-gray-200 mb-4 rounded-xl" />
            <Skeleton className="h-16 w-full bg-gray-200 mb-4 rounded-xl" />
            <Skeleton className="h-16 w-full bg-gray-200 mb-4 rounded-xl" />
            <Skeleton className="h-16 w-full bg-gray-200 mb-4 rounded-xl" />
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-semibold mb-4">Terms</h3>
            <div className="space-y-3">
              {termsList.map((t) => (
                <TermItem
                  isOwned={!!moduleData?.data?.isOwner}
                  isCollected={!!moduleData?.data?.isCollected}
                  key={t.id}
                  term={t}
                  onDelete={() => deleteTerm(t.id)}
                  onToggleStar={() => toggleStar(t)}
                  onSaveEdit={submitEdit}
                />
              ))}
            </div>
          </>
        )}

        {moduleInfo?.isOwner && <AddTerm onSubmit={submitNewTerm} />}
      </div>

      <Link href="/dashboard" className="mt-10">
        <span className="flex items-center gap-x-2 hover:underline underline-offset-4 hover:text-[#4255FF] transition">
          <ArrowLeft size={20} /> Back to dashboard
        </span>
      </Link>
    </main>
  );
}
