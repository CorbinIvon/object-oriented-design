import { useState } from "react";
import type { ObjectAttribute } from "@prisma/client";
import type { AttributeUpdate } from "./types";

interface EditAttributesProps {
  attributes: ObjectAttribute[];
  onSave: (attributes: AttributeUpdate[]) => void;
  onCancel: () => void;
}

export default function EditAttributes({
  attributes,
  onSave,
  onCancel,
}: EditAttributesProps) {
  const [attrs, setAttrs] = useState<AttributeUpdate[]>(
    attributes.map(
      ({ id, name, type, description, defaultValue, required }) => ({
        id,
        name,
        type,
        description,
        defaultValue,
        required,
      })
    )
  );
  const [invalidFields, setInvalidFields] = useState<number[]>([]);

  const addAttribute = () => {
    setAttrs([
      ...attrs,
      {
        name: "",
        type: "string",
        description: "",
        defaultValue: null,
        required: false,
      },
    ]);
  };

  const removeAttribute = (index: number) => {
    setAttrs(attrs.filter((_, i) => i !== index));
  };

  const updateAttribute = (
    index: number,
    field: keyof AttributeUpdate,
    value: string | boolean
  ) => {
    setAttrs(
      attrs.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr))
    );
  };

  const handleSave = () => {
    const emptyNameIndices = attrs
      .map((attr, index) => (attr.name.trim() === "" ? index : -1))
      .filter((index) => index !== -1);

    if (emptyNameIndices.length > 0) {
      setInvalidFields(emptyNameIndices);
      return;
    }

    setInvalidFields([]);
    onSave(attrs);
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <h2 className="text-green-500 mb-4">{"> "} Edit Attributes</h2>
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Default</th>
              <th className="text-left p-2">Nullable</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2"></th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {attrs.map((attr, index) => (
              <tr key={index} className="border-t border-gray-800">
                <td className="p-2">
                  <input
                    type="text"
                    value={attr.name}
                    onChange={(e) => {
                      updateAttribute(index, "name", e.target.value);
                      if (invalidFields.includes(index)) {
                        setInvalidFields(
                          invalidFields.filter((i) => i !== index)
                        );
                      }
                    }}
                    placeholder="Name"
                    className={`w-full bg-black/30 text-gray-300 border ${
                      invalidFields.includes(index)
                        ? "border-red-500"
                        : "border-gray-700"
                    } rounded p-2`}
                  />
                  {invalidFields.includes(index) && (
                    <div className="text-red-500 text-xs mt-1">
                      Name is required
                    </div>
                  )}
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={attr.type}
                    onChange={(e) =>
                      updateAttribute(index, "type", e.target.value)
                    }
                    placeholder="Type"
                    className="w-full bg-black/30 text-gray-300 border border-gray-700 rounded p-2"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={attr.defaultValue || ""}
                    onChange={(e) =>
                      updateAttribute(index, "defaultValue", e.target.value)
                    }
                    placeholder="Default Value"
                    className="w-full bg-black/30 text-gray-300 border border-gray-700 rounded p-2"
                  />
                </td>
                <td className="p-2">
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={!attr.required}
                      onChange={(e) =>
                        updateAttribute(index, "required", !e.target.checked)
                      }
                      className="bg-black/30 border border-gray-700 rounded"
                    />
                    Nullable
                  </label>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={attr.description}
                    onChange={(e) =>
                      updateAttribute(index, "description", e.target.value)
                    }
                    placeholder="Description"
                    className="w-full bg-black/30 text-gray-300 border border-gray-700 rounded p-2"
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => removeAttribute(index)}
                    className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-black"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addAttribute}
          className="mt-4 px-3 py-1 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black"
        >
          Add Attribute
        </button>
      </section>

      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
