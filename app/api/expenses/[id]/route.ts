import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import next from "next";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 403 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const categoryId = searchParams.get("categoryId");

    const whereClause: any = {
      userId,
    };

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    const getExpense = await prisma.expense.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(getExpense);
  } catch (e) {
    console.error("Failed to get expense", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 403 });
  }
  const { amount, categoryId, description, date } = await req.json();
  if (!amount || amount == 0) {
    return new NextResponse("Amount must be greator thna 0", { status: 400 });
  }
  if (!categoryId) {
    return new NextResponse("Category is required", { status: 400 });
  }
  try {
    const newExpense = await prisma.expense.create({
      data: {
        userId,
        amount,
        categoryId,
        description: description || "",
        date: date ? new date(date) : new date(),
      },
    });
    return NextResponse.json(newExpense);
  } catch (e) {
    console.error("Failed to Post expense", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
