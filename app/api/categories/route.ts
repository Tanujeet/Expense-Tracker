import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 403 });

  try {
    let categories = await prisma.category.findMany({ where: { userId } });

    if (categories.length === 0) {
      const defaultCategories = [
        { name: "Food", icon: "🍔" },
        { name: "Transport", icon: "🚌" },
        { name: "Shopping", icon: "🛍️" },
        { name: "Bills", icon: "💡" },
        { name: "Entertainment", icon: "🎬" },
      ];

      await prisma.category.createMany({
        data: defaultCategories.map((cat) => ({ ...cat, userId })),
      });

      categories = await prisma.category.findMany({ where: { userId } });
    }

    return NextResponse.json({ success: true, data: categories });
  } catch (e) {
    console.error("Failed to fetch categories", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { name, icon } = await req.json();

  if (!name) {
    return new NextResponse("Name is required", { status: 400 });
  }

  try {
    const category = await prisma.category.create({
      data: { name, icon, userId },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (e) {
    console.error("Failed to create category", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
