"use client";
import { useState, useEffect } from "react";
import { User, Object } from "./types/types";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [designs, setDesigns] = useState<Object[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/LoginRegister");
      return;
    }
    setUser(JSON.parse(storedUser));
    setDesigns([]);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-green-500 p-8">
      {/* Header Section */}
      <div className="border border-green-500/30 rounded-lg p-6 mb-8 backdrop-blur-sm bg-black/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-mono mb-2">
              {">"} {user?.username}_
            </h1>
            <p className="text-green-400/70">{user?.email}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-400/70">Role: {user?.role}</p>
            <p className="text-sm text-green-400/70">
              Member since:{" "}
              {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border border-green-500/30 rounded-lg p-6 hover:border-green-500 transition-colors">
          <h3 className="text-xl mb-2">Total Designs</h3>
          <p className="text-4xl font-mono">{designs.length}</p>
        </div>
        <div className="border border-green-500/30 rounded-lg p-6 hover:border-green-500 transition-colors">
          <h3 className="text-xl mb-2">Last Active</h3>
          <p className="text-xl font-mono">{new Date().toLocaleDateString()}</p>
        </div>
        <div className="border border-green-500/30 rounded-lg p-6 hover:border-green-500 transition-colors">
          <h3 className="text-xl mb-2">Workspace Status</h3>
          <p className="text-xl font-mono text-green-400">ACTIVE</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="border border-green-500/30 rounded-lg p-6 mb-8">
        <h2 className="text-2xl mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {designs.length === 0 ? (
            <p className="text-green-400/70">No recent activity</p>
          ) : (
            designs.map((design) => (
              <div
                key={design.id}
                className="flex items-center justify-between border-b border-green-500/30 pb-4"
              >
                <div>
                  <h3 className="text-xl">{design.name}</h3>
                  <p className="text-green-400/70">{design.description}</p>
                </div>
                <p className="text-sm text-green-400/70">
                  {new Date(design.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="border border-green-500/30 rounded-lg p-4 hover:bg-green-500/10 transition-colors">
          <span className="block text-xl mb-2">＋</span>
          New Design
        </button>
        <button className="border border-green-500/30 rounded-lg p-4 hover:bg-green-500/10 transition-colors">
          <span className="block text-xl mb-2">⚙</span>
          Settings
        </button>
        <button className="border border-green-500/30 rounded-lg p-4 hover:bg-green-500/10 transition-colors">
          <span className="block text-xl mb-2">◈</span>
          Templates
        </button>
        <button className="border border-green-500/30 rounded-lg p-4 hover:bg-green-500/10 transition-colors">
          <span className="block text-xl mb-2">?</span>
          Help
        </button>
      </div>
    </div>
  );
}
