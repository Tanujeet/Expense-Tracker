import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const { id } = await paramsPromise;

  try {
    const getSinglebudget = await prisma.budget.findUnique({
      where: { id, userId },
      include: { category: true },
    });
    if (!getSinglebudget) {
      return new NextResponse("Budget not found", { status: 404 });
    }
    const expenses = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        categoryId: getSinglebudget.categoryId,
        date: {
          gte: getSinglebudget.startDate,
          lte: getSinglebudget.endDate,
        },
      },
    });

    const spent = expenses._sum.amount ?? 0;
    const remaining = getSinglebudget.limit - spent;

    return NextResponse.json({
      ...getSinglebudget,
      spent,
      remaining,
    });
  } catch (e) {
    console.error("Failet to get one budget", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const { id } = await paramsPromise;
  const { limit, startDate, endDate, categoryId } = await req.json();

  try {
    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!existingBudget) {
      return new NextResponse("Budget not found", { status: 404 });
    }

    if (existingBudget.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const updateBudget = await prisma.budget.update({
      where: { id },
      data: {
        ...(limit !== undefined && { limit }),
        ...(startDate !== undefined && { startDate }),
        ...(endDate !== undefined && { endDate }),
        ...(categoryId !== undefined && { categoryId }),
      },
    });

    return NextResponse.json(updateBudget);
  } catch (e) {
    console.error("Failet to update budget", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { id } = await paramsPromise;

  try {
    const budget = await prisma.budget.findUnique({ where: { id } });

    if (!budget || budget.userId !== userId) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 });
    }

    const deleteBudget = await prisma.budget.delete({
      where: { id, userId },
    });

    return NextResponse.json(deleteBudget);
  } catch (e) {
    console.error("Failet to delete budget", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
