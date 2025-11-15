import { Module } from "./ModuleCard";

type Props = {
  module: Module;
  onClose: () => void;
  onStartLearning: () => void;
};

export default function ModuleDetailModal({ module, onClose, onStartLearning }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">{module.name}</h2>
        <p className="text-gray-600 mb-4">{module.description}</p>

        <h3 className="font-semibold mb-2">Words</h3>
        <div className="space-y-2">
          {module.words.map((w, idx) => (
            <div key={idx} className="flex justify-between border-b pb-1">
              <span>{w.term}</span>
              <span className="text-gray-500">{w.translation}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onStartLearning}
            className="bg-[#4255FF] text-white px-4 py-2 rounded-lg"
          >
            Start Learning
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
