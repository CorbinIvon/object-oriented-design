import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Extract objectName from URL path
  const objectName = request.url.split("/").pop();

  if (!objectName) {
    return NextResponse.json({ objects: [] });
  }

  const objects = await prisma.objectDef.findMany({
    where: {
      name: decodeURIComponent(objectName),
    },
    include: {
      creator: {
        select: {
          username: true,
        },
      },
      instances: true,
    },
  });

  return NextResponse.json({ objects });
}
