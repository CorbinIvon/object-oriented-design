import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { objectName: string } }
) {
  try {
    const objects = await prisma.objectDef.findMany({
      where: {
        name: params.objectName,
      },
      include: {
        creator: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json({
      objects,
    });
  } catch (error) {
    console.error("Error fetching objects:", error);
    return NextResponse.json(
      { error: "Failed to fetch objects" },
      { status: 500 }
    );
  }
}
