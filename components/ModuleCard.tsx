import React from "react";

type Word = {
  term: string;
  translation: string;
};

type Module = {
  id: number;
  name: string;
  description: string;
  words: Word[];
};

type ModuleCardProps = {
  module: Module;
  onClick: (module: Module) => void; 
};

export default function ModuleCard({ module, onClick }: ModuleCardProps) {
  return (
    <div
      className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl cursor-pointer transition h-32 w-full"
      onClick={() => onClick(module)}
    >
      <h3 className="font-bold text-lg">{module.name}</h3>
      <p className="text-gray-500 text-sm">{module.words.length} words</p>
    </div>
  );
}

export type { Module };
