"use client";
import { useEffect, useState, use } from "react";
import type { ObjectDef, Instance, InstanceAttribute } from "@prisma/client";

interface ObjectDetails extends ObjectDef {
  instances: (Instance & {
    attributes: InstanceAttribute[];
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
      <h1 className="text-3xl font-bold mb-6">{object.name}</h1>
      <p className="text-gray-400 mb-4">Created by {object.creator.username}</p>
      <p className="mb-6">{object.description}</p>

      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl mb-4">Instances</h2>
        <div className="grid gap-4">
          {object.instances.map((instance) => (
            <div key={instance.id} className="bg-gray-700 p-4 rounded">
              <h3 className="font-semibold mb-2">{instance.name}</h3>
              <div className="grid gap-2">
                {instance.attributes.map((attr) => (
                  <div key={attr.id} className="text-sm">
                    <span className="font-medium">{attr.name}:</span>{" "}
                    <span className="text-gray-300">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
