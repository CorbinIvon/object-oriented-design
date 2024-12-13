import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const { name } = params;

  try {
    const objectDef = await prisma.objectDef.findFirst({
      where: { name },
    });

    if (!objectDef) {
      return NextResponse.json(
        { error: `No object definition found with name "${name}"` },
        { status: 404 }
      );
    }

    const instances = await prisma.instance.findMany({
      where: { objectDefId: objectDef.id },
      include: { attributes: true },
    });

    return NextResponse.json({ objectDef, instances });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch object data" },
      { status: 500 }
    );
  }
}
