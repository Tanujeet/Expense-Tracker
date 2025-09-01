
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisMonthExpenses = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { date: { gte: firstDay } },
    });

    const totalTransactions = await prisma.expense.count();

    return NextResponse.json({
      thisMonth: thisMonthExpenses._sum.amount || 0,
      totalTransactions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
