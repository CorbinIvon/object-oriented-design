import type { ObjectDetails } from "./types";
import type { ObjectMethod, MethodParameter } from "@prisma/client";

interface ObjectMethodWithParams extends ObjectMethod {
  parameters: MethodParameter[];
}

interface ExtendedObjectDetails extends Omit<ObjectDetails, "methods"> {
  methods: ObjectMethodWithParams[];
}

interface ViewObjectProps {
  object: ExtendedObjectDetails;
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
  const currentUserId = localStorage.getItem("userId");
  const isOwner = currentUserId === object.creator.id;

  return (
    <div className="container mx-auto p-6 space-y-4">
      {/* Description Section */}
      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <div className="flex justify-between items-center">
          <p className="text-green-500">
            {"> "} {object.name}: version {object.version}
          </p>
          {isOwner && (
            <button
              onClick={onEdit}
              className="px-3 py-1 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black transition-colors"
            >
              Edit
            </button>
          )}
        </div>
        <div className="ml-4 text-gray-300">
          <p className="text-gray-400">
            created: {new Date(object.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-400 mb-4">
            updated: {new Date(object.updatedAt).toLocaleString()}
          </p>
          <p>Created by: {object.creator.username}</p>
          {/* <p className="text-gray-500">Creator ID: {object.creator.id}</p> */}
          <p>{object.description}</p>
        </div>
      </section>

      {/* Attributes Section */}
      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-green-500">{"> "} Attributes</h2>
          {isOwner && (
            <button
              onClick={onEditAttributes}
              className="px-3 py-1 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black transition-colors"
            >
              Edit Attributes
            </button>
          )}
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
            {(object.attributes || []).map((attr) => (
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

      {/* Methods Section */}
      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-green-500">{"> "} Methods</h2>
          {isOwner && (
            <button
              onClick={onEditMethods}
              className="px-3 py-1 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black transition-colors"
            >
              Edit Methods
            </button>
          )}
        </div>
        <div className="ml-4 space-y-4">
          {(object.methods || []).map((method) => (
            <div key={method.id} className="text-gray-300">
              <div className="flex items-center gap-2">
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
                <span className="text-orange-500">{method.returnType}</span>
                <span className="text-blue-500">{method.name}</span>
                <span className="text-gray-500">
                  (
                  {method.parameters.map(
                    (param: MethodParameter, idx: number) => (
                      <span key={param.id}>
                        {idx > 0 && ", "}
                        <span className="text-yellow-500">{param.name}</span>
                        <span className="text-gray-500">: {param.type}</span>
                        {param.isOptional && (
                          <span className="text-blue-500">?</span>
                        )}
                        {param.defaultValue && (
                          <span className="text-gray-500">
                            {" "}
                            = {param.defaultValue}
                          </span>
                        )}
                      </span>
                    )
                  )}
                  )
                </span>
              </div>
              {method.description && (
                <p className="text-gray-400 ml-4 mt-1">{method.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Relationships Section */}
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
