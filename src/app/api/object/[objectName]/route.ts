import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { objectName: string } }
) {
  const { objectName } = params;

  try {
    const objectDef = await prisma.objectDef.findFirst({
      where: { name: objectName },
    });

    if (!objectDef) {
      return NextResponse.json(
        { error: `No object definition found with name "${objectName}"` },
        { status: 404 }
      );
    }

    const instances = await prisma.instance.findMany({
      where: { objectDefId: objectDef.id },
      include: { attributes: true },
    });

    return NextResponse.json({ objectDef, instances });
  } catch (error: unknown) {
    console.error("Error fetching object data:", error);
    return NextResponse.json(
      { error: "Failed to fetch object data" },
      { status: 500 }
    );
  }
}
