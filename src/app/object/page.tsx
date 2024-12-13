"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fuzzySearch } from "@/utils/fuzzySearch";
import type { ObjectDef } from "@prisma/client";

type ObjectCount = {
  name: string;
  count: number;
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [objectCounts, setObjectCounts] = useState<ObjectCount[]>([]);
  const [userId] = useState("00000000-0000-0000-0000-000000000000"); // Temporary user ID

  useEffect(() => {
    async function fetchObjects() {
      if (!query.trim()) return;

      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      // Group and count objects by name with proper typing
      const counts: ObjectCount[] = Object.entries(
        data.objects.reduce(
          (acc: { [key: string]: number }, obj: ObjectDef) => {
            const score = fuzzySearch(query, obj.name);
            if (score > 0) {
              acc[obj.name] = (acc[obj.name] || 0) + 1;
            }
            return acc;
          },
          {}
        )
      ).map(
        ([name, count]): ObjectCount => ({
          name,
          count: count as number,
        })
      );

      setObjectCounts(counts);
    }

    fetchObjects();
  }, [query]);

  const handleCreateNew = () => {
    const objectName = query.trim() || "NewObject";
    router.push(
      `/create?name=${encodeURIComponent(objectName)}&creatorId=${userId}`
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Search Results for "{query}"</h1>
        <button
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create New Object
        </button>
      </div>

      <div className="flex justify-between mb-4">
        <select
          value={resultsPerPage}
          onChange={(e) => setResultsPerPage(Number(e.target.value))}
          className="bg-gray-800 text-white p-2 rounded"
        >
          {[10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num} per page
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {objectCounts.map(({ name, count }) => (
          <div
            key={name}
            onClick={() => router.push(`/object/${name}`)}
            className="p-4 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
          >
            <h2 className="text-xl">
              {name} ({count} implementation{count !== 1 ? "s" : ""})
            </h2>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from(
          { length: Math.ceil(objectCounts.length / resultsPerPage) },
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
