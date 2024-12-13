"use client";
import { useEffect, useState } from "react";
import type { Instance, InstanceAttribute } from "@prisma/client";

interface InstanceDetails extends Instance {
  attributes: InstanceAttribute[];
}

export default function InstancePage({
  params,
}: {
  params: { objectName: string; instanceId: string };
}) {
  const [instance, setInstance] = useState<InstanceDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInstance() {
      try {
        const response = await fetch(
          `/api/objects/${params.objectName}/${params.instanceId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch instance");
        }
        const data = await response.json();
        setInstance(data.instance);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }

    fetchInstance();
  }, [params.objectName, params.instanceId]);

  if (error) return <div>Error: {error}</div>;
  if (!instance) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{instance.name}</h1>

      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl mb-4">Attributes</h2>
        <div className="grid gap-3">
          {instance.attributes.map((attr) => (
            <div key={attr.id} className="bg-gray-700 p-3 rounded">
              <span className="font-semibold">{attr.name}:</span>{" "}
              <span>{attr.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
