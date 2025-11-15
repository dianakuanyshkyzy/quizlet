import { Module } from "./ModuleCard";
type ModuleCardProps = {
    module: Module;
    onClick: (module: Module) => void; 
  };
export default function ModuleListItem({ module, onClick }: ModuleCardProps) {
    return (
      <div className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition mb-4"
      onClick={() => onClick(module)}>
        {module.name}
      </div>
    );
  }
  