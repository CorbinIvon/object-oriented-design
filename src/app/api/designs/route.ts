import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const countOnly = searchParams.get("count") === "true";

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (countOnly) {
      const count = await prisma.objectDef.count({
        where: { creatorId: userId },
      });
      return NextResponse.json({ count });
    }

    const designs = await prisma.objectDef.findMany({
      where: {
        creatorId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        version: true,
      },
    });

    return NextResponse.json(designs);
  } catch (error) {
    console.error("Failed to fetch designs:", error);
    return NextResponse.json(
      { error: "Failed to fetch designs" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
