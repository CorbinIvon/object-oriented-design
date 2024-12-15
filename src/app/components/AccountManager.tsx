"use client";
import { useState, useEffect, useRef } from "react";
import { User } from "../types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountManager() {
  const [user, setUser] = useState<User | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Initial user check
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (!window.location.pathname.includes("LoginRegister")) {
      router.push("/LoginRegister");
    }

    // Listen for user login/logout events
    const handleUserChange = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
        if (!window.location.pathname.includes("LoginRegister")) {
          router.push("/LoginRegister");
        }
      }
    };

    window.addEventListener("userChange", handleUserChange);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAccountModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("userChange", handleUserChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAccountModalOpen(false);
    window.dispatchEvent(new Event("userChange"));
    router.push("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      {user ? (
        <button
          onClick={() => setIsAccountModalOpen(!isAccountModalOpen)}
          className="text-green-500 hover:text-green-400"
        >
          {">"}&nbsp;Account
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
            <div className="text-gray-500 border-b border-gray-800 pb-2">
              {user.username}
            </div>
            <button className="w-full text-left text-green-500 hover:text-green-400">
              {"> "}Account Settings
            </button>
            <button className="w-full text-left text-gray-500 hover:text-gray-400">
              {"> "}Designs
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left text-gray-500 hover:text-gray-400"
            >
              {"> "}Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
