"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { prisma } from "@/lib/prisma";
import { Instance, InstanceAttribute } from "@prisma/client";

type InstanceWithAttributes = Instance & {
  attributes: InstanceAttribute[];
};

export default function InstancePage() {
  const { name, id } = useParams();
  const [instance, setInstance] = useState<InstanceWithAttributes | null>(null);

  useEffect(() => {
    async function fetchInstance() {
      const instanceData = await prisma.instance.findUnique({
        where: {
          id: id as string,
        },
        include: {
          attributes: true,
          objectDef: true,
        },
      });
      setInstance(instanceData);
    }

    if (id) {
      fetchInstance();
    }
  }, [id]);

  if (!instance) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-4">{instance.name}</h1>
      <p className="text-gray-400 mb-4">Instance of {name}</p>

      <div className="bg-gray-800 rounded p-4">
        <h2 className="text-xl mb-2">Attributes</h2>
        {instance.attributes.map((attr) => (
          <div key={attr.id} className="flex gap-4 py-2">
            <span className="text-gray-400">{attr.name}:</span>
            <span>{attr.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
