import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 400 }
      );
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password,
        role: UserRole.VIEWER,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);

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
