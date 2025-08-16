import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params: paramsPromise,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 403 });
  }
  const { id } = await paramsPromise;
  try {
    const getAllExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
    });

    return NextResponse.json(getAllExpense);
  } catch (e) {
    console.error("failed to fetch expensed", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 403 });
  }
  const { id } = await paramsPromise;
  const { amount, description, categoryId, date } = await req.json();

  try {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense || expense.userId !== userId) {
      return new NextResponse("Expense doesn't exist", { status: 404 });
    }

    const updateExpense = await prisma.expense.update({
      where: { id },
      data: { amount, description, categoryId, date },
    });

    return NextResponse.json(updateExpense);
  } catch (e) {
    console.error("Failed to update expense", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 403 });
  }
  const { id } = await paramsPromise;
  try {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense || expense.userId !== userId) {
      return new NextResponse("Expense doesn't exist", { status: 404 });
    }

    const deleteExpense = await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json(deleteExpense);
  } catch (e) {
    console.error("Failed to delete expense", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
