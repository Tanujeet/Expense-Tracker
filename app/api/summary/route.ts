import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    // total budget (budgets ka sum)
    const totalBudgetAggregate = await prisma.budget.aggregate({
      _sum: { limit: true },
      where: { userId },
    });
    const totalBudget = totalBudgetAggregate._sum.limit || 0;

    // total spent this month
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const totalSpentThisMonth = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        date: { gte: startOfMonth },
      },
    });

    const spent = totalSpentThisMonth._sum.amount || 0;

    return NextResponse.json({
      totalBudget,
      totalSpentThisMonth: spent,
      remainingBalance: totalBudget - spent,
    });
  } catch (e) {
    console.error("Failed to get summary", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
