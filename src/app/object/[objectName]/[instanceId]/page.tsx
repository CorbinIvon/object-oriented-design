"use client";
import { useEffect, useState, use } from "react";
import type { ObjectDetails } from "./types";
import ViewObject from "./view";
import EditObject from "./edit";

export default function ObjectPage({
  params: paramsPromise,
}: {
  params: Promise<{ objectName: string; instanceId: string }>;
}) {
  const [object, setObject] = useState<ObjectDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const params = use(paramsPromise);

  useEffect(() => {
    async function fetchObject() {
      try {
        const response = await fetch(
          `/api/object/${encodeURIComponent(
            params.objectName
          )}/${encodeURIComponent(params.instanceId)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch object");
        }

        const data = await response.json();
        setObject(data.object);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }

    fetchObject();
  }, [params.objectName, params.instanceId]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async (description: string) => {
    try {
      const response = await fetch(
        `/api/object/${params.objectName}/${params.instanceId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        }
      );

      if (!response.ok) throw new Error("Failed to update object");

      const data = await response.json();
      setObject(data.object);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!object) return <div>Loading...</div>;

  return isEditing ? (
    <EditObject object={object} onSave={handleSave} onCancel={handleCancel} />
  ) : (
    <ViewObject object={object} onEdit={handleEdit} />
  );
}
