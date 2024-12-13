import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updateObjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1),
  userId: z.string().uuid(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, userId } = updateObjectSchema.parse(body);

    // Get the original object for comparison
    const originalObject = await prisma.object.findUnique({
      where: { id: params.id },
      include: { attributes: true, methods: true },
    });

    if (!originalObject) {
      return NextResponse.json({ error: "Object not found" }, { status: 404 });
    }

    // Update the object
    const updatedObject = await prisma.object.update({
      where: { id: params.id },
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
    console.error("Object update error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
