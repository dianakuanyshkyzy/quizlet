"use client";

import { useState, useEffect } from "react";
import ModuleCard from "@/components/ModuleCard";
import ModuleListItem from "@/components/ModuleListItem";
import AddModuleModal from "@/components/AddModuleModal";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  isPrivate: boolean;
  userId: string;
  isOwner: boolean;
  
}

interface CommunityModule extends Module {
  ownerName: string;
  ownerImg?: string;
  termsCount: number;
}

type CreateModule = {
  title: string;
  description: string;
  isPrivate: boolean;
};

export default function MainPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [communityModules, setCommunityModules] = useState<CommunityModule[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteModule = async (id: string) => {
    try {
      const res = await fetch(
        `https://imba-server.up.railway.app/v2/modules/${id}`,
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
      const res = await fetch(
        "https://imba-server.up.railway.app/v2/modules/collection",
        {
          credentials: "include",
        }
      );
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

  const loadCommunityModules = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://imba-server.up.railway.app/v2/modules/public",
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.ok && Array.isArray(data.data)) {
        setCommunityModules(data.data);
      } else {
        setCommunityModules([]);
      }
    } catch (err) {
      console.error("failed to load community modules", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
    loadCommunityModules();
  }, []);
  const handleUpdateModule = async (
    id: string,
    data: { title: string; description: string; isPrivate: boolean }
  ) => {
    try {
      const res = await fetch(
        `https://imba-server.up.railway.app/v2/modules/${id}`,
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
      const res = await fetch(
        "https://imba-server.up.railway.app/v2/modules/collection",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(moduleData),
        }
      );

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
    <div className="p-8 min-h-screen">
      <Tabs defaultValue="dashboard">
        <div className="flex justify-center mb-2">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="dashboard" className="max-w-[860px] mx-auto">
          <main>
            <h2 className="text-2xl text-[#4255FF] font-bold mb-4">
              Recent Modules
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {recentModules.map((m) => (
                <ModuleCard key={m.id} module={m} onClick={handleModuleClick} />
              ))}
            </div>

            <div className="mb-2">
              <h2 className="text-2xl text-[#4255FF] font-bold mb-2">
                All Modules
              </h2>

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
        </TabsContent>
        <TabsContent value="community" className="min-w-[1260px] mx-auto">
          <main>
            <div>
              <h2 className="text-2xl text-[#4255FF] font-bold mb-4 text-center">
                Community Modules
              </h2>
              <p className="text-center">
                Search and explore modules shared by the Imba Learn community!
              </p>
            </div>

            <div>
              <Input
                type="text"
                placeholder="Search community modules..."
                className="h-10 my-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {communityModules.map((m) => (
                  <Card key={m.id}>
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <span className="text-lg font-semibold">
                            {m.title}
                          </span>

                          <p className="text-muted-foreground text-sm">
                            {m.description}
                          </p>
                        </div>

                        <div>
                          <span className="bg-muted text-muted-foreground rounded-2xl px-3 py-1 text-sm">
                            {m.termsCount} terms
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-7">
                      <div className="flex flex-row items-center justify-between">
                        <div>
                          <p className="pb-2 text-sm text-gray-500">
                            Shared by:
                          </p>
                          <div className="flex gap-x-2 items-center">
                            <Avatar className="size-10 border border-gray-100">
                              <AvatarImage
                                src={
                                  "https://imba-server.up.railway.app" +
                                  m.ownerImg
                                }
                                alt={m.ownerName}
                                crossOrigin="anonymous"
                              />
                              <AvatarFallback>
                                {m.ownerName.charAt(0) + m.ownerName.charAt(1)}
                              </AvatarFallback>
                            </Avatar>
                            <p>{m.ownerName}</p>
                          </div>
                        </div>

                        <div>
                          <Button
                            size="sm"
                            className="mt-4"
                            onClick={() => router.push(`/modules/${m.id}`)}
                          >
                            View Module
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </TabsContent>
      </Tabs>
    </div>
  );
}
