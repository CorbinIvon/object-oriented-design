"use client";
import { useEffect, useState } from "react";
import type { ObjectDef, Instance } from "@prisma/client";

interface ObjectData {
  objectDef: ObjectDef;
  instances: Instance[];
}

export default function ObjectPage({
  params,
}: {
  params: { objectName: string };
}) {
  const [data, setData] = useState<ObjectData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchObject() {
      try {
        const response = await fetch(`/api/objects/${params.objectName}`);
        if (!response.ok) {
          throw new Error("Failed to fetch object");
        }
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }

    fetchObject();
  }, [params.objectName]);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{data.objectDef.name}</h1>
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl mb-2">Description</h2>
        <p className="text-gray-300">{data.objectDef.description}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl mb-4">Instances ({data.instances.length})</h2>
        <div className="grid gap-4">
          {data.instances.map((instance) => (
            <div key={instance.id} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{instance.name}</h3>
              <p className="text-sm text-gray-400">ID: {instance.id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
