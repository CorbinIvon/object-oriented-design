import { useState } from "react";
import type { ObjectDetails } from "./types";

interface EditObjectProps {
  object: ObjectDetails;
  onSave: (description: string) => void;
  onCancel: () => void;
}

export default function EditObject({
  object,
  onSave,
  onCancel,
}: EditObjectProps) {
  const [description, setDescription] = useState(object.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(description);
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <form onSubmit={handleSubmit}>
        <section className="border border-gray-800 bg-black/50 p-4 rounded">
          <div className="flex justify-between items-center">
            <p className="text-green-500">
              {"> "} {object.name}: version {object.version}
            </p>
          </div>
          <div className="ml-4 text-gray-300">
            <p className="text-gray-400">
              created: {new Date(object.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-400 mb-4">
              updated: {new Date(object.updatedAt).toLocaleString()}
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 bg-black/30 text-gray-300 border border-gray-700 rounded p-2 focus:border-green-500 focus:outline-none"
            />
          </div>
        </section>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
