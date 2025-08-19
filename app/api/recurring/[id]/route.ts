import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { detectConflictingPaths } from "next/dist/build/utils";
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

  try {
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



