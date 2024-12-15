import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateObjectSchema = z.object({
  description: z.string().min(1),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ objectName: string; instanceId: string }> }
) {
  const params = await context.params;
  try {
    const body = await request.json();
    const { description } = updateObjectSchema.parse(body);

    const updatedObject = await prisma.objectDef.update({
      where: { id: params.instanceId },
      data: { description },
      include: {
        attributes: true,
        methods: true,
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

    return NextResponse.json({ object: updatedObject });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid update data provided" },
        { status: 400 }
      );
    }
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "Failed to update object" },
      { status: 500 }
    );
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
        instances: {
          include: {
            attributes: true,
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

    if (!object) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 });
    }

    // Ensure all arrays exist even if empty
    const sanitizedObject = {
      ...object,
      attributes: object.attributes || [],
      methods: object.methods || [],
      instances: object.instances || [],
      fromRelationships: object.fromRelationships || [],
      toRelationships: object.toRelationships || [],
    };

    return NextResponse.json({ object: sanitizedObject });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      { error: "Failed to fetch object" },
      { status: 500 }
    );
  }
}
