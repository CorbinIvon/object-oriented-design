import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const attributeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.string().min(1),
  description: z.string(),
  defaultValue: z.string().nullable(),
  required: z.boolean(),
});

const updateAttributesSchema = z.object({
  attributes: z.array(attributeSchema),
});

export async function PUT(
  request: Request,
  context: { params: Promise<{ objectName: string; instanceId: string }> }
) {
  const params = await context.params;
  try {
    const body = await request.json();
    const { attributes } = updateAttributesSchema.parse(body);

    // Check if user is authorized
    const existingObject = await prisma.objectDef.findUnique({
      where: { id: params.instanceId },
      select: { creatorId: true },
    });

    if (!existingObject) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 });
    }

    // Get current user ID from request headers
    const currentUserId = request.headers.get("X-User-Id");
    if (!currentUserId || currentUserId !== existingObject.creatorId) {
      return NextResponse.json(
        { error: "Not authorized to modify this object" },
        { status: 403 }
      );
    }

    // Get existing attributes
    const existingObjectWithAttributes = await prisma.objectDef.findUnique({
      where: { id: params.instanceId },
      include: { attributes: true },
    });

    // Create sets of IDs for comparison
    if (!existingObjectWithAttributes) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 });
    }
    const existingIds = new Set(
      existingObjectWithAttributes.attributes.map((attr) => attr.id)
    );
    const updatedIds = new Set(
      attributes.filter((attr) => attr.id).map((attr) => attr.id)
    );

    // Find attributes to delete (exist in DB but not in update)
    const idsToDelete = [...existingIds].filter((id) => !updatedIds.has(id));

    // Perform the update in a transaction
    const updatedObject = await prisma.$transaction(async (tx) => {
      // Delete removed attributes
      if (idsToDelete.length > 0) {
        await tx.objectAttribute.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }

      // Update or create attributes
      for (const attr of attributes) {
        if (attr.id) {
          // Update existing attribute
          await tx.objectAttribute.update({
            where: { id: attr.id },
            data: {
              name: attr.name,
              type: attr.type,
              description: attr.description,
              defaultValue: attr.defaultValue,
              required: attr.required,
            },
          });
        } else {
          // Create new attribute
          await tx.objectAttribute.create({
            data: {
              objectId: params.instanceId,
              name: attr.name,
              type: attr.type,
              description: attr.description,
              defaultValue: attr.defaultValue,
              required: attr.required,
            },
          });
        }
      }

      // Fetch and return the updated object
      return await tx.objectDef.findUnique({
        where: { id: params.instanceId },
        include: {
          attributes: true,
          methods: {
            include: {
              parameters: true,
            },
          },
          creator: {
            select: {
              id: true,
              username: true,
            },
          },
          fromRelationships: {
            include: {
              toObject: {
                select: {
                  name: true,
                },
              },
            },
          },
          toRelationships: {
            include: {
              fromObject: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json({ object: updatedObject });
  } catch (error) {
    console.error("Error updating attributes:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid attribute data provided" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update attributes" },
      { status: 500 }
    );
  }
}
