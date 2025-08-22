import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    // ✅ Parse query params
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const dateParam = searchParams.get("date");
    const filterDate = dateParam ? new Date(dateParam) : null;

    // ✅ Fetch budgets for this user
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        ...(categoryId ? { categoryId } : {}),
        ...(filterDate
          ? {
              startDate: { lte: filterDate },
              endDate: { gte: filterDate },
            }
          : {}),
      },
      include: {
        category: true,
      },
    });

    // ✅ Calculate summary for each budget
    const summaries = await Promise.all(
      budgets.map(async (budget) => {
        const spentAgg = await prisma.expense.aggregate({
          _sum: {
            amount: true,
          },
          where: {
            userId,
            categoryId: budget.categoryId,
            date: {
              gte: budget.startDate,
              lte: budget.endDate,
            },
          },
        });

        const spent = spentAgg._sum.amount || 0;
        const remaining = Math.max(budget.limit - spent, 0);
        const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

        // Status calculation
        let status = "active";
        const today = new Date();
        if (today < budget.startDate) {
          status = "upcoming";
        } else if (today > budget.endDate) {
          status = "expired";
        }
        if (spent > budget.limit) {
          status = "overspent";
        }

        return {
          budgetId: budget.id,
          categoryId: budget.categoryId,
          categoryName: budget.category.name,
          limit: budget.limit,
          spent,
          remaining,
          percentage: Math.round(percentage),
          status,
          startDate: budget.startDate,
          endDate: budget.endDate,
        };
      }),
    );

    return NextResponse.json(summaries);
  } catch (e) {
    console.error("Failed to get summary", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
