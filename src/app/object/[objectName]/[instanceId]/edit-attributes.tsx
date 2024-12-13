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

  return (
    <div className="container mx-auto p-6 space-y-4">
      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <h2 className="text-green-500 mb-4">{"> "} Edit Attributes</h2>
        <div className="space-y-4">
          {attrs.map((attr, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 items-start">
              <input
                type="text"
                value={attr.name}
                onChange={(e) => updateAttribute(index, "name", e.target.value)}
                placeholder="Name"
                className="col-span-1 bg-black/30 text-gray-300 border border-gray-700 rounded p-2"
              />
              <input
                type="text"
                value={attr.type}
                onChange={(e) => updateAttribute(index, "type", e.target.value)}
                placeholder="Type"
                className="col-span-1 bg-black/30 text-gray-300 border border-gray-700 rounded p-2"
              />
              <input
                type="text"
                value={attr.defaultValue || ""}
                onChange={(e) =>
                  updateAttribute(index, "defaultValue", e.target.value)
                }
                placeholder="Default Value"
                className="col-span-1 bg-black/30 text-gray-300 border border-gray-700 rounded p-2"
              />
              <div className="col-span-1 flex items-center">
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={attr.required}
                    onChange={(e) =>
                      updateAttribute(index, "required", e.target.checked)
                    }
                    className="bg-black/30 border border-gray-700 rounded"
                  />
                  Required
                </label>
              </div>
              <input
                type="text"
                value={attr.description}
                onChange={(e) =>
                  updateAttribute(index, "description", e.target.value)
                }
                placeholder="Description"
                className="col-span-1 bg-black/30 text-gray-300 border border-gray-700 rounded p-2"
              />
              <button
                onClick={() => removeAttribute(index)}
                className="col-span-1 px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-black"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
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
          onClick={() => onSave(attrs)}
          className="px-4 py-2 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
