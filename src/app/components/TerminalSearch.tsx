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
      <div className="flex items-center gap-2 text-gray-400">
        <span>@OOD:</span>
        <input
          ref={inputRef}
          type="text"
          className="bg-transparent border-none outline-none flex-grow text-white focus:outline-none"
          placeholder={`[Ctrl + K] Search... `}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={inputValue}
        />
      </div>
    </div>
  );
}
