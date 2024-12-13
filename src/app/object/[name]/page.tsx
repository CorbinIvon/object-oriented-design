"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Link from "next/link";
import {
  User,
  Object as ObjectType,
  RelationshipType,
  Tag,
} from "../../types/types";

interface PageProps {
  params: Promise<{ name: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

interface ExtendedObject extends Omit<ObjectType, "tags"> {
  fromRelationships: Array<{
    id: string;
    type: RelationshipType;
    toObject: { name: string };
  }>;
  toRelationships: Array<{
    id: string;
    type: RelationshipType;
    fromObject: { name: string };
  }>;
  tags: Array<{
    tag: Tag;
  }>;
}

export default function ObjectPage({ params, searchParams }: PageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [object, setObject] = useState<ExtendedObject | null>(null);
  const [editedObject, setEditedObject] = useState<ExtendedObject | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentName, setCurrentName] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchObject = async () => {
      try {
        const { name } = await params;
        const decodedName = decodeURIComponent(name);
        setCurrentName(decodedName);
        const response = await fetch(
          `/api/objects/name/${encodeURIComponent(decodedName)}`
        );
        const data = await response.json();
        if (data.object) {
          setObject(data.object as ExtendedObject);
          setEditedObject(data.object as ExtendedObject);
        }
      } catch (err) {
        setError("Failed to fetch object");
      } finally {
        setLoading(false);
      }
    };
    fetchObject();
  }, [params]);

  const handleEdit = async () => {
    if (!user || !editedObject) return;

    try {
      const response = await fetch(`/api/objects/${editedObject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedObject.name,
          description: editedObject.description,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update object");
      }

      const data = await response.json();
      setObject(data.object as ExtendedObject);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update object");
    }
  };

  const handleNameChange = (newName: string) => {
    if (!editedObject) return;

    setEditedObject({
      ...editedObject,
      name: newName,
      // Ensure all required properties are preserved
      fromRelationships: editedObject.fromRelationships,
      toRelationships: editedObject.toRelationships,
      tags: editedObject.tags,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!object) {
    return (
      <div className="min-h-screen p-4 font-mono">
        <div className="max-w-3xl mx-auto border border-gray-800 bg-black/50 px-6 py-2 rounded">
          <Header />
          <div className="mt-4 space-y-4">
            <div className="border border-gray-800 bg-black/50 p-4 rounded">
              <div className="text-red-500">
                Object &quot;{currentName}&quot; not found
              </div>
              <div className="mt-4">
                <Link
                  href={`/create?name=${encodeURIComponent(currentName)}`}
                  className="inline-block px-4 py-2 bg-black border border-gray-800 text-green-500 hover:bg-gray-900"
                >
                  {"> "}Create &quot;{currentName}&quot;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 font-mono">
      <div className="max-w-3xl mx-auto border border-gray-800 bg-black/50 px-6 py-2 rounded">
        <Header />
        <div className="mt-4 space-y-4">
          <div className="border border-gray-800 bg-black/50 p-4 rounded">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl text-green-500">
                {isEditing ? (
                  <input
                    value={editedObject?.name || ""}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="bg-black border border-gray-800 p-1"
                  />
                ) : (
                  object?.name
                )}
              </h1>
              {user && (
                <button
                  onClick={() =>
                    isEditing ? handleEdit() : setIsEditing(true)
                  }
                  className="text-green-500 hover:text-green-400"
                >
                  {isEditing ? "> Save" : "> Edit"}
                </button>
              )}
            </div>
            <p className="text-gray-400 mt-2">{object?.description}</p>

            {/* Attributes Section */}
            <div className="mt-4">
              <h2 className="text-green-500">{"> "}Attributes</h2>
              <div className="mt-2 space-y-2">
                {object?.attributes?.map((attr) => (
                  <div key={attr.id} className="text-gray-400">
                    {attr.name}: {attr.type}
                    {attr.required && " (required)"}
                  </div>
                ))}
              </div>
            </div>

            {/* Methods Section */}
            <div className="mt-4">
              <h2 className="text-green-500">{"> "}Methods</h2>
              <div className="mt-2 space-y-2">
                {object?.methods?.map((method) => (
                  <div key={method.id} className="text-gray-400">
                    <div>
                      {method.visibility.toLowerCase()} {method.name}(
                      {method.parameters
                        ? method.parameters.map(
                            (p, i) =>
                              `${p.name}: ${p.type}${p.isOptional ? "?" : ""}${
                                i < (method.parameters?.length || 0) - 1
                                  ? ", "
                                  : ""
                              }`
                          )
                        : ""}
                      ){method.returnType ? `: ${method.returnType}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relationships Section */}
            <div className="mt-4">
              <h2 className="text-green-500">{"> "}Relationships</h2>
              <div className="mt-2 space-y-2">
                {object?.fromRelationships.map((rel) => (
                  <div key={rel.id} className="text-gray-400">
                    {`${rel.type.toLowerCase()} → ${rel.toObject.name}`}
                  </div>
                ))}
                {object?.toRelationships.map((rel) => (
                  <div key={rel.id} className="text-gray-400">
                    {`${rel.fromObject.name} → ${rel.type.toLowerCase()}`}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            {(object?.tags?.length ?? 0) > 0 && (
              <div className="mt-4">
                <h2 className="text-green-500">Tags</h2>
                <div className="flex gap-2 mt-2">
                  {object?.tags?.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="text-gray-400 text-sm border border-gray-800 px-2 py-1 rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
