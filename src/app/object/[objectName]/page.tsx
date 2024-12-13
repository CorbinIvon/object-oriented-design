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
    <div className="container mx-auto font-mono">
      <ul className="space-y-4 list-none">
        {data.objects.map((obj) => (
          <li
            key={obj.id}
            onClick={() =>
              router.push(`/object/${params.objectName}/${obj.id}`)
            }
            className="text-green-500 cursor-pointer border-y border-green-500 group relative"
          >
            <p className="">
              <span className="text-green-500 mb-2 ">
                <span className="inline-block w-[1em] group-hover:hidden">
                  -
                </span>
                <span className="hidden group-hover:inline-block">
                  &gt;&nbsp;
                </span>
                created-by: {obj.creator.username}
              </span>
            </p>
            <p className="text-gray-400 ml-4">{obj.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
