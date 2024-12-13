"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { prisma } from "@/lib/prisma";
import { Instance } from "@prisma/client";

export default function ObjectPage() {
  const router = useRouter();
  const { name } = useParams();
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInstances() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/objects/${encodeURIComponent(name as string)}`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.error);
          return;
        }

        setInstances(data.instances);
        setError(null);
      } catch (err) {
        setError("Failed to fetch instances");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (name) {
      fetchInstances();
    }
  }, [name]);

  if (loading)
    return (
      <div className="container mx-auto p-6">
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-900/20 border border-red-900 rounded p-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-white bg-red-900 px-4 py-2 rounded hover:bg-red-800"
          >
            Return Home
          </button>
        </div>
      </div>
    );

  const paginatedInstances = instances.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-4">Instances of {name}</h1>

      <select
        value={resultsPerPage}
        onChange={(e) => setResultsPerPage(Number(e.target.value))}
        className="mb-4 bg-gray-800 text-white p-2 rounded"
      >
        {[10, 20, 50, 100].map((num) => (
          <option key={num} value={num}>
            {num} per page
          </option>
        ))}
      </select>

      <div className="space-y-4">
        {paginatedInstances.map((instance) => (
          <a
            key={instance.id}
            href={`/object/${name}/${instance.id}`}
            className="block p-4 bg-gray-800 rounded hover:bg-gray-700"
          >
            <h2 className="text-xl">{instance.name}</h2>
          </a>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from(
          { length: Math.ceil(instances.length / resultsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded ${
                page === i + 1 ? "bg-blue-600" : "bg-gray-800"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}
