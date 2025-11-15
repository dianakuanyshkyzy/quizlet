"use client";

import { useState } from "react";
import ModuleCard from "@/components/ModuleCard";
import ModuleListItem from "@/components/ModuleListItem";
import AddModuleModal from "@/components/AddModuleModal";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import ModuleDetailModal from "@/components/ModuleDetailModal";
import { mockModules } from "@/data/mockModules";
type Word = { term: string; translation: string };
type Module = { id: number; name: string; description: string; words: Word[] };

export default function MainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  

  const [modules, setModules] = useState<Module[]>(mockModules);
const filteredModules = modules.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const [showModal, setShowModal] = useState(false);

  const handleAddModule = (newModule: Module | null) => {
    if (newModule) setModules([newModule, ...modules]);
    setShowModal(false);
  };

  const recentModules = modules.slice(0, 4);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const router = useRouter();

 
  return (
    <>
    <Header />
    <main className="p-8 min-h-screen max-w-[860px] mx-auto px-4">
      <h2 className="text-2xl text-[#4255FF] font-bold mb-4">Recent Modules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {recentModules.map((m) => (
            <ModuleCard key={m.id} module={m} onClick={setSelectedModule} />        
            ))}
        
      </div>

      <div className="mb-2">
      <h2 className="text-2xl text-[#4255FF] font-bold mb-2">All Modules</h2>
      <div className="flex gap-4 mb-4 items-center">
    
    <button
      className="bg-white border border-gray-400 text-gray-400 w-15 h-10 rounded-lg text-2xl flex items-center justify-center hover:scale-105 transition-transform"
      onClick={() => setShowModal(true)}
    >
      +
    </button>
    <input
      type="text"
      placeholder="Search modules..."
      className="flex-1 p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4255FF]"
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    </div>
      </div>
{/*intead of bg-white rounded-xl shadow p-2 max-h-[300px] overflow-y-auto*/}
      <div className="flex flex-col">
        {filteredModules.map((m) => (
        <ModuleListItem key={m.id} module={m} onClick={setSelectedModule} />
    ))}
    </div>


      {showModal && <AddModuleModal onAdd={handleAddModule} />}
      {selectedModule && (
    <ModuleDetailModal
      module={selectedModule}
      onClose={() => setSelectedModule(null)}
      onStartLearning={() => router.push(`/modules/${selectedModule.id}/learn`)}
    />
  )}
    </main>
    </>
  );
}
