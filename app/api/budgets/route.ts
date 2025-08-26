import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { category: true },
    });

    // Promise.all for parallel queries
    const budgetsWithRemaining = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await prisma.expense.aggregate({
          _sum: { amount: true },
          where: {
            userId,
            categoryId: budget.categoryId,
            date: {
              gte: budget.startDate,
              lte: budget.endDate,
            },
          },
        });

        const totalSpent = expenses._sum.amount ?? 0;
        const remaining = budget.limit - totalSpent;

        return {
          ...budget,
          totalSpent,
          remainingBudget: remaining,
        };
      }),
    );

    return NextResponse.json(budgetsWithRemaining);
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

  const { limit, endDate, startDate, categoryId, name } = await req.json();
  try {
    const newBudget = await prisma.budget.create({
      data: {
        userId: userId,
        categoryId: categoryId,
        limit: limit,
        startDate: startDate,
        endDate: endDate,
        name: name,
      },
    });
    console.log({ limit, endDate, startDate, categoryId });
    return NextResponse.json(newBudget);
  } catch (e) {
    console.error("Failed to create budget", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
