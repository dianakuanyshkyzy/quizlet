"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, ArrowLeft, Edit2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function LearnPageClient({ id }: { id: string }) {
  const [moduleData, setModuleData] = useState<any | null>(null);
  const [termsList, setTermsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addingNew, setAddingNew] = useState(false);
  const [newTerm, setNewTerm] = useState("");
  const [newDef, setNewDef] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTermValue, setEditTermValue] = useState("");
  const [editDefValue, setEditDefValue] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(
          `https://imba-server.up.railway.app/modules/${id}`,
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

  async function submitNewTerm() {
    if (!newTerm.trim() || !newDef.trim()) return;

    const res = await fetch(`https://imba-server.up.railway.app/terms`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        term: newTerm,
        definition: newDef,
        moduleId: id,
        isStarred: false,
      }),
    });

    if (!res.ok) return;

    const created = await res.json();

    setTermsList((prev) => [...prev, created.data]);
    setNewTerm("");
    setNewDef("");
    setAddingNew(false);
  }
  async function deleteTerm(termId: string) {
    await fetch(`https://imba-server.up.railway.app/terms/${termId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setTermsList((prev) => prev.filter((t) => t.id !== termId));
    setOpenDropdownId(null);
  }
  function startEditing(term: any) {
    setEditingId(term.id);
    setEditTermValue(term.term);
    setEditDefValue(term.definition);
  }

  async function submitEdit(termId: string) {
    const res = await fetch(
      `https://imba-server.up.railway.app/terms/${termId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term: editTermValue,
          definition: editDefValue,
        }),
      }
    );

    if (!res.ok) return;

    setTermsList((prev) =>
      prev.map((t) =>
        t.id === termId
          ? { ...t, term: editTermValue, definition: editDefValue }
          : t
      )
    );

    setEditingId(null);
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 relative p-8 pb-20">
      <div className="w-full max-w-4xl mb-8">
        {loading ? (
          <div className="space-y-1">
            <Skeleton className="h-10 w-1/3 bg-gray-200 mb-3" />
            <Skeleton className="h-5 w-1/4 bg-gray-200" />
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-700 rounded-2xl">{error}</div>
        ) : moduleData?.data ? (
          <div className="rounded-2xl">
            <h1 className="text-4xl font-bold text-[#4255FF]">
              {moduleData.data.title}
            </h1>
            <p className="mt-2 text-gray-600">{moduleData.data.description}</p>
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
            <Card
              key={t.id}
              className="bg-white rounded-2xl h-16 w-full flex p-4 items-center flex-row"
            >
              <div
                className={`size-4 rounded-full ${
                  t.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : t.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              ></div>

              <div className="flex-1 ml-4">
                {editingId === t.id ? (
                  <div className="flex gap-4 items-center">
                    <input
                      className="p-2  rounded-lg flex-1"
                      value={editTermValue}
                      onChange={(e) => setEditTermValue(e.target.value)}
                    />
                    <input
                      className="p-2  rounded-lg flex-1"
                      value={editDefValue}
                      onChange={(e) => setEditDefValue(e.target.value)}
                    />

                    <button
                      onClick={() => submitEdit(t.id)}
                      className="px-5 py-2 bg-blue-500 text-white rounded-xl text-sm"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="font-semibold text-lg">{t.term}</div>
                      <div className="w-1 bg-gray-300 rounded-full"></div>
                      <div className="font-semibold text-lg">
                        {t.definition.slice(0, 40)}
                        {t.definition.length > 30 ? "..." : ""}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {/* <Button
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === t.id ? null : t.id
                            )
                          }
                          className="px-5 py-2 bg-[#4255FF] hover:bg-[#3241c2] cursor-pointer rounded-xl text-sm"
                          size={"sm"}
                        > */}
                        <Edit2
                          className="text-gray-500 cursor-pointer hover:scale-110 transition size-5"
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === t.id ? null : t.id
                            )
                          }
                        />
                        {/* </Button> */}

                        {openDropdownId === t.id && (
                          <div className="p-2 absolute right-0 top-full mt-2 bg-white border rounded shadow-md flex flex-col w-28 z-10">
                            <button
                              onClick={() => startEditing(t)}
                              className="p-2 hover:bg-gray-100 text-left"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTerm(t.id)}
                              className="p-2 hover:bg-gray-100 text-left text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      <button onClick={() => toggleStar(t)}>
                        {t.isStarred ? (
                          <Star
                            className="text-yellow-500 size-5 cursor-pointer hover:scale-110 transition"
                            fill="currentColor"
                          />
                        ) : (
                          <Star className="text-gray-400 size-5 cursor-pointer hover:scale-110 transition" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {addingNew ? (
          <div className="bg-white rounded-2xl shadow-md w-full p-4 mt-4 flex gap-4 items-center">
            <input
              placeholder="Term"
              className="p-2  rounded-lg flex-1"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
            />
            <input
              placeholder="Definition"
              className="p-2  rounded-lg flex-1"
              value={newDef}
              onChange={(e) => setNewDef(e.target.value)}
            />

            <button
              onClick={submitNewTerm}
              className="px-6 py-2 bg-green-500 text-white rounded-xl text-sm"
            >
              Submit
            </button>
          </div>
        ) : (
          <Card
            className="rounded-2xl h-16 w-full mt-4 flex justify-center items-center font-semibold cursor-pointer"
            onClick={() => setAddingNew(true)}
          >
            Add New Term
          </Card>
        )}
      </div>

      <div className="w-full fixed bottom-0 left-0 bg-gray-200 shadow-md py-4">
        <button
          onClick={() => router.push("/main")}
          className="ml-8 text-black flex items-center gap-2 text-lg"
        >
          <ArrowLeft size={20} /> Back to modules
        </button>
      </div>
    </main>
  );
}
