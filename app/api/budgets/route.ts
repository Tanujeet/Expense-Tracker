import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { get } from "http";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  try {
    const getBudget = await prisma.budget.findMany({
      where: { userId: userId },
      include: { category: true },
    });

    for (const budget of getBudget) {
      const expenses = await prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          categoryId: budget.categoryId, // yaha error nahi aayega ab
          date: {
            gte: budget.startDate,
            lte: budget.endDate,
          },
        },
      });

      console.log(
        `Category: ${budget.category.name}, Remaining: ${
          budget.limit - (expenses._sum.amount ?? 0)
        }`
      );
    }
  } catch (e) {
    console.error("Failed to get budget", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}



export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { limit, endDate, startDate, categoryId } = await req.json();
  try {
    const newBudget = await prisma.budget.create({
      data: {
        userId: userId,
        categoryId: categoryId,
        limit: limit,
        startDate: startDate,
        endDate: endDate,
      },
    });

    return NextResponse.json(newBudget);
  } catch (e) {
    console.error("Failed to create budget", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
