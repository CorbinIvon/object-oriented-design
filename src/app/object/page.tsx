"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { fuzzySearch } from "@/utils/fuzzySearch";
import type { ObjectDef } from "@prisma/client";

type ScoredObject = ObjectDef & {
  score: number;
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [objects, setObjects] = useState<ScoredObject[]>([]);

  useEffect(() => {
    async function fetchObjects() {
      if (!query.trim()) return;

      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      const scoredObjects = data.objects
        .map((obj: ObjectDef) => ({
          ...obj,
          score: fuzzySearch(query, obj.name),
        }))
        .filter((obj: ScoredObject) => obj.score > 0)
        .sort((a: ScoredObject, b: ScoredObject) => b.score - a.score);

      setObjects(scoredObjects);
    }

    fetchObjects();
  }, [query]);

  const paginatedResults = objects.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  const handleResultClick = (result: ObjectDef) => {
    router.push(`/object/${result.name}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-4">Search Results for "{query}"</h1>

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
        {paginatedResults.map((result) => (
          <div
            key={result.id}
            onClick={() => handleResultClick(result)}
            className="cursor-pointer p-4 bg-gray-800 rounded hover:bg-gray-700"
          >
            <h2 className="text-xl">{result.name}</h2>
            <p className="text-gray-400">{result.description}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from(
          { length: Math.ceil(objects.length / resultsPerPage) },
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
