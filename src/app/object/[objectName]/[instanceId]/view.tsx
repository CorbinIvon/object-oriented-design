import type { ObjectDetails } from "./types";

interface ViewObjectProps {
  object: ObjectDetails;
  onEdit: () => void;
}

export default function ViewObject({ object, onEdit }: ViewObjectProps) {
  return (
    <div className="container mx-auto p-6 space-y-4">
      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <div className="flex justify-between items-center">
          <p className="text-green-500">
            {"> "} {object.name}: version {object.version}
          </p>
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="ml-4 text-gray-300">
          <p className="text-gray-400">
            created: {new Date(object.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-400 mb-4">
            updated: {new Date(object.updatedAt).toLocaleString()}
          </p>
          <p>{object.description}</p>
        </div>
      </section>

      {/* Rest of the sections (Attributes, Methods, Relationships) remain the same */}
    </div>
  );
}
