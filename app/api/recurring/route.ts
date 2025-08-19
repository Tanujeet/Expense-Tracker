import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { userId } = await auth()
    if (!userId) {
        return new NextResponse("Unauthorized",{status:403})
    }
 const { searchParams } = new URL(req.url);
 const categoryId = searchParams.get("categoryId");
 const activeOnly = searchParams.get("activeOnly") === "true";
    try {


        const today = new Date();

        const recurring = await prisma.recurringExpense.findMany({
            where: {
                userId,
                ...(categoryId ? { categoryId } : {}),
                ...(activeOnly
                    ? {
                        OR: [
                            { endDate: null },
                            { endDate: { gte: today } },
                        ],
                        startDate: { lte: today },
                    }
                    : {}),
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(recurring)
    } catch (e) {
        console.error("failed to get recurring expense", e)
        return new NextResponse("Internal Server Error",{status:500})
        
    }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { categoryId, amount, description, interval, startDate, endDate } =
    await req.json();

  if (!categoryId || !amount || !interval || !startDate) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  try {
    const recurringExpense = await prisma.recurringExpense.create({
      data: {
        userId,
        categoryId,
        amount,
        description,
        interval,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(recurringExpense);
  } catch (e) {
    console.error("Failed to create Recurring Expense", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}