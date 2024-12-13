import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const methodParameterSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.string().min(1),
  defaultValue: z.string().nullable(),
  isOptional: z.boolean(),
});

const methodSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "PROTECTED"]),
  returnType: z.string().nullable(),
  parameters: z.array(methodParameterSchema),
});

const updateMethodsSchema = z.object({
  methods: z.array(methodSchema),
});

export async function PUT(
  request: Request,
  context: { params: Promise<{ objectName: string; instanceId: string }> }
) {
  const params = await context.params;
  try {
    const body = await request.json();
    const { methods } = updateMethodsSchema.parse(body);

    // Get existing methods
    const existingObject = await prisma.objectDef.findUnique({
      where: { id: params.instanceId },
      include: {
        methods: {
          include: {
            parameters: true,
          },
        },
      },
    });

    if (!existingObject) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 });
    }

    // Create sets of IDs for comparison
    const existingIds = new Set(
      existingObject.methods.map((method) => method.id)
    );
    const updatedIds = new Set(
      methods.filter((method) => method.id).map((method) => method.id)
    );

    // Find methods to delete
    const idsToDelete = [...existingIds].filter((id) => !updatedIds.has(id));

    // Perform the update in a transaction
    const updatedObject = await prisma.$transaction(async (tx) => {
      // Delete removed methods and their parameters
      if (idsToDelete.length > 0) {
        await tx.methodParameter.deleteMany({
          where: { methodId: { in: idsToDelete } },
        });
        await tx.objectMethod.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }

      // Update or create methods
      for (const method of methods) {
        if (method.id) {
          // Delete existing parameters
          await tx.methodParameter.deleteMany({
            where: { methodId: method.id },
          });

          // Update method
          await tx.objectMethod.update({
            where: { id: method.id },
            data: {
              name: method.name,
              description: method.description,
              visibility: method.visibility,
              returnType: method.returnType,
              parameters: {
                create: method.parameters,
              },
            },
          });
        } else {
          // Create new method
          await tx.objectMethod.create({
            data: {
              objectId: params.instanceId,
              name: method.name,
              description: method.description,
              visibility: method.visibility,
              returnType: method.returnType,
              parameters: {
                create: method.parameters,
              },
            },
          });
        }
      }

      // Fetch and return updated object
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
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid method data provided" },
        { status: 400 }
      );
    }
    console.error("Error updating methods:", error);
    return NextResponse.json(
      { error: "Failed to update methods" },
      { status: 500 }
    );
  }
}
