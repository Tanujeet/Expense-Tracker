import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 🔹 Total transactions
    const totalTransactions = await prisma.expense.count({
      where: { userId },
    });

    // 🔹 This month spent
    const totalSpentThisMonth = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        date: { gte: startOfMonth },
      },
    });

    // 🔹 Budget
    const totalBudget = await prisma.budget.aggregate({
      _sum: { limit: true },
      where: { userId },
    });

    const spent = totalSpentThisMonth._sum.amount || 0;
    const budget = totalBudget._sum.limit || 0;

    // 🔹 Recent Expenses
    const recentExpenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: { category: true },
      take: 5, // sirf last 5 dikhao
    });

    // 🔹 Recent Recurring Expenses
    const recentRecurring = await prisma.recurringExpense.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { category: true },
      take: 5,
    });

    // Merge dono lists
    const recentTransactions = [
      ...recentExpenses.map((e) => ({
        id: e.id,
        type: "expense",
        amount: e.amount,
        description: e.description,
        category: e.category.name,
        date: e.date,
      })),
      ...recentRecurring.map((r) => ({
        id: r.id,
        type: "recurring",
        amount: r.amount,
        description: r.description,
        category: r.category.name,
        date: r.startDate,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // latest first

    return NextResponse.json({
      totalSpentThisMonth: spent,
      totalBudget: budget,
      remainingBalance: budget - spent,
      totalTransactions,
      recentTransactions,
    });
  } catch (e) {
    console.error("Failed to get summary", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
