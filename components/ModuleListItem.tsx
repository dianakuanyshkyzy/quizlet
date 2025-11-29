type Module = {
  id: string;
  slug: string;
  title: string;
  description: string;
  isPrivate: boolean;
  userId: string;
};


type ModuleListItemProps = {
  module: Module;
  onClick: (module: Module) => void;
};

export default function ModuleListItem({ module, onClick }: ModuleListItemProps) {
  return (
    <div
      className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition mb-4"
      onClick={() => onClick(module)}
    >
      {module.title}
    </div>
  );
}
