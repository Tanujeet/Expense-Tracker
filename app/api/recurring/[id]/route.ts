import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const { id } = await paramsPromise;

  try {
    const expense = await prisma.recurringExpense.findUnique({
      where: { id },
    });

    if (!expense || expense.userId !== userId) {
      return new NextResponse("Expense not found", { status: 404 });
    }
    return NextResponse.json(expense);
  } catch (e) {
    console.error("Failed to get recurring budget", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const { id } = await paramsPromise;
  const { categoryId, amount, description, interval, startDate, endDate } =
    await req.json();

  try {
    const expense = await prisma.recurringExpense.findUnique({
      where: { id },
    });

    if (!expense || expense.userId !== userId) {
      return new NextResponse("Expense not found", { status: 404 });
    }

    const updateRecurringExpense = await prisma.recurringExpense.update({
      where: { id },
      data: {
        categoryId: categoryId ?? expense.categoryId,
        amount: amount ?? expense.amount,
        description: description ?? expense.description,
        interval: interval ?? expense.interval,
        startDate: startDate ?? expense.startDate,
        endDate: endDate ?? expense.endDate,
      },
    });
    return NextResponse.json(updateRecurringExpense);
  } catch (e) {
    console.error("Failed to Update budget", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  const { id } = await paramsPromise;

  try {
    const expense = await prisma.recurringExpense.findUnique({
      where: { id },
    });

    if (!expense || expense.userId !== userId) {
      return new NextResponse("Expense not found", { status: 404 });
    }

    const delelteRecurringExpense = await prisma.recurringExpense.delete({
      where: { id },
    });

    return NextResponse.json(delelteRecurringExpense);
  } catch (e) {
    console.error("Failed to Update budget", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}



