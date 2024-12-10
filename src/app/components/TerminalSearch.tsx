"use client";
import { useState } from "react";

export default function TerminalSearch({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const [, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex items-center gap-2 text-gray-400">
      <span>search@site:~$</span>
      <input
        ref={inputRef}
        type="text"
        className="bg-transparent border-none outline-none flex-grow text-white focus:outline-none"
        placeholder={`Ctrl + K`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
      />
    </div>
  );
}
