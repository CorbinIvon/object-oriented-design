"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { Instance } from "@prisma/client";

type InstanceWithObject = Instance & {
  objectDef: {
    id: string;
    name: string;
    description: string;
    version: string;
  };
  attributes: {
    id: string;
    name: string;
    value: string;
  }[];
};

export default function BrowsePage() {
  const router = useRouter();
  const [instances, setInstances] = useState<InstanceWithObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);

  useEffect(() => {
    async function fetchInstances() {
      try {
        setLoading(true);
        const response = await fetch("/api/browse");
        if (!response.ok) throw new Error("Failed to fetch instances");
        const data = await response.json();
        console.log("Received data:", data);
        if (!data.instances) throw new Error("No instances in response");
        setInstances(data.instances);
      } catch (err) {
        console.error("Error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load instances"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchInstances();
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (loading) {
    return <div className="text-green-500 p-4">Loading instances...</div>;
  }

  if (instances.length === 0) {
    return (
      <div className="container mx-auto p-6 space-y-4 font-mono">
        <div className="border border-gray-800 bg-black/50 p-4 rounded">
          <h2 className="text-yellow-500 text-lg mb-4">No instances found</h2>
          <div className="space-y-4 text-gray-400">
            <p>To get started:</p>
            <ol className="list-decimal ml-6 space-y-2">
              <li>First, search for an object in the search bar above</li>
              <li>Select the object definition version you want to use</li>
              <li>Click "Create Instance" on the object definition page</li>
            </ol>
            <p className="mt-4 text-gray-500">
              Once instances are created, they will appear here
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate pagination values
  const startIndex = (page - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedResults = instances.slice(startIndex, endIndex);
  const totalPages = Math.ceil(instances.length / resultsPerPage);

  return (
    <div className="container mx-auto p-6 space-y-4 font-mono">
      <div className="border border-gray-800 bg-black/50 p-4 rounded">
        <div className="flex items-center gap-6 mb-4">
          <p className="text-yellow-500">Recent Instances</p>
          <select
            value={resultsPerPage}
            onChange={(e) => setResultsPerPage(Number(e.target.value))}
            className="bg-black text-green-500 border border-gray-800 rounded p-1 focus:border-green-500 focus:outline-none"
          >
            {[10, 20, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num} per page
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-6">
          {totalPages > 1 && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <span
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`cursor-pointer px-2 py-1 rounded transition-colors text-center min-w-[4rem] ${
                    page === i + 1
                      ? "text-green-500 border border-green-500"
                      : "text-gray-500 hover:text-green-500"
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-4 flex-1">
            {paginatedResults.map((instance, index) => (
              <section
                key={instance.id}
                onClick={() =>
                  router.push(
                    `/object/${instance.objectDef.name}/${instance.objectDef.id}`
                  )
                }
                className="border border-gray-800 bg-black/50 p-4 rounded cursor-pointer hover:border-green-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-500">{">"}</span>
                  <span className="text-yellow-500">{instance.name}</span>
                  <span className="text-gray-500">
                    ({instance.objectDef.name} v{instance.objectDef.version})
                  </span>
                </div>
                <div className="ml-4 mt-2 text-gray-300">
                  <p className="text-gray-400">
                    created: {new Date(instance.createdAt).toLocaleString()}
                  </p>
                  {instance.attributes.map((attr) => (
                    <p key={attr.id} className="text-gray-400">
                      <span className="text-green-500">{attr.name}:</span>{" "}
                      {attr.value}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
