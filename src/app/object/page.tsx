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
      setPage(1); // Reset to page 1 when query changes

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

  // Calculate pagination values
  const startIndex = (page - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedResults = objectCounts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(objectCounts.length / resultsPerPage);

  const handleCreateNew = () => {
    const objectName = query.trim() || "NewObject";
    router.push(
      `/create?name=${encodeURIComponent(objectName)}&creatorId=${userId}`
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-4 font-mono">
      <button
        onClick={handleCreateNew}
        className="border border-green-500 bg-black/50 p-2 rounded hover:bg-green-500/10 transition-colors text-green-500"
      >
        <span className="mr-2">+</span>
        create new-object
      </button>

      <div className="border border-gray-800 bg-black/50 p-4 rounded">
        <div className="flex items-center gap-6 mb-4">
          <p className="text-yellow-500">Search Results: "{query}"</p>
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

          <ul className="space-y-2 list-none flex-1">
            {paginatedResults.map(({ name, count }, index) => (
              <li
                key={name}
                onClick={() => router.push(`/object/${name}`)}
                className="text-gray-300 cursor-pointer group hover:text-green-500 transition-colors p-2 rounded hover:bg-green-500/5"
              >
                <span className="text-gray-500 mr-2">
                  {startIndex + index + 1}.
                </span>
                <span className="text-green-500 mr-2 group-hover:text-green-400">
                  &gt;
                </span>
                <span className="text-yellow-500">{name}</span>
                <span className="text-gray-500 ml-2">
                  ({count} implementation{count !== 1 ? "s" : ""})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
