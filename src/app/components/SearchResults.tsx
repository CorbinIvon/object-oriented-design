"use client";
import { useRouter } from "next/navigation";

type SearchResult = {
  name: string;
  id: string;
  score?: number;
};

export default function SearchResults({
  results,
}: {
  results: SearchResult[];
}) {
  const router = useRouter();
  const previewResults = results.slice(0, 5);

  const handleClick = (e: React.MouseEvent, result: SearchResult) => {
    e.preventDefault();
    router.push(`/object/${result.name}`);
  };

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 w-full bg-gray-900 border border-gray-700 rounded-md mt-2">
        <div className="px-4 py-2 text-gray-400">
          No results found
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 w-full bg-gray-900 border border-gray-700 rounded-md mt-2">
      {previewResults.map((result) => (
        <a
          key={result.id}
          href={`/object/${result.name}`}
          onClick={(e) => handleClick(e, result)}
          className="block px-4 py-2 hover:bg-gray-800 text-gray-300"
        >
          {result.name}
        </a>
      ))}
      {results.length > 5 && (
        <a
          href={`/search?q=${encodeURIComponent(results[0].name)}`}
          onClick={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(results[0].name)}`);
          }}
          className="block px-4 py-2 text-blue-400 hover:bg-gray-800 text-sm"
        >
          View all {results.length} results...
        </a>
      )}
    </div>
  );
}
