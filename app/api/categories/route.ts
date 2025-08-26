import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorised", { status: 403 });

  try {
    let categories = await prisma.category.findMany({ where: { userId } });

    if (categories.length === 0) {
      // Create default categories lazily
      const defaultCategories = [
        { name: "Food", icon: "🍔" },
        { name: "Transport", icon: "🚌" },
        { name: "Shopping", icon: "🛍️" },
        { name: "Bills", icon: "💡" },
        { name: "Entertainment", icon: "🎬" },
      ];

      for (const cat of defaultCategories) {
        await prisma.category.create({ data: { ...cat, userId } });
      }

      categories = await prisma.category.findMany({ where: { userId } });
    }

    return NextResponse.json(categories);
  } catch (e) {
    console.error("Failed to fetch categories", e);
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
