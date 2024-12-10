"use client";
import { useState } from "react";
import { User } from "../types/types";
import Link from "next/link";

export default function AccountManager() {
  const [user, setUser] = useState<User | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <div className="relative">
      {user ? (
        <button
          onClick={() => setIsAccountModalOpen(!isAccountModalOpen)}
          className="text-green-500 hover:text-green-400"
        >
          {"> "}Account
        </button>
      ) : (
        <Link
          href="/LoginRegister"
          className="text-green-500 hover:text-green-400"
        >
          {"> "}Login / Register
        </Link>
      )}

      {isAccountModalOpen && user && (
        <div className="absolute right-0 mt-2 w-48 border border-gray-800 bg-black/95 z-50">
          <div className="p-4 space-y-2">
            <button className="w-full text-left text-green-500 hover:text-green-400">
              {"> "}Account Settings
            </button>
            <button className="w-full text-left text-gray-500 hover:text-gray-400">
              {"> "}Designs
            </button>
            <button className="w-full text-left text-gray-500 hover:text-gray-400">
              {"> "}Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
