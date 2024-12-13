import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateObjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1),
  userId: z.string().uuid(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ objectName: string; instanceId: string }> }
) {
  const params = await context.params;
  try {
    const body = await request.json();
    const { name, description, userId } = updateObjectSchema.parse(body);

    // Get the original object for comparison
    const originalObject = await prisma.objectDef.findUnique({
      where: { id: params.instanceId },
      include: { attributes: true, methods: true },
    });

    if (!originalObject) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 });
    }

    // Update the object
    const updatedObject = await prisma.objectDef.update({
      where: { id: params.instanceId },
      data: {
        name,
        description,
        history: {
          create: {
            userId,
            changes: JSON.stringify({
              previous: {
                name: originalObject.name,
                description: originalObject.description,
              },
              new: { name, description },
            }),
          },
        },
      },
      include: {
        attributes: true,
        methods: true,
        history: true,
      },
    });

    return NextResponse.json({ object: updatedObject });
  } catch (error) {
    // ...existing error handling code...
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ objectName: string; instanceId: string }> }
) {
  const params = await context.params;

  try {
    const object = await prisma.objectDef.findUnique({
      where: {
        id: params.instanceId,
      },
      include: {
        instances: {
          include: {
            attributes: true,
          },
        },
        creator: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!object) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 });
    }

    return NextResponse.json({ object });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "Failed to fetch object" },
      { status: 500 }
    );
  }
}
