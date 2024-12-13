"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Visibility, RelationshipType } from "../types/types";

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/LoginRegister");
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const objectData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      version: formData.get("version") as string,
      creatorId: user.id,
    };

    try {
      const response = await fetch("/api/objects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objectData),
      });

      const data = await response.json();

      if (response.ok && data.object) {
        router.push(`/object/${data.object.name}/${data.object.id}`);
      } else {
        setError(data.error || "Failed to create object");
      }
    } catch (err) {
      setError("An error occurred while creating the object");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="border border-gray-800 bg-black/50 p-4 rounded">
      <h1 className="text-2xl text-green-500">Create New Object</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="space-y-2">
          <label className="block text-gray-400">Name</label>
          <input
            name="name"
            type="text"
            required
            defaultValue={searchParams.get("name") || ""}
            className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-400">Version</label>
          <input
            name="version"
            type="text"
            required
            placeholder="e.g., 1.0, 2.0-beta"
            defaultValue="1.0"
            className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-400">Description</label>
          <textarea
            name="description"
            required
            rows={3}
            className="w-full p-2 bg-black border border-gray-800 text-green-500 focus:border-green-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-black border border-gray-800 text-green-500 hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Creating..." : "> Create Object"}
        </button>
      </form>
    </div>
  );
}
