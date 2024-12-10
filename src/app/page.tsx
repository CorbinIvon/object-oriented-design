"use client";
import { useEffect, useRef } from "react";
import TerminalNav from "./components/TerminalNav";
import TerminalSearch from "./components/TerminalSearch";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Home() {
  const searchRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen p-4 font-mono">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-green-500 flex items-center gap-2">
          <span className="text-red-500">●</span>
          <span className="text-yellow-500">●</span>
          <span className="text-green-500">●</span>
        </div>

        <div className="space-y-4">
          <section>
            <TerminalNav items={navItems} />
          </section>
          <TerminalSearch inputRef={searchRef} />

          <section className="border border-gray-800 bg-black/50 p-4 rounded">
            <p className="text-green-500 mb-2">{">"} System Information</p>
            <div className="ml-4 text-gray-300 space-y-1">
              <p className="font-light">Welcome to my terminal-style website</p>
              <p className="font-light">OS: NextJS 14.0.0</p>
              <p className="font-light">SHELL: React/TypeScript</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
