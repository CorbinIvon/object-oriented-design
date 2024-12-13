import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createObjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1),
  creatorId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, creatorId } = createObjectSchema.parse(body);

    // Check if object with same name exists (case insensitive)
    const existingObject = await prisma.objectDef.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingObject) {
      return NextResponse.json(
        { error: "An object with this name already exists" },
        { status: 400 }
      );
    }

    // Verify creator exists
    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Invalid creator ID" },
        { status: 400 }
      );
    }

    // Create the object
    const object = await prisma.objectDef.create({
      data: {
        name,
        description,
        creatorId,
        categories: [],
      },
      include: {
        attributes: true,
        methods: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({ object }, { status: 201 });
  } catch (error) {
    console.error("Object creation error:", error);

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
