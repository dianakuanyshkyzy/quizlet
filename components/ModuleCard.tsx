import React from "react";
 type Module = {
  id: string;
  slug: string;
  title: string;
  description: string;
  isPrivate: boolean;
  userId: string;
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
      <h3 className="font-bold text-lg">{module.title}</h3>
      <p className="text-gray-500 text-sm">{module.description}</p>
    </div>
  );
}

export type { Module };
