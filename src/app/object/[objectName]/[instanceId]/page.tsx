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
    <div className="container mx-auto p-6 space-y-4">
      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <p className="text-green-500 mb-2">{"> "} Object Information</p>
        <div className="ml-4 text-gray-300">
          <h1 className="text-xl font-bold mb-1">{object.name}</h1>
          <p className="text-gray-400">
            Created by {object.creator?.username || "Unknown"}
          </p>
          <p className="mt-2">{object.description}</p>
        </div>
      </section>

      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <p className="text-green-500 mb-2">{"> "} Attributes</p>
        <div className="ml-4 space-y-2">
          {(object.attributes || []).map((attr) => (
            <div key={attr.id} className="text-gray-300">
              <div className="font-mono">
                {attr.name}: <span className="text-blue-400">{attr.type}</span>
              </div>
              <div className="text-sm text-gray-400 ml-4">
                {attr.description}
              </div>
              {attr.defaultValue && (
                <div className="text-sm text-gray-400 ml-4">
                  Default: {attr.defaultValue}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <p className="text-green-500 mb-2">{"> "} Methods</p>
        <div className="ml-4 space-y-2">
          {(object.methods || []).map((method) => (
            <div key={method.id} className="text-gray-300">
              <div className="font-mono">
                {method.name}():{" "}
                <span className="text-blue-400">
                  {method.returnType || "void"}
                </span>
              </div>
              <div className="text-sm text-gray-400 ml-4">
                {method.description}
              </div>
              <div className="text-sm text-gray-400 ml-4">
                Visibility: {method.visibility}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <p className="text-green-500 mb-2">{"> "} Relationships</p>
        <div className="ml-4 space-y-2">
          {(object.fromRelationships || []).map((rel) => (
            <div key={rel.id} className="text-gray-300">
              <div className="font-mono">
                {object.name} <span className="text-blue-400">{rel.type}</span>{" "}
                {rel.toObject.name}
              </div>
              {rel.description && (
                <div className="text-sm text-gray-400 ml-4">
                  {rel.description}
                </div>
              )}
            </div>
          ))}
          {(object.toRelationships || []).map((rel) => (
            <div key={rel.id} className="text-gray-300">
              <div className="font-mono">
                {rel.fromObject.name}{" "}
                <span className="text-blue-400">{rel.type}</span> {object.name}
              </div>
              {rel.description && (
                <div className="text-sm text-gray-400 ml-4">
                  {rel.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
