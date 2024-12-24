"use client";
import { useState, useEffect } from "react";
import { User, Object } from "../types/types";
import { useRouter } from "next/navigation";

export default function MyDesignsPage() {
  const [designs, setDesigns] = useState<Object[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/LoginRegister");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    fetch(`/api/designs?userId=${userData.id}`)
      .then((res) => res.json())
      .then((data) => setDesigns(data))
      .catch((err) => console.error("Failed to fetch designs:", err));
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-green-500 p-8">
      <div className="border border-green-500/30 rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-mono mb-4">My Designs</h1>
        <div className="space-y-4">
          {designs.length === 0 ? (
            <p className="text-green-400/70">No designs found</p>
          ) : (
            designs.map((design) => (
              <div
                key={design.id}
                onClick={() => router.push(`/design/${design.id}`)}
                className="border border-green-500/30 rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer"
              >
                <h3 className="text-xl mb-2">{design.name}</h3>
                <p className="text-green-400/70">{design.description}</p>
                <p className="text-sm text-green-400/70 mt-2">
                  Last updated:{" "}
                  {new Date(design.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
