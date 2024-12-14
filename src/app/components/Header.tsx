"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import TerminalSearch from "./TerminalSearch";
import { useEffect, useRef } from "react";
import AccountManager from "./AccountManager";
import AuthGuard from "./AuthGuard";

export default function Header() {
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
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-[200px]">
        <Link href="/" className="flex gap-1">
          <span className="text-red-500">●</span>
          <span className="text-yellow-500">●</span>
          <span className="text-green-500">●</span>
        </Link>
        <span className="text-gray-400 pl-2">
          {usePathname().replace("/", "") || "Home"}
        </span>
      </div>
      <div className="flex-1 max-w-[600px]">
        <AuthGuard>
          <TerminalSearch inputRef={searchRef} />
        </AuthGuard>
      </div>
      <div className="min-w-[200px] flex justify-end">
        <AccountManager />
      </div>
    </div>
  );
}
