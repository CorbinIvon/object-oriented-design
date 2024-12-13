import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const object = await prisma.object.findFirst({
      where: {
        name: {
          equals: params.name,
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
      return NextResponse.json({ error: "Object not found" }, { status: 404 });
    }

    return NextResponse.json({ object });
  } catch (error) {
    console.error("Object fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
