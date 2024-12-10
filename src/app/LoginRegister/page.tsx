"use client";
import { useState } from "react";
import Header from "../components/Header";

export default function LoginRegister() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen p-4 font-mono">
      <div className="max-w-3xl mx-auto border border-gray-800 bg-black/50 px-6 py-2 rounded">
        <div className="space-y-4">
          <Header />
          <div className="border border-gray-800 bg-black/50 p-4 rounded">
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex gap-4 border-b border-gray-800">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`pb-2 ${
                    activeTab === "login"
                      ? "text-green-500"
                      : "text-gray-500 hover:text-gray-400"
                  }`}
                >
                  {"> "}Login
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`pb-2 ${
                    activeTab === "register"
                      ? "text-green-500"
                      : "text-gray-500 hover:text-gray-400"
                  }`}
                >
                  {"> "}Register
                </button>
              </div>

              {activeTab === "login" ? (
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
                    {"> "}Sign In With Google
                  </button>
                </form>
              ) : (
                <form className="space-y-3">
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
                  />
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
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
                  />
                  <button className="w-full p-2 bg-black border border-gray-800 text-green-500 hover:bg-gray-900">
                    {"> "}Register
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
