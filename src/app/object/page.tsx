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
    <div className="container mx-auto p-6 font-mono">
      <div className="flex items-center gap-6 mb-4">
        <p className="text-green-500">
          {"> "}Search Results for "{query}"
        </p>
        <select
          value={resultsPerPage}
          onChange={(e) => setResultsPerPage(Number(e.target.value))}
          className="bg-black text-green-500 border-none focus:outline-none"
        >
          {[10, 20, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num} per page
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleCreateNew}
        className="text-green-500 hover:underline mb-4 block"
      >
        {"+ "}create new-object
      </button>

      {objectCounts.length > 20 && (
        <div className="flex gap-4 mb-4">
          {Array.from(
            { length: Math.ceil(objectCounts.length / resultsPerPage) },
            (_, i) => (
              <span
                key={i}
                onClick={() => setPage(i + 1)}
                className={`cursor-pointer ${
                  page === i + 1
                    ? "text-green-500"
                    : "text-gray-500 hover:text-green-500"
                }`}
              >
                [page {i + 1}]
              </span>
            )
          )}
        </div>
      )}

      <ul className="space-y-2 list-none">
        {objectCounts.map(({ name, count }) => (
          <li
            key={name}
            onClick={() => router.push(`/object/${name}`)}
            className="text-green-500 cursor-pointer group relative"
          >
            <span className="inline-block w-[1em] group-hover:hidden">-</span>
            <span className="hidden group-hover:inline-block">&gt;&nbsp;</span>
            {name} ({count} implementation{count !== 1 ? "s" : ""})
          </li>
        ))}
      </ul>

      <div className="flex gap-4 mt-6">
        {Array.from(
          { length: Math.ceil(objectCounts.length / resultsPerPage) },
          (_, i) => (
            <span
              key={i}
              onClick={() => setPage(i + 1)}
              className={`cursor-pointer ${
                page === i + 1
                  ? "text-green-500"
                  : "text-gray-500 hover:text-green-500"
              }`}
            >
              [page {i + 1}]
            </span>
          )
        )}
      </div>
    </div>
  );
}
