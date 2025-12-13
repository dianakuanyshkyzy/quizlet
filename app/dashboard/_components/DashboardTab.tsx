"use client";

import ModuleCard from "@/components/ModuleCard";
import ModuleListItem from "@/components/ModuleListItem";
import AddModuleModal from "@/components/AddModuleModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Module as ModuleType } from "@/lib/api";

type Props = {
  recentModules: ModuleType[];
  filteredModules: ModuleType[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showModal: boolean;
  setShowModal: (v: boolean) => void;
  onModuleClick: (m: ModuleType) => void;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    data: { title: string; description: string; isPrivate: boolean }
  ) => void;
};

export default function DashboardTab({
  recentModules,
  filteredModules,
  searchQuery,
  setSearchQuery,
  showModal,
  setShowModal,
  onModuleClick,
  onDelete,
  onUpdate,
}: Props) {
  return (
    <main>
      <h2 className="text-2xl text-[#4255FF] font-bold mb-4">Recent Modules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {recentModules.map((m: ModuleType) => (
          <ModuleCard key={m.id} module={m} onClick={onModuleClick} />
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
        {filteredModules.map((m: ModuleType) => (
          <ModuleListItem
            key={m.id}
            module={m}
            onClick={onModuleClick}
            onDelete={onDelete}
            onUpdate={onUpdate}
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
  );
}
