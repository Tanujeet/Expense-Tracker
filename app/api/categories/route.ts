import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 403 });
  }

  try {
    const findCategory = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(findCategory);
  } catch (e) {
    console.error("Failed to fetch expense", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 403 });
  }
  const { name, icon } = await req.json();

  if (!name) {
    return new NextResponse("Name is required", { status: 404 });
  }

  try {
    const createCategories = await prisma.category.create({
      data: {
        name,
        icon,
        userId,
      },
    });
    return NextResponse.json(createCategories);
  } catch (e) {
    console.error("Failed to fetch expense", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
