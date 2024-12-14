"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TerminalSearch({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      router.push(`/object?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 text-gray-400 border border-green-500/50 rounded px-2">
        <svg
          className="w-4 h-4 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="bg-transparent border-none outline-none flex-grow text-white focus:outline-none py-1"
          placeholder={`[Ctrl + K] Search... `}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={inputValue}
        />
      </div>
    </div>
  );
}
