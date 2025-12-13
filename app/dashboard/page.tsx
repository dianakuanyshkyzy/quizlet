"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardTab from "./_components/DashboardTab";
import CommunityTab from "./_components/CommunityTab";

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
  const [communitySearch, setCommunitySearch] = useState("");
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
  } = useCommunityModules(communitySearch);

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
          <DashboardTab
            recentModules={recentModules as ModuleType[]}
            filteredModules={filteredModules as ModuleType[]}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showModal={showModal}
            setShowModal={setShowModal}
            onModuleClick={handleModuleClick}
            onDelete={handleDeleteModule}
            onUpdate={handleUpdateModule}
          />
        </TabsContent>
        <TabsContent value="community" className="min-w-[1260px] mx-auto">
          <CommunityTab
            communityModules={communityModules as CommunityModuleType[]}
            onSearch={(q: string) => setCommunitySearch(q)}
            onViewModule={(id: string) => router.push(`/modules/${id}`)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
