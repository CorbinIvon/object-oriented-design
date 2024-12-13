import type { ObjectDetails } from "./types";

interface ViewObjectProps {
  object: ObjectDetails;
  onEdit: () => void;
  onEditAttributes: () => void;
}

export default function ViewObject({
  object,
  onEdit,
  onEditAttributes,
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
          <p>Created by: {object.creator.username}</p>
          <p>{object.description}</p>
        </div>
      </section>

      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-green-500">{"> "} Attributes</h2>
          <button
            onClick={onEditAttributes}
            className="px-3 py-1 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black transition-colors"
          >
            Edit Attributes
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-800">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Default</th>
              <th className="text-left p-2">Nullable</th>
              <th className="text-left p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {object.attributes.map((attr) => (
              <tr key={attr.id} className="border-b border-gray-800/50">
                <td className="p-2">
                  <span className="text-yellow-500">{attr.name}</span>
                </td>
                <td className="p-2">
                  <span className="text-gray-500">{attr.type}</span>
                </td>
                <td className="p-2">
                  {attr.defaultValue && (
                    <span className="text-gray-500">{attr.defaultValue}</span>
                  )}
                </td>
                <td className="p-2">
                  {!attr.required ? (
                    <span className="text-blue-500 text-sm">yes</span>
                  ) : (
                    <span className="text-red-500 text-sm">no</span>
                  )}
                </td>
                <td className="p-2">
                  <span className="text-gray-400">{attr.description}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <h2 className="text-green-500 mb-4">{"> "} Methods</h2>
        <div className="ml-4 space-y-2">
          {object.methods.map((method) => (
            <div key={method.id} className="text-gray-300">
              <span className="text-blue-500">{method.name}</span>
              <span className="text-gray-500">(): {method.returnType}</span>
              {method.description && (
                <p className="text-gray-400 ml-4">{method.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
