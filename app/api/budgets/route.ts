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
        const limit = budget.limit ?? 0; // safe default
        const remaining = Number(limit) - Number(totalSpent);

        return {
          ...budget,
          spent: totalSpent,
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
        userId,
        categoryId,
        limit,
        startDate,
        endDate,
        name,
      },
      include: { category: true },
    });

    // default creation me koi expense nahi hoga, par consistency ke liye:
    return NextResponse.json({
      ...newBudget,
      totalSpent: 0,
      remainingBudget: limit,
    });
  } catch (e) {
    console.error("Failed to create budget", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
