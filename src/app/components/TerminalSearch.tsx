"use client";
import { useState, useEffect } from "react";
import { fuzzySearch } from "@/utils/fuzzySearch";
import { useRouter } from "next/navigation";
import { ObjectDef } from "@prisma/client";

type SearchableItem = {
  name: string;
  id: string;
  score?: number;
};

export default function TerminalSearch({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [objects, setObjects] = useState<ObjectDef[]>([]);

  useEffect(() => {
    async function fetchObjects() {
      if (!inputValue.trim()) return;

      const response = await fetch(
        `/api/search?q=${encodeURIComponent(inputValue)}`
      );
      const data = await response.json();
      setObjects(data.objects);
    }

    fetchObjects();
  }, [inputValue]);

  const getSearchResults = (): SearchableItem[] => {
    if (!inputValue) return [];

    return objects
      .map((item) => ({
        name: item.name,
        id: item.id,
        score: fuzzySearch(inputValue, item.name),
      }))
      .filter((item) => (item.score || 0) > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      router.push(`/object?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 text-gray-400">
        <span>@OOD:</span>
        <input
          ref={inputRef}
          type="text"
          className="bg-transparent border-none outline-none flex-grow text-white focus:outline-none"
          placeholder={`[Ctrl + K] Search... `}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={inputValue}
        />
      </div>
    </div>
  );
}
