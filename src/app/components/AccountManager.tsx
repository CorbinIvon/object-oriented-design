"use client";
import { useState, useRef, useEffect } from "react";
import { User } from "../types/types";

export default function AccountManager() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsLoginModalOpen(false);
        setIsAccountModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <button
          onClick={() => setIsLoginModalOpen(!isLoginModalOpen)}
          className="text-green-500 hover:text-green-400"
        >
          {"> "}Login / Register
        </button>
      )}

      {(isLoginModalOpen || isAccountModalOpen) && (
        <>
          <div className="fixed inset-0 bg-black/90 z-40" />
          <div
            ref={modalRef}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] border border-gray-800 bg-black/95 z-50"
          >
            <div className="p-4">
              {isLoginModalOpen ? (
                <div className="space-y-4">
                  <div className="flex gap-4 border-b border-gray-800">
                    <button className="pb-2 text-green-500">{"> "}Login</button>
                    <button className="pb-2 text-gray-500 hover:text-gray-400">
                      {"> "}Register
                    </button>
                  </div>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
                    />
                    <button className="w-full p-2 bg-black border border-gray-800 text-green-500 hover:bg-gray-900">
                      {"> "}Sign In
                    </button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-black text-gray-500">Or</span>
                      </div>
                    </div>
                    <button className="w-full p-2 border border-gray-800 text-gray-400 hover:bg-gray-900 flex items-center justify-center gap-2">
                      {"> "}Continue with Google
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-4 border-b border-gray-800">
                    <button className="pb-2 text-green-500">
                      {"> "}Account
                    </button>
                    <button className="pb-2 text-gray-500 hover:text-gray-400">
                      {"> "}Designs
                    </button>
                    <button className="pb-2 text-gray-500 hover:text-gray-400">
                      {"> "}Log Out
                    </button>
                  </div>
                  {/* Account content here */}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
