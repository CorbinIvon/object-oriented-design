import { useState } from "react";
import type { ObjectMethod, MethodParameter } from "@prisma/client";
import type { MethodUpdate, MethodParameterUpdate } from "./types";

interface ObjectMethodWithParams extends ObjectMethod {
  parameters: MethodParameter[];
}

interface EditMethodsProps {
  methods: ObjectMethodWithParams[];
  onSave: (methods: MethodUpdate[]) => void;
  onCancel: () => void;
}

export default function EditMethods({
  methods = [], // Add default empty array
  onSave,
  onCancel,
}: EditMethodsProps) {
  const [methodList, setMethodList] = useState<MethodUpdate[]>(
    (methods || []).map(
      ({ id, name, description, visibility, returnType, parameters = [] }) => ({
        id,
        name,
        description,
        visibility,
        returnType,
        parameters: (parameters || []).map(
          ({ id, name, type, defaultValue, isOptional }) => ({
            id,
            name,
            type,
            defaultValue,
            isOptional,
          })
        ),
      })
    )
  );

  const addMethod = () => {
    setMethodList([
      ...methodList,
      {
        name: "",
        description: "",
        visibility: "PUBLIC",
        returnType: "void",
        parameters: [],
      },
    ]);
  };

  const removeMethod = (index: number) => {
    setMethodList(methodList.filter((_, i) => i !== index));
  };

  const updateMethod = (
    index: number,
    field: keyof MethodUpdate,
    value: string | MethodParameterUpdate[]
  ) => {
    setMethodList(
      methodList.map((method, i) =>
        i === index ? { ...method, [field]: value } : method
      )
    );
  };

  const addParameter = (methodIndex: number) => {
    const method = methodList[methodIndex];
    updateMethod(methodIndex, "parameters", [
      ...method.parameters,
      { name: "", type: "string", isOptional: false },
    ]);
  };

  const removeParameter = (methodIndex: number, paramIndex: number) => {
    const method = methodList[methodIndex];
    updateMethod(
      methodIndex,
      "parameters",
      method.parameters.filter((_, i) => i !== paramIndex)
    );
  };

  const updateParameter = (
    methodIndex: number,
    paramIndex: number,
    field: keyof MethodParameterUpdate,
    value: string | boolean
  ) => {
    const method = methodList[methodIndex];
    updateMethod(
      methodIndex,
      "parameters",
      method.parameters.map((param, i) =>
        i === paramIndex ? { ...param, [field]: value } : param
      )
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      {methodList.map((method, methodIndex) => (
        <section
          key={methodIndex}
          className="border border-gray-800 bg-black/50 p-4 rounded"
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={method.name}
              onChange={(e) =>
                updateMethod(methodIndex, "name", e.target.value)
              }
              placeholder="Method Name"
              className="bg-black/30 text-gray-300 border border-gray-700 rounded p-2"
            />
            <select
              value={method.visibility}
              onChange={(e) =>
                updateMethod(methodIndex, "visibility", e.target.value)
              }
              className="bg-black/30 text-gray-300 border border-gray-700 rounded p-2"
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
              <option value="PROTECTED">Protected</option>
            </select>
            <input
              type="text"
              value={method.returnType || ""}
              onChange={(e) =>
                updateMethod(methodIndex, "returnType", e.target.value)
              }
              placeholder="Return Type"
              className="bg-black/30 text-gray-300 border border-gray-700 rounded p-2"
            />
          </div>

          <textarea
            value={method.description}
            onChange={(e) =>
              updateMethod(methodIndex, "description", e.target.value)
            }
            placeholder="Description"
            className="w-full bg-black/30 text-gray-300 border border-gray-700 rounded p-2 mb-4"
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-green-500">Parameters</h3>
              <button
                onClick={() => addParameter(methodIndex)}
                className="px-2 py-1 text-xs text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black"
              >
                Add Parameter
              </button>
            </div>

            {method.parameters.map((param, paramIndex) => (
              <div
                key={paramIndex}
                className="grid grid-cols-4 gap-2 items-center"
              >
                <input
                  type="text"
                  value={param.name}
                  onChange={(e) =>
                    updateParameter(
                      methodIndex,
                      paramIndex,
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Parameter Name"
                  className="bg-black/30 text-gray-300 border border-gray-700 rounded p-2"
                />
                <input
                  type="text"
                  value={param.type}
                  onChange={(e) =>
                    updateParameter(
                      methodIndex,
                      paramIndex,
                      "type",
                      e.target.value
                    )
                  }
                  placeholder="Type"
                  className="bg-black/30 text-gray-300 border border-gray-700 rounded p-2"
                />
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={param.isOptional}
                    onChange={(e) =>
                      updateParameter(
                        methodIndex,
                        paramIndex,
                        "isOptional",
                        e.target.checked
                      )
                    }
                    className="bg-black/30 border border-gray-700 rounded"
                  />
                  Optional
                </label>
                <button
                  onClick={() => removeParameter(methodIndex, paramIndex)}
                  className="px-2 py-1 text-xs text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-black"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => removeMethod(methodIndex)}
              className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-black"
            >
              Remove Method
            </button>
          </div>
        </section>
      ))}

      <div className="flex justify-between">
        <button
          onClick={addMethod}
          className="px-3 py-1 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black"
        >
          Add Method
        </button>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(methodList)}
            className="px-4 py-2 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-black"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
