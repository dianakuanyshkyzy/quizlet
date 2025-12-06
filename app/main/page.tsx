"use client";

import { useState, useEffect } from "react";
import ModuleCard from "@/components/ModuleCard";
import ModuleListItem from "@/components/ModuleListItem";
import AddModuleModal from "@/components/AddModuleModal";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Module = {
  id: string;
  slug: string;
  title: string;
  description: string;
  isPrivate: boolean;
  userId: string;
};

type CreateModule = {
  title: string;
  description: string;
  isPrivate: boolean;
};

export default function MainPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteModule = async (id: string) => {
    try {
      const res = await fetch(
        `https://imba-server.up.railway.app/modules/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        console.error("delete failed", data);
        return;
      }

      setModules((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("delete error", err);
    }
  };

  const loadModules = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://imba-server.up.railway.app/modules", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.data)) {
        setModules(data.data);
      } else {
        setModules([]);
      }
    } catch (err) {
      console.error("failed to load modules", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);
  const handleUpdateModule = async (
    id: string,
    data: { title: string; description: string; isPrivate: boolean }
  ) => {
    try {
      const res = await fetch(
        `https://imba-server.up.railway.app/modules/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();
      if (!res.ok || !result.ok) {
        console.error("update failed", result);
        return;
      }

      setModules((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...data } : m))
      );
    } catch (err) {
      console.error("update error", err);
    }
  };

  const handleAddModule = async (moduleData: CreateModule | null) => {
    if (!moduleData) {
      setShowModal(false);
      return;
    }

    try {
      const res = await fetch("https://imba-server.up.railway.app/modules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(moduleData),
      });

      const result = await res.json();
      if (!res.ok || !result.ok) {
        console.error("module creation error", result);
        return;
      }

      console.log("CREATED MODULE:", result.data.id);
      setModules((prev) => [result.data, ...prev]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="p-8 min-h-screen max-w-[860px] mx-auto">
        <p>Loading modules...</p>
      </main>
    );
  }

  const filteredModules = modules.filter((m) =>
    m.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModuleClick = (m: Module) => {
    router.push(`/modules/${m.id}`);
  };

  const recentModules = modules.slice(0, 4);

  return (
    <main className="p-8 min-h-screen max-w-[860px] mx-auto">
      <h2 className="text-2xl text-[#4255FF] font-bold mb-4">Recent Modules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {recentModules.map((m) => (
          <ModuleCard key={m.id} module={m} onClick={handleModuleClick} />
        ))}
      </div>

      <div className="mb-2">
        <h2 className="text-2xl text-[#4255FF] font-bold mb-2">All Modules</h2>

        <div className="flex gap-4 mb-4 items-center">
          <Button
            className="w-15 h-10 rounded-lg text-2xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
            variant={"outline"}
            onClick={() => setShowModal(true)}
          >
            +
          </Button>
          <Input
            type="text"
            placeholder="Search modules..."
            className="h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col font-semibold text-lg">
        {filteredModules.map((m) => (
          <ModuleListItem
            key={m.id}
            module={m}
            onClick={handleModuleClick}
            onDelete={handleDeleteModule}
            onUpdate={handleUpdateModule}
          />
        ))}
      </div>

      {showModal && (
        <AddModuleModal
          onAdd={() => {
            setShowModal(false);
            loadModules();
          }}
        />
      )}
    </main>
  );
}
