"use client";
import { useEffect, useState, use } from "react";
import type {
  ObjectDef,
  ObjectAttribute,
  ObjectMethod,
  Relationship,
} from "@prisma/client";

interface ObjectDetails extends ObjectDef {
  attributes: ObjectAttribute[];
  methods: ObjectMethod[];
  fromRelationships: (Relationship & {
    toObject: { name: string };
  })[];
  toRelationships: (Relationship & {
    fromObject: { name: string };
  })[];
  creator: {
    username: string;
  };
}

export default function ObjectPage({
  params: paramsPromise,
}: {
  params: Promise<{ objectName: string; instanceId: string }>;
}) {
  const [object, setObject] = useState<ObjectDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = use(paramsPromise);

  useEffect(() => {
    async function fetchObject() {
      try {
        const response = await fetch(
          `/api/objects/${encodeURIComponent(
            params.objectName
          )}/${encodeURIComponent(params.instanceId)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch object");
        }

        const data = await response.json();
        setObject(data.object);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }

    fetchObject();
  }, [params.objectName, params.instanceId]);

  if (error) return <div>Error: {error}</div>;
  if (!object) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{object.name}</h1>
      <p className="text-gray-400 mb-6">
        Created by {object.creator?.username || "Unknown"}
      </p>

      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl mb-2">Description</h2>
        <p className="text-gray-300">{object.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl mb-4">Attributes</h2>
          <div className="space-y-3">
            {(object.attributes || []).map((attr) => (
              <div key={attr.id} className="bg-gray-700 p-3 rounded">
                <div className="font-semibold">
                  {attr.name}: {attr.type}
                </div>
                <div className="text-sm text-gray-400">{attr.description}</div>
                {attr.defaultValue && (
                  <div className="text-sm text-gray-400">
                    Default: {attr.defaultValue}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl mb-4">Methods</h2>
          <div className="space-y-3">
            {(object.methods || []).map((method) => (
              <div key={method.id} className="bg-gray-700 p-3 rounded">
                <div className="font-semibold">
                  {method.name}(): {method.returnType || "void"}
                </div>
                <div className="text-sm text-gray-400">
                  {method.description}
                </div>
                <div className="text-sm text-blue-400">{method.visibility}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mt-6">
        <h2 className="text-xl mb-4">Relationships</h2>
        <div className="space-y-3">
          {(object.fromRelationships || []).map((rel) => (
            <div key={rel.id} className="bg-gray-700 p-3 rounded">
              <div>
                {object.name} <span className="text-blue-400">{rel.type}</span>{" "}
                {rel.toObject.name}
              </div>
              {rel.description && (
                <div className="text-sm text-gray-400">{rel.description}</div>
              )}
            </div>
          ))}
          {(object.toRelationships || []).map((rel) => (
            <div key={rel.id} className="bg-gray-700 p-3 rounded">
              <div>
                {rel.fromObject.name}{" "}
                <span className="text-blue-400">{rel.type}</span> {object.name}
              </div>
              {rel.description && (
                <div className="text-sm text-gray-400">{rel.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
