"use client";

import { useState } from "react";
import ModuleCard from "@/components/ModuleCard";
import ModuleListItem from "@/components/ModuleListItem";
import AddModuleModal from "@/components/AddModuleModal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useModules,
  useCommunityModules,
  useDeleteModule,
  useUpdateModule,
} from "@/lib/hooks/useModules";
import { toast } from "sonner";
import type {
  Module as ModuleType,
  CommunityModule as CommunityModuleType,
} from "@/lib/api";

export default function MainPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Queries
  const {
    data: modules = [],
    isLoading: modulesLoading,
    isError: modulesError,
  } = useModules();
  const {
    data: communityModules = [],
    isLoading: communityLoading,
    isError: communityError,
  } = useCommunityModules();

  // Mutations
  const deleteModule = useDeleteModule();
  const updateModule = useUpdateModule();

  const handleDeleteModule = (id: string) => {
    deleteModule.mutate(id);
  };

  const handleUpdateModule = (
    id: string,
    data: { title: string; description: string; isPrivate: boolean }
  ) => {
    updateModule.mutate({ id, data });
  };

  if (modulesLoading || communityLoading) {
    return (
      <main className="p-8 min-h-screen max-w-[860px] mx-auto">
        <p>Loading modules...</p>
      </main>
    );
  }

  if (modulesError || communityError) {
    toast.error("Failed to load modules");
  }

  const filteredModules = modules.filter((m: ModuleType) =>
    m.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModuleClick = (m: ModuleType) => {
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
              {recentModules.map((m: ModuleType) => (
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
              {filteredModules.map((m: ModuleType) => (
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
                {communityModules.map((m: CommunityModuleType) => (
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
