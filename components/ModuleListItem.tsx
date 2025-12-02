"use client";

import { useState } from "react";
import { Trash2, Edit2 } from "lucide-react";

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
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: { title: string; description: string; isPrivate: boolean }) => void;
};

export default function ModuleListItem({ module, onClick, onDelete, onUpdate }: ModuleListItemProps) {
  const [confirming, setConfirming] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: module.title,
    description: module.description,
    isPrivate: module.isPrivate,
  });

  return (
    <div className="w-full  rounded-2xl h-16 bg-white rounded-xl shadow-md p-4 transition mb-4 hover:shadow-xl cursor-pointer transition w-full"> 
      <div className="flex items-center justify-between">
        <div
          className="cursor-pointer hover:underline"
          onClick={() => onClick(module)}
        >
          {module.title}
        </div>


        <div className="flex gap-4">
          <Edit2
            className="text-gray-500 cursor-pointer hover:scale-110 transition"
            size={20}
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
          />
          
        <Trash2
          className="text-gray-500 cursor-pointer hover:scale-110 transition"
          size={20}
          onClick={(e) => {
            e.stopPropagation(); 
            setConfirming(true);
          }}
        />
      </div>
      
      </div>

      {confirming && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[320px] shadow-lg">
            <h2 className="text-lg font-semibold mb-3">
              Are you sure you want to delete this module?
            </h2>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border"
                onClick={() => setConfirming(false)}
              >
                No
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white"
                onClick={() => {
                  onDelete(module.id);
                  setConfirming(false);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
            {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[360px] shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Edit Module</h2>

            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full mb-2 p-2 border rounded"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={form.isPrivate}
                onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })}
              />
              Private
            </label>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                onClick={() => {
                  onUpdate(module.id, form);
                  setEditing(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
  )}
    </div>
  );
}
