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

    return NextResponse.json({
      thisMonth: totalSpentThisMonth._sum.amount || 0,
      Totaltransactions: totalTransactions,
    });
  } catch (e) {
    console.error("Failed to get summary", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
