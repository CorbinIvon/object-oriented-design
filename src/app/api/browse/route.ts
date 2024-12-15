import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const count = await prisma.instance.count();
    console.log("Total instances in database:", count);

    const instances = await prisma.instance.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        objectDef: {
          select: {
            id: true,
            name: true,
            description: true,
            version: true,
          },
        },
        attributes: {
          select: {
            id: true,
            name: true,
            value: true,
          },
        },
        creator: {
          select: {
            username: true,
          },
        },
      },
    });

    console.log("Found instances:", instances.length);
    if (instances.length > 0) {
      const firstInstance = instances[0];
      console.log("First instance:", {
        id: firstInstance.id,
        name: firstInstance.name,
        objectName: firstInstance.objectDef.name,
        attributeCount: firstInstance.attributes.length,
      });
    }

    return NextResponse.json({ instances });
  } catch (error) {
    console.error("Error fetching instances:", error);
    return NextResponse.json(
      { error: "Failed to fetch instances" },
      { status: 500 }
    );
  }
}
