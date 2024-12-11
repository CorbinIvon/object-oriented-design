import { PrismaClient } from "@prisma/client";
import Header from "../../components/Header";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function ObjectPage({
  params,
}: {
  params: { name: string };
}) {
  const objectName = await Promise.resolve(params.name);

  const object = await prisma.object.findFirst({
    where: {
      name: {
        equals: objectName,
        mode: "insensitive",
      },
    },
    include: {
      attributes: true,
      methods: {
        include: {
          parameters: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      fromRelationships: {
        include: {
          toObject: true,
        },
      },
      toRelationships: {
        include: {
          fromObject: true,
        },
      },
    },
  });

  if (!object) {
    return (
      <div className="min-h-screen p-4 font-mono">
        <div className="max-w-3xl mx-auto border border-gray-800 bg-black/50 px-6 py-2 rounded">
          <Header />
          <div className="mt-4 space-y-4">
            <div className="border border-gray-800 bg-black/50 p-4 rounded">
              <div className="text-red-500">
                Object &quot;{objectName}&quot; not found
              </div>
              <div className="mt-4">
                <Link
                  href={`/create?name=${encodeURIComponent(objectName)}`}
                  className="inline-block px-4 py-2 bg-black border border-gray-800 text-green-500 hover:bg-gray-900"
                >
                  {"> "}Create &quot;{objectName}&quot;
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
            <h1 className="text-2xl text-green-500">{object.name}</h1>
            <p className="text-gray-400 mt-2">{object.description}</p>

            {/* Attributes Section */}
            <div className="mt-4">
              <h2 className="text-green-500">Attributes</h2>
              <div className="mt-2 space-y-2">
                {object.attributes.map((attr) => (
                  <div key={attr.id} className="text-gray-400">
                    {attr.name}: {attr.type}
                    {attr.required && " (required)"}
                  </div>
                ))}
              </div>
            </div>

            {/* Methods Section */}
            <div className="mt-4">
              <h2 className="text-green-500">Methods</h2>
              <div className="mt-2 space-y-2">
                {object.methods.map((method) => (
                  <div key={method.id} className="text-gray-400">
                    <div>
                      {method.visibility.toLowerCase()} {method.name}(
                      {method.parameters.map(
                        (p, i) =>
                          `${p.name}: ${p.type}${p.isOptional ? "?" : ""}${
                            i < method.parameters.length - 1 ? ", " : ""
                          }`
                      )}
                      ){method.returnType ? `: ${method.returnType}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relationships Section */}
            <div className="mt-4">
              <h2 className="text-green-500">Relationships</h2>
              <div className="mt-2 space-y-2">
                {object.fromRelationships.map((rel) => (
                  <div key={rel.id} className="text-gray-400">
                    {`${rel.type.toLowerCase()} → ${rel.toObject.name}`}
                  </div>
                ))}
                {object.toRelationships.map((rel) => (
                  <div key={rel.id} className="text-gray-400">
                    {`${rel.fromObject.name} → ${rel.type.toLowerCase()}`}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            {object.tags.length > 0 && (
              <div className="mt-4">
                <h2 className="text-green-500">Tags</h2>
                <div className="flex gap-2 mt-2">
                  {object.tags.map(({ tag }) => (
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
