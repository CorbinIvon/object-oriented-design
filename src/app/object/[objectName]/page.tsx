"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import type { ObjectDef, Instance } from "@prisma/client";

interface ObjectWithUser extends ObjectDef {
  creator: {
    username: string;
  };
}

interface ObjectData {
  objects: ObjectWithUser[];
  instances: { [objectId: string]: Instance[] };
}

export default function ObjectPage({
  params: paramsPromise,
}: {
  params: Promise<{ objectName: string }>;
}) {
  const router = useRouter();
  const [data, setData] = useState<ObjectData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = use(paramsPromise);

  useEffect(() => {
    async function fetchObjects() {
      try {
        const response = await fetch(`/api/object/name/${params.objectName}`);
        if (!response.ok) throw new Error("Failed to fetch objects");
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }

    fetchObjects();
  }, [params.objectName]);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-4">
      {data.objects.map((obj) => (
        <section
          key={obj.id}
          onClick={() => router.push(`/object/${params.objectName}/${obj.id}`)}
          className="border border-gray-800 bg-black/50 p-4 rounded cursor-pointer hover:border-green-500 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-green-500">{">"}</span>
            <span className="text-yellow-500">{obj.name}</span>
            <span className="text-gray-500">version {obj.version}</span>
          </div>
          <div className="ml-4 text-gray-300">
            <p className="text-gray-400">
              created: {new Date(obj.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-400">
              by: {obj.creator?.username ?? "Unknown"}
            </p>
            <p className="mt-2">{obj.description}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
