import type { ObjectDetails } from "./types";

interface ViewObjectProps {
  object: ObjectDetails;
  onEdit: () => void;
  onEditAttributes: () => void;
  onEditMethods: () => void;
}

export default function ViewObject({
  object,
  onEdit,
  onEditAttributes,
  onEditMethods,
}: ViewObjectProps) {
  return (
    <div className="container mx-auto p-6 space-y-4">
      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <div className="flex justify-between items-center">
          <p className="text-green-500">
            {"> "} {object.name}: version {object.version}
          </p>
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black"
          >
            Edit Description
          </button>
        </div>
        <div className="ml-4 text-gray-300">
          <p className="text-gray-400">
            created: {new Date(object.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-400">
            updated: {new Date(object.updatedAt).toLocaleString()}
          </p>
          <p className="mt-4">{object.description}</p>
        </div>
      </section>

      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-green-500">{"> "} Attributes</h2>
          <button
            onClick={onEditAttributes}
            className="px-3 py-1 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black"
          >
            Edit Attributes
          </button>
        </div>
        <div className="space-y-2">
          {(object.attributes || []).map((attr) => (
            <div
              key={attr.id}
              className="ml-4 p-2 border border-gray-800 rounded"
            >
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">{attr.name}</span>
                <span className="text-gray-500">{attr.type}</span>
                {attr.required && (
                  <span className="text-red-500 text-sm">required</span>
                )}
              </div>
              {attr.description && (
                <p className="text-gray-400 text-sm ml-2">{attr.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-green-500">{"> "} Methods</h2>
          <button
            onClick={onEditMethods}
            className="px-3 py-1 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black"
          >
            Edit Methods
          </button>
        </div>
        <div className="space-y-2">
          {(object.methods || []).map((method) => (
            <div
              key={method.id}
              className="ml-4 p-2 border border-gray-800 rounded"
            >
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">{method.name}</span>
                <span className="text-gray-500">
                  {method.returnType || "void"}
                </span>
                <span
                  className={`text-sm ${
                    method.visibility === "PUBLIC"
                      ? "text-green-500"
                      : method.visibility === "PRIVATE"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {method.visibility.toLowerCase()}
                </span>
              </div>
              {method.description && (
                <p className="text-gray-400 text-sm ml-2">
                  {method.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {((object.fromRelationships || []).length > 0 ||
        (object.toRelationships || []).length > 0) && (
        <section className="border border-gray-800 bg-black/50 p-4 rounded">
          <h2 className="text-green-500 mb-4">{"> "} Relationships</h2>
          <div className="space-y-2">
            {(object.fromRelationships || []).map((rel) => (
              <div
                key={rel.id}
                className="ml-4 p-2 border border-gray-800 rounded"
              >
                <span className="text-gray-400">
                  {object.name} → {rel.toObject.name}
                </span>
              </div>
            ))}
            {(object.toRelationships || []).map((rel) => (
              <div
                key={rel.id}
                className="ml-4 p-2 border border-gray-800 rounded"
              >
                <span className="text-gray-400">
                  {rel.fromObject.name} → {object.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
