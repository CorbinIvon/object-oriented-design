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
        const response = await fetch(`/api/objects/name/${params.objectName}`);
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        "{params.objectName}" Implementations
      </h1>

      {data.objects.map((obj) => (
        <div
          key={obj.id}
          onClick={() => router.push(`/object/${params.objectName}/${obj.id}`)}
          className="bg-gray-800 p-6 rounded-lg mb-6 cursor-pointer hover:bg-gray-700"
        >
          <h2 className="text-xl mb-2">Created by {obj.creator.username}</h2>
          <p className="text-gray-300 mb-4">{obj.description}</p>
        </div>
      ))}
    </div>
  );
}
