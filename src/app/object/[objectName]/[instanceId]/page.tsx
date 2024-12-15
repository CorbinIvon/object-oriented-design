"use client";
import { useEffect, useState, use } from "react";
import type { ObjectDetails, AttributeUpdate, MethodUpdate } from "./types";
import type { ObjectMethod, MethodParameter } from "@prisma/client";
import ViewObject from "./view";
import EditObject from "./edit";
import EditAttributes from "./edit-attributes";
import EditMethods from "./edit-methods";

interface ObjectMethodWithParams extends ObjectMethod {
  parameters: MethodParameter[];
}

interface ExtendedObjectDetails extends Omit<ObjectDetails, "methods"> {
  methods: ObjectMethodWithParams[];
}

export default function ObjectPage({
  params: paramsPromise,
}: {
  params: Promise<{ objectName: string; instanceId: string }>;
}) {
  const [object, setObject] = useState<ExtendedObjectDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAttributes, setIsEditingAttributes] = useState(false);
  const [isEditingMethods, setIsEditingMethods] = useState(false);
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
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/object/${params.objectName}/${params.instanceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId || "",
          },
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

  const handleAttributesSave = async (attributes: AttributeUpdate[]) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/object/${params.objectName}/${params.instanceId}/attributes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId || "",
          },
          body: JSON.stringify({ attributes }),
        }
      );

      if (!response.ok) throw new Error("Failed to update attributes");

      const data = await response.json();
      setObject(data.object);
      setIsEditingAttributes(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save attributes"
      );
    }
  };

  const handleMethodsSave = async (methods: MethodUpdate[]) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/object/${params.objectName}/${params.instanceId}/methods`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId || "",
          },
          body: JSON.stringify({ methods }),
        }
      );

      if (!response.ok) throw new Error("Failed to update methods");

      const data = await response.json();
      setObject(data.object);
      setIsEditingMethods(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save methods");
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!object) return <div>Loading...</div>;

  return isEditing ? (
    <EditObject object={object} onSave={handleSave} onCancel={handleCancel} />
  ) : isEditingAttributes ? (
    <EditAttributes
      attributes={object.attributes}
      onSave={handleAttributesSave}
      onCancel={() => setIsEditingAttributes(false)}
    />
  ) : isEditingMethods ? (
    <EditMethods
      methods={object.methods}
      onSave={handleMethodsSave}
      onCancel={() => setIsEditingMethods(false)}
    />
  ) : (
    <ViewObject
      object={object}
      onEdit={handleEdit}
      onEditAttributes={() => setIsEditingAttributes(true)}
      onEditMethods={() => setIsEditingMethods(true)}
    />
  );
}
